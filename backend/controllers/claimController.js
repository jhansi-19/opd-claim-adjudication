import Claim from '../models/Claim.js';
import { extractTextFromFile } from '../services/ocrService.js';
import { extractClaimDataFromText } from '../services/openaiService.js';
import { adjudicateClaim } from '../services/adjudicationEngine.js';
import * as policyService from '../services/policyService.js';
import { generateClaimId, formatDate } from '../utils/helpers.js';
import fs from 'fs';

export const uploadAndProcessClaim = async (req, res) => {
  try {
    const { memberName, memberId } = req.body;

    if (!memberName || !memberId) {
      return res.status(400).json({
        success: false,
        message: 'Member name and ID are required'
      });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const claimId = generateClaimId();

    // Create claim document structure
    const claimData = {
      claimId,
      memberName,
      memberId,
      documents: {},
      ocrText: {},
      extractedData: {},
      policyValidation: {},
      limitsValidation: {}
    };

    // Process each uploaded file
    const documentTypes = ['prescription', 'bill', 'diagnosticReport', 'pharmacyBill'];
    const fileTypeMap = {
      prescription: 'prescription',
      bill: 'bill',
      diagnosticReport: 'diagnosticReport',
      pharmacyBill: 'pharmacyBill'
    };

    for (const [fieldName, files] of Object.entries(req.files)) {
      // Multer returns files as arrays when using .fields()
      const file = Array.isArray(files) ? files[0] : files;
      const docType = fileTypeMap[fieldName];
      
      if (docType && file) {
        console.log(`Processing file: ${fieldName}`, { filename: file.filename, path: file.path });
        
        claimData.documents[docType] = {
          filename: file.filename,
          path: file.path,
          uploadedAt: new Date()
        };

        // Extract text using OCR
        if (file.path) {
          try {
            const ocrText = await extractTextFromFile(file.path);
            claimData.ocrText[docType] = ocrText;
          } catch (ocrError) {
            console.error(`OCR failed for ${docType}:`, ocrError.message);
            claimData.ocrText[docType] = '';
          }
        } else {
          console.warn(`No file path for ${docType}`);
          claimData.ocrText[docType] = '';
        }
      }
    }

    // Extract structured data from OCR text
    const combinedText = `
Prescription Document:
${claimData.ocrText.prescription || ''}

Bill Document:
${claimData.ocrText.bill || ''}
    `.trim();

    if (combinedText) {
      try {
        const extractedData = await extractClaimDataFromText(combinedText);
        claimData.extractedData = extractedData;
      } catch (extractError) {
        console.error('Data extraction error:', extractError.message);
        return res.status(400).json({
          success: false,
          message: 'Failed to extract data from documents',
          details: extractError.message
        });
      }
    }

    // Validate policy
    const memberProfile = {
      policyActive: true,
      joinDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // Assume 1 year old
      covered: true,
      yearlyClaimsTotal: 0,
      recentClaimsCount: 0
    };

    // Perform adjudication
    const decision = adjudicateClaim(claimData, memberProfile);

    claimData.decision = decision.decision;
    claimData.approvedAmount = decision.approved_amount;
    claimData.confidenceScore = decision.confidence_score;
    claimData.rejectionReasons = decision.rejection_reasons;
    claimData.notes = decision.notes;

    // Save to MongoDB
    const claim = new Claim(claimData);
    await claim.save();

    res.status(201).json({
      success: true,
      message: 'Claim processed successfully',
      claim: {
        claimId: claim.claimId,
        decision: claim.decision,
        approvedAmount: claim.approvedAmount,
        confidenceScore: claim.confidenceScore,
        rejectionReasons: claim.rejectionReasons,
        notes: claim.notes
      }
    });
  } catch (error) {
    console.error('Claim processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process claim',
      details: error.message
    });
  }
};

export const getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .select('claimId memberName memberId decision approvedAmount confidenceScore createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Claims retrieved successfully',
      claims
    });
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch claims',
      details: error.message
    });
  }
};

export const getClaimById = async (req, res) => {
  try {
    const { id } = req.params;
    const claim = await Claim.findOne({ claimId: id });

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Claim retrieved successfully',
      claim
    });
  } catch (error) {
    console.error('Error fetching claim:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch claim',
      details: error.message
    });
  }
};

export const deleteClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const claim = await Claim.findOneAndDelete({ claimId: id });

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    // Delete associated files
    const documents = claim.documents;
    if (documents?.prescription?.path) fs.unlink(documents.prescription.path, () => {});
    if (documents?.bill?.path) fs.unlink(documents.bill.path, () => {});
    if (documents?.diagnosticReport?.path) fs.unlink(documents.diagnosticReport.path, () => {});
    if (documents?.pharmacyBill?.path) fs.unlink(documents.pharmacyBill.path, () => {});

    res.status(200).json({
      success: true,
      message: 'Claim deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting claim:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete claim',
      details: error.message
    });
  }
};

export const getClaimStatistics = async (req, res) => {
  try {
    const totalClaims = await Claim.countDocuments();
    const approvedClaims = await Claim.countDocuments({ decision: 'APPROVED' });
    const rejectedClaims = await Claim.countDocuments({ decision: 'REJECTED' });
    const partialClaims = await Claim.countDocuments({ decision: 'PARTIAL' });
    const manualReviewClaims = await Claim.countDocuments({ decision: 'MANUAL_REVIEW' });

    const totalApprovedAmount = await Claim.aggregate([
      { $match: { decision: 'APPROVED' } },
      { $group: { _id: null, total: { $sum: '$approvedAmount' } } }
    ]);

    const stats = {
      totalClaims,
      approvedClaims,
      rejectedClaims,
      partialClaims,
      manualReviewClaims,
      approvalRate: totalClaims > 0 ? ((approvedClaims / totalClaims) * 100).toFixed(2) : 0,
      totalApprovedAmount: totalApprovedAmount[0]?.total || 0
    };

    res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully',
      statistics: stats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      details: error.message
    });
  }
};

export default {
  uploadAndProcessClaim,
  getAllClaims,
  getClaimById,
  deleteClaim,
  getClaimStatistics
};
