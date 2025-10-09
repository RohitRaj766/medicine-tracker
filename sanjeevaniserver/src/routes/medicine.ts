import { Router } from 'express';
import { MedicineController } from '../controllers/medicineController';
import { authenticateToken } from '../middleware/auth';
import { 
  validateCreateMedicine, 
  validateUpdateMedicine, 
  validateMedicineId,
  validateMedicineLog,
  validateQueryParams 
} from '../middleware/validation';

const router = Router();

// All medicine routes require authentication
router.use(authenticateToken);

// Medicine CRUD operations
router.post('/', validateCreateMedicine, MedicineController.createMedicine);
router.get('/', validateQueryParams, MedicineController.getMedicines);
router.get('/stats', MedicineController.getMedicineStats);
router.get('/logs', MedicineController.getMedicineLogs);
router.get('/date/:date', MedicineController.getMedicinesForDate);
router.get('/:id', validateMedicineId, MedicineController.getMedicineById);
router.put('/:id', validateUpdateMedicine, MedicineController.updateMedicine);
router.delete('/:id', validateMedicineId, MedicineController.deleteMedicine);

// Medicine logging
router.post('/log', validateMedicineLog, MedicineController.logMedicine);

export default router;
