const assert = require('assert');
const { csvService } = require('../services/csv.service');

(async () => {
  const sampleRows = [
    {
      transaction_id: 't1',
      date: '2026-01-01',
      merchant: '  netflix  ',
      category: 'Entertainment',
      amount: '9.99',
      payment_method: 'Card',
      city: 'Seattle',
      hour: '20',
      weekday: 'Monday',
      is_weekend: 'false',
      anomaly: 'false'
    },
    {},
    {
      transaction_id: '',
      date: '',
      merchant: '',
      category: '',
      amount: '',
      payment_method: '',
      city: '',
      hour: '',
      weekday: '',
      is_weekend: ''
    }
  ];

  const result = await csvService.normalizeTransactions(sampleRows);
  assert.strictEqual(result.length, 1);
  assert.strictEqual(typeof result[0].amount, 'number');
  assert.strictEqual(typeof result[0].hour, 'number');
  assert.strictEqual(typeof result[0].weekday, 'number');
  assert.strictEqual(typeof result[0].is_weekend, 'boolean');
  assert.strictEqual(result[0].merchant, 'Netflix');
  assert.strictEqual(result[0].weekday, 1);
  assert.ok(!Object.prototype.hasOwnProperty.call(result[0], 'anomaly'));
  console.log('csv.service test passed');
})();
