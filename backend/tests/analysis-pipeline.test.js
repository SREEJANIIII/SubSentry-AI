const test = require('node:test');
const assert = require('node:assert/strict');
const { analysisPipelineService } = require('../services/analysis-pipeline.service');

test('analysis pipeline returns anomaly insights for unusual transactions', async () => {
  const transactions = [
    {
      transaction_id: 't1',
      date: '2026-07-01',
      merchant: 'Air India',
      category: 'Travel',
      amount: 15250,
      payment_method: 'Credit Card',
      city: 'Mumbai',
      hour: 8,
      weekday: 1,
      is_weekend: false,
    },
    {
      transaction_id: 't2',
      date: '2026-07-02',
      merchant: 'Zomato',
      category: 'Food',
      amount: 320,
      payment_method: 'UPI',
      city: 'Mumbai',
      hour: 19,
      weekday: 2,
      is_weekend: false,
    },
    {
      transaction_id: 't3',
      date: '2026-07-03',
      merchant: 'Netflix',
      category: 'Entertainment',
      amount: 199,
      payment_method: 'UPI',
      city: 'Delhi',
      hour: 21,
      weekday: 3,
      is_weekend: false,
    },
  ];

  const result = await analysisPipelineService.run(transactions);

  assert.ok(Array.isArray(result.anomalies));
  assert.ok(result.anomalies.length >= 1);
  assert.equal(result.anomalies[0].category, 'Travel');
  assert.ok(result.anomalies[0].reason.includes('unusual'));
});
