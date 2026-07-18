const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { buildResponse, buildError } = require('../utils/response');

const REQUIRED_COLUMNS = [
  'transaction_id',
  'date',
  'merchant',
  'category',
  'amount',
  'payment_method',
  'city',
  'hour',
  'weekday',
  'is_weekend',
];

const COLUMN_ALIASES = {
  transaction_id: ['transaction_id', 'id', 'txn_id', 'transactionId'],
  date: ['date', 'Date', 'transaction_date', 'txn_date'],
  merchant: ['merchant', 'Merchant', 'merchant_name', 'payee'],
  category: ['category', 'Category', 'expense_category', 'type'],
  amount: ['amount', 'Amount', 'total', 'value'],
  payment_method: ['payment_method', 'paymentMethod', 'method', 'payment'],
  city: ['city', 'City', 'location'],
  hour: ['hour', 'Hour', 'time'],
  weekday: ['weekday', 'Weekday', 'day'],
  is_weekend: ['is_weekend', 'isWeekend', 'weekend'],
};

const csvService = {
  async processFile(req) {
    if (!req?.file?.path) {
      throw buildError('No CSV file was uploaded.', { field: 'file' });
    }

    const filePath = req.file.path;
    const records = [];

    try {
      await this.parseCsvFile(filePath, records);
      const normalizedTransactions = this.normalizeTransactions(records);

      return buildResponse(true, 'CSV processed successfully.', {
        transactions: normalizedTransactions,
        count: normalizedTransactions.length,
      }, {
        sourceFile: path.basename(filePath),
      });
    } finally {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  },

  parseCsvFile(filePath, records) {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath);
      const rows = [];

      stream
        .pipe(csv())
        .on('data', (row) => rows.push(row))
        .on('end', () => {
          try {
            this.validateColumns(rows);
            records.push(...rows);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => reject(buildError('Failed to read the uploaded CSV file.', { cause: error.message })));
    });
  },

  validateColumns(rows) {
    if (!Array.isArray(rows) || rows.length === 0) {
      throw buildError('The uploaded CSV is empty.');
    }

    const firstRow = rows[0];
    const hasRecognizedColumns = REQUIRED_COLUMNS.some((column) => this.getColumnValue(firstRow, COLUMN_ALIASES[column]) !== undefined);

    if (!hasRecognizedColumns) {
      throw buildError('The uploaded CSV is missing recognizable transaction columns.', {
        expectedColumns: ['date', 'merchant', 'category', 'amount'],
      });
    }
  },

  normalizeTransactions(rows) {
    const normalized = rows
      .filter((row) => this.hasMeaningfulData(row))
      .map((row) => {
        const transaction = {
          transaction_id: this.normalizeString(this.getColumnValue(row, COLUMN_ALIASES.transaction_id)),
          date: this.normalizeString(this.getColumnValue(row, COLUMN_ALIASES.date)),
          merchant: this.normalizeMerchant(this.getColumnValue(row, COLUMN_ALIASES.merchant)),
          category: this.normalizeString(this.getColumnValue(row, COLUMN_ALIASES.category)),
          amount: this.normalizeNumber(this.getColumnValue(row, COLUMN_ALIASES.amount)),
          payment_method: this.normalizeString(this.getColumnValue(row, COLUMN_ALIASES.payment_method)),
          city: this.normalizeString(this.getColumnValue(row, COLUMN_ALIASES.city)),
          hour: this.normalizeNumber(this.getColumnValue(row, COLUMN_ALIASES.hour)),
          weekday: this.normalizeWeekday(this.getColumnValue(row, COLUMN_ALIASES.weekday)),
          is_weekend: this.normalizeBoolean(this.getColumnValue(row, COLUMN_ALIASES.is_weekend)),
        };

        return transaction;
      });

    return normalized;
  },

  hasMeaningfulData(row) {
    if (!row || typeof row !== 'object') {
      return false;
    }

    return Object.values(row).some((value) => this.normalizeString(value) !== '');
  },

  getColumnValue(row, aliases = []) {
    if (!row || typeof row !== 'object') {
      return '';
    }

    for (const alias of aliases) {
      if (alias in row) {
        return row[alias];
      }
    }

    return '';
  },

  normalizeString(value) {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value).trim();
  },

  normalizeMerchant(value) {
    const normalized = this.normalizeString(value);
    if (!normalized) {
      return '';
    }

    return normalized
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  normalizeNumber(value) {
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  },

  normalizeWeekday(value) {
    const normalized = this.normalizeString(value).toLowerCase();

    const weekdays = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    if (weekdays[normalized] !== undefined) {
      return weekdays[normalized];
    }

    const numeric = Number(normalized);
    return Number.isFinite(numeric) ? numeric : 0;
  },

  normalizeBoolean(value) {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (['true', '1', 'yes', 'y'].includes(normalized)) {
        return true;
      }
      if (['false', '0', 'no', 'n'].includes(normalized)) {
        return false;
      }
    }

    return Boolean(value);
  },
};

module.exports = { csvService };
