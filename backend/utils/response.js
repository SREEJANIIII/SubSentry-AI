const buildResponse = (success, message, data = null, meta = null) => {
  const payload = {
    success,
    message,
  };

  if (data !== null) {
    payload.data = data;
  }

  if (meta) {
    payload.meta = meta;
  }

  return payload;
};

const buildError = (message, details = null) => {
  const payload = {
    success: false,
    message,
  };

  if (details) {
    payload.details = details;
  }

  return payload;
};

module.exports = {
  buildResponse,
  buildError,
};
