import express from 'express';
import upload from '../config/multer.js';
import * as claimController from '../controllers/claimController.js';

const router = express.Router();

/**
 * POST /api/claims/upload
 * Upload and process a claim
 */
router.post(
  '/upload',
  upload.fields([
    { name: 'prescription', maxCount: 1 },
    { name: 'bill', maxCount: 1 },
    { name: 'diagnosticReport', maxCount: 1 },
    { name: 'pharmacyBill', maxCount: 1 }
  ]),
  claimController.uploadAndProcessClaim
);

/**
 * GET /api/claims
 * Get all claims
 */
router.get('/', claimController.getAllClaims);

/**
 * GET /api/claims/:id
 * Get claim by ID
 */
router.get('/:id', claimController.getClaimById);

/**
 * DELETE /api/claims/:id
 * Delete claim by ID
 */
router.delete('/:id', claimController.deleteClaim);

/**
 * GET /api/claims/statistics/all
 * Get claim statistics
 */
router.get('/statistics/all', claimController.getClaimStatistics);

export default router;
