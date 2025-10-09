import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse, MedicineQueryParams } from '../types';
import { MedicineService } from '../services/medicineService';

export class MedicineController {
  static async createMedicine(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user!.id;
      const medicine = await MedicineService.createMedicine(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Medicine created successfully',
        data: medicine
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create medicine',
        error: 'CREATE_MEDICINE_ERROR'
      });
    }
  }

  static async getMedicines(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user!.id;
      const queryParams: MedicineQueryParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        status: req.query.status as any,
        search: req.query.search as string
      };

      const { medicines, total } = await MedicineService.getMedicines(userId, queryParams);

      res.status(200).json({
        success: true,
        message: 'Medicines retrieved successfully',
        data: medicines,
        pagination: {
          page: queryParams.page!,
          limit: queryParams.limit!,
          total,
          totalPages: Math.ceil(total / queryParams.limit!)
        }
      } as any);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve medicines',
        error: 'GET_MEDICINES_ERROR'
      });
    }
  }

  static async getMedicineById(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user!.id;
      const medicineId = req.params.id;
      
      const medicine = await MedicineService.getMedicineById(userId, medicineId);
      
      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: 'Medicine not found',
          error: 'MEDICINE_NOT_FOUND'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Medicine retrieved successfully',
        data: medicine
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve medicine',
        error: 'GET_MEDICINE_ERROR'
      });
    }
  }

  static async updateMedicine(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user!.id;
      const medicineId = req.params.id;
      
      const medicine = await MedicineService.updateMedicine(userId, medicineId, req.body);

      res.status(200).json({
        success: true,
        message: 'Medicine updated successfully',
        data: medicine
      });
    } catch (error: any) {
      const statusCode = error.message === 'Medicine not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update medicine',
        error: 'UPDATE_MEDICINE_ERROR'
      });
    }
  }

  static async deleteMedicine(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user!.id;
      const medicineId = req.params.id;
      
      await MedicineService.deleteMedicine(userId, medicineId);

      res.status(200).json({
        success: true,
        message: 'Medicine deleted successfully'
      });
    } catch (error: any) {
      const statusCode = error.message === 'Medicine not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to delete medicine',
        error: 'DELETE_MEDICINE_ERROR'
      });
    }
  }

  static async getMedicinesForDate(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user!.id;
      const date = new Date(req.params.date);
      
      const medicines = await MedicineService.getMedicinesForDate(userId, date);

      res.status(200).json({
        success: true,
        message: 'Medicines for date retrieved successfully',
        data: medicines
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve medicines for date',
        error: 'GET_MEDICINES_FOR_DATE_ERROR'
      });
    }
  }

  static async logMedicine(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user!.id;
      const { medicineId, date, status, notes } = req.body;
      
      const log = await MedicineService.logMedicine(
        userId,
        medicineId,
        new Date(date),
        status,
        notes
      );

      res.status(201).json({
        success: true,
        message: 'Medicine logged successfully',
        data: log
      });
    } catch (error: any) {
      const statusCode = error.message === 'Medicine not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to log medicine',
        error: 'LOG_MEDICINE_ERROR'
      });
    }
  }

  static async getMedicineLogs(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user!.id;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      const logs = await MedicineService.getMedicineLogs(userId, startDate, endDate);

      res.status(200).json({
        success: true,
        message: 'Medicine logs retrieved successfully',
        data: logs
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve medicine logs',
        error: 'GET_MEDICINE_LOGS_ERROR'
      });
    }
  }

  static async getMedicineStats(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user!.id;
      const stats = await MedicineService.getMedicineStats(userId);

      res.status(200).json({
        success: true,
        message: 'Medicine statistics retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve medicine statistics',
        error: 'GET_MEDICINE_STATS_ERROR'
      });
    }
  }
}
