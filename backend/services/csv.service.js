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
    const missingColumns = REQUIRED_COLUMNS.filter((column) => !(column in firstRow));

    if (missingColumns.length > 0) {
      throw buildError('The uploaded CSV is missing required columns.', { missingColumns });
    }
  },

  normalizeTransactions(rows) {
    const normalized = rows
      .filter((row) => this.hasMeaningfulData(row))
      .map((row) => {
        const transaction = {
          transaction_id: this.normalizeString(row.transaction_id),
          date: this.normalizeString(row.date),
          merchant: this.normalizeMerchant(row.merchant),
          category: this.normalizeString(row.category),
          amount: this.normalizeNumber(row.amount),
          payment_method: this.normalizeString(row.payment_method),
          city: this.normalizeString(row.city),
          hour: this.normalizeNumber(row.hour),
          weekday: this.normalizeWeekday(row.weekday),
          is_weekend: this.normalizeBoolean(row.is_weekend),
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
