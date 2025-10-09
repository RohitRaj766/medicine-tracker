import { prisma } from '../lib/database';
import { Medicine, MedicineLog, MedicineStatus } from '../types';
import { 
  CreateMedicineRequest, 
  UpdateMedicineRequest, 
  MedicineQueryParams,
  MedicineStatsResponse 
} from '../types';

export class MedicineService {
  static async createMedicine(userId: string, data: CreateMedicineRequest): Promise<Medicine> {
    return await prisma.medicine.create({
      data: {
        userId,
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
      }
    });
  }

  static async getMedicines(
    userId: string, 
    params: MedicineQueryParams = {}
  ): Promise<{ medicines: Medicine[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      status,
      search
    } = params;

    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = { userId };

    if (startDate || endDate) {
      where.AND = [];
      if (startDate) {
        where.AND.push({ startDate: { gte: new Date(startDate) } });
      }
      if (endDate) {
        where.AND.push({ endDate: { lte: new Date(endDate) } });
      }
    }

    if (search) {
      where.OR = [
        { medicineName: { contains: search, mode: 'insensitive' } },
        { dosage: { contains: search, mode: 'insensitive' } },
        { medicineType: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [medicines, total] = await Promise.all([
      prisma.medicine.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.medicine.count({ where })
    ]);

    return { medicines, total };
  }

  static async getMedicineById(userId: string, medicineId: string): Promise<Medicine | null> {
    return await prisma.medicine.findFirst({
      where: {
        id: medicineId,
        userId
      }
    });
  }

  static async updateMedicine(
    userId: string, 
    medicineId: string, 
    data: UpdateMedicineRequest
  ): Promise<Medicine> {
    // Check if medicine belongs to user
    const existingMedicine = await this.getMedicineById(userId, medicineId);
    if (!existingMedicine) {
      throw new Error('Medicine not found');
    }

    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);

    return await prisma.medicine.update({
      where: { id: medicineId },
      data: updateData
    });
  }

  static async deleteMedicine(userId: string, medicineId: string): Promise<void> {
    // Check if medicine belongs to user
    const existingMedicine = await this.getMedicineById(userId, medicineId);
    if (!existingMedicine) {
      throw new Error('Medicine not found');
    }

    await prisma.medicine.delete({
      where: { id: medicineId }
    });
  }

  static async getMedicinesForDate(userId: string, date: Date): Promise<Medicine[]> {
    const dateStr = date.toISOString().split('T')[0];
    
    return await prisma.medicine.findMany({
      where: {
        userId,
        startDate: { lte: date },
        endDate: { gte: date }
      },
      orderBy: { time: 'asc' }
    });
  }

  static async logMedicine(
    userId: string,
    medicineId: string,
    date: Date,
    status: MedicineStatus,
    notes?: string
  ): Promise<MedicineLog> {
    // Check if medicine belongs to user
    const medicine = await this.getMedicineById(userId, medicineId);
    if (!medicine) {
      throw new Error('Medicine not found');
    }

    // Check if log already exists for this date
    const existingLog = await prisma.medicineLog.findUnique({
      where: {
        userId_medicineId_date: {
          userId,
          medicineId,
          date
        }
      }
    });

    if (existingLog) {
      // Update existing log
      return await prisma.medicineLog.update({
        where: { id: existingLog.id },
        data: { status, notes }
      });
    } else {
      // Create new log
      return await prisma.medicineLog.create({
        data: {
          userId,
          medicineId,
          date,
          status,
          notes
        }
      });
    }
  }

  static async getMedicineLogs(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<MedicineLog[]> {
    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    return await prisma.medicineLog.findMany({
      where,
      include: {
        medicine: true
      },
      orderBy: { date: 'desc' }
    });
  }

  static async getMedicineStats(userId: string): Promise<MedicineStatsResponse> {
    const [totalMedicines, logs] = await Promise.all([
      prisma.medicine.count({ where: { userId } }),
      prisma.medicineLog.findMany({
        where: { userId },
        include: { medicine: true }
      })
    ]);

    const totalTaken = logs.filter((log: any) => log.status === 'TAKEN').length;
    const totalMissed = logs.filter((log: any) => log.status === 'MISSED').length;
    const totalEntries = totalTaken + totalMissed;
    const complianceRate = totalEntries > 0 ? (totalTaken / totalEntries) * 100 : 0;

    // Calculate streaks
    const sortedDates = logs
      .filter((log: any) => log.status === 'TAKEN')
      .map((log: any) => log.date)
      .sort((a: any, b: any) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const date of sortedDates) {
      if (lastDate === null) {
        tempStreak = 1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        currentStreak = date.getTime() === today.getTime() ? 1 : 0;
      } else {
        const daysDiff = Math.floor((lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          tempStreak++;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (date.getTime() === today.getTime()) {
            currentStreak = tempStreak;
          }
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      lastDate = date;
    }

    longestStreak = Math.max(longestStreak, tempStreak);
    const totalDaysTracked = new Set(logs.map((log: any) => log.date.toISOString().split('T')[0])).size;

    return {
      totalMedicines,
      totalTaken,
      totalMissed,
      complianceRate: Math.round(complianceRate * 100) / 100,
      currentStreak,
      longestStreak,
      totalDaysTracked
    };
  }
}
