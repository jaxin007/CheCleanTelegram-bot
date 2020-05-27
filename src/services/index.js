const { ApiService } = require('./api.service');
const { MessageHandler } = require('./cases.service');

const apiService = new ApiService(process.env.API_URL);
const messageHandler = new MessageHandler(apiService);

module.exports = {
  apiService,
  messageHandler,
};
