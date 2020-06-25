const { ApiService } = require('./api.service');
const { MessageHandlerService } = require('./message-handler.service');

const apiService = new ApiService(process.env.API_URL, process.env.GOOGLE_BUCKET_NAME, process.env.GOOGLE_PROJECT_ACCOUNT_FILE, process.env.GOOGLE_PROJECT_ID);
const messageHandlerService = new MessageHandlerService(apiService);

module.exports = {
  apiService,
  messageHandlerService,
};
