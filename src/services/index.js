const { ApiService } = require('./api.service');
const { MessageHandlerService } = require('./message-handler.service');

const apiService = new ApiService(process.env.API_URL);
const messageHandlerService = new MessageHandlerService(apiService);

module.exports = {
  apiService,
  messageHandlerService,
};
