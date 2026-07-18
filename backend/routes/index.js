const express = require('express');
const router = express.Router();

const healthController = require('../controllers/health.controller');
const csvController = require('../controllers/csv.controller');
const spendingController = require('../controllers/spending.controller');
const subscriptionController = require('../controllers/subscription.controller');
const duplicateController = require('../controllers/duplicate.controller');
const anomalyController = require('../controllers/anomaly.controller');
const gemmaController = require('../controllers/gemma.controller');
const analysisController = require('../controllers/analysis.controller');
const { upload } = require('../utils/upload');

router.get('/health', healthController.getHealth);
router.post('/csv/upload', upload.single('file'), csvController.processFile);
router.post('/analysis', analysisController.runAnalysis);
router.get('/spending', spendingController.getSpendingSummary);
router.get('/subscriptions', subscriptionController.getSubscriptions);
router.get('/duplicates', duplicateController.getDuplicates);
router.get('/anomalies', anomalyController.getAnomalies);
router.post('/gemma', gemmaController.getInsight);

module.exports = router;
