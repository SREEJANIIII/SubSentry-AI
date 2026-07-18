const assert = require('assert');
const { paymentRiskService } = require('../services/payment-risk.service');

const highRiskResult = paymentRiskService.assess('paytm-help-fast.in');
assert.strictEqual(highRiskResult.level, 'High');
assert.ok(highRiskResult.score >= 60);
assert.ok(highRiskResult.isUrl);
assert.ok(!highRiskResult.isUpi);

const lowRiskResult = paymentRiskService.assess('name@upi');
assert.strictEqual(lowRiskResult.level, 'Low');
assert.ok(lowRiskResult.score < 30);
assert.ok(!lowRiskResult.isUrl);
assert.ok(lowRiskResult.isUpi);

const officialUrl = paymentRiskService.assess('https://paytm.com');
assert.strictEqual(officialUrl.level, 'Low');
assert.strictEqual(officialUrl.score, 0);
assert.ok(officialUrl.isUrl);
assert.ok(!officialUrl.isUpi);

const phishingUrl = paymentRiskService.assess('http://paytm-fake.xyz');
assert.strictEqual(phishingUrl.level, 'High');
assert.ok(phishingUrl.score >= 60);
assert.ok(phishingUrl.isUrl);
assert.ok(!phishingUrl.isUpi);

const normalUpi = paymentRiskService.assess('john.doe@paytm');
assert.strictEqual(normalUpi.level, 'Low');
assert.ok(normalUpi.score < 30);
assert.ok(!normalUpi.isUrl);
assert.ok(normalUpi.isUpi);

const suspiciousUpi = paymentRiskService.assess('amazonpay.cashback@amazonpay');
assert.strictEqual(suspiciousUpi.level, 'Medium');
assert.ok(suspiciousUpi.score >= 30 && suspiciousUpi.score < 60);
assert.ok(!suspiciousUpi.isUrl);
assert.ok(suspiciousUpi.isUpi);

const officialUpi = paymentRiskService.assess('paytm@paytm');
assert.strictEqual(officialUpi.level, 'Low');
assert.ok(!officialUpi.isUrl);
assert.ok(officialUpi.isUpi);

const phishingUpi = paymentRiskService.assess('paytm.verify@paytm');
assert.strictEqual(phishingUpi.level, 'Medium');
assert.ok(phishingUpi.score >= 30 && phishingUpi.score < 60);
assert.ok(!phishingUpi.isUrl);
assert.ok(phishingUpi.isUpi);

const iciciBank = paymentRiskService.assess('https://icicibank.com');
assert.strictEqual(iciciBank.level, 'Low');
assert.strictEqual(iciciBank.score, 0);

const suspiciousTld = paymentRiskService.assess('http://icici-bank.loan');
assert.strictEqual(suspiciousTld.level, 'High');
assert.ok(suspiciousTld.score >= 60);

const emptyInput = paymentRiskService.assess('');
assert.strictEqual(emptyInput.level, 'Low');
assert.strictEqual(emptyInput.score, 0);

const gpayUser = paymentRiskService.assess('user@gpay');
assert.strictEqual(gpayUser.level, 'Low');
assert.ok(gpayUser.score < 30);

console.log('payment-risk.service test passed');