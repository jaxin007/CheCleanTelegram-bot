const { ApiService } = require('./api-service');

const apiService = new ApiService(process.env.API_URL);

module.exports = {
  apiService,
};
