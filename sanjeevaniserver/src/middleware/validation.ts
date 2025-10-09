import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { ApiResponse } from '../types';

export const handleValidationErrors = (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: 'VALIDATION_ERROR',
      data: errors.array()
    });
  }
  
  return next();
};

// Auth validation rules
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  handleValidationErrors
];

export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('displayName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Display name must be between 2 and 50 characters'),
  handleValidationErrors
];

// Medicine validation rules
export const validateCreateMedicine = [
  body('medicineName')
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage('Medicine name is required and must be less than 100 characters'),
  body('dosage')
    .notEmpty()
    .isLength({ min: 1, max: 50 })
    .withMessage('Dosage is required and must be less than 50 characters'),
  body('frequency')
    .notEmpty()
    .withMessage('Frequency is required'),
  body('startDate')
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('endDate')
    .isISO8601()
    .withMessage('Valid end date is required'),
  body('medicineType')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Medicine type must be less than 50 characters'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters'),
  handleValidationErrors
];

export const validateUpdateMedicine = [
  param('id')
    .isUUID()
    .withMessage('Valid medicine ID is required'),
  body('medicineName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Medicine name must be less than 100 characters'),
  body('dosage')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Dosage must be less than 50 characters'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Valid end date is required'),
  handleValidationErrors
];

export const validateMedicineId = [
  param('id')
    .isUUID()
    .withMessage('Valid medicine ID is required'),
  handleValidationErrors
];

export const validateMedicineLog = [
  body('medicineId')
    .isUUID()
    .withMessage('Valid medicine ID is required'),
  body('date')
    .isISO8601()
    .withMessage('Valid date is required'),
  body('status')
    .isIn(['TAKEN', 'MISSED', 'PENDING', 'EDITED'])
    .withMessage('Valid status is required'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters'),
  handleValidationErrors
];

// Query validation
export const validateQueryParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Valid start date is required'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Valid end date is required'),
  handleValidationErrors
];
