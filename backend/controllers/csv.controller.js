const { csvService } = require('../services/csv.service');
const { buildResponse, buildError } = require('../utils/response');

exports.processFile = async (req, res) => {
  try {
    const result = await csvService.processFile(req);
    res.status(200).json(result);
  } catch (error) {
    const payload = error?.message && typeof error.message === 'string' && error.message.startsWith('{')
      ? JSON.parse(error.message)
      : buildError(error?.message || 'Unable to process the CSV file.');

    res.status(400).json(payload);
  }
};
