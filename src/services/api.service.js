const axios = require('axios');
const { Storage } = require('@google-cloud/storage');
const path = require('path');

class ApiService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.gc = new Storage({
      keyFilename: path.join(__dirname, `../api/${process.env.GOOGLE_PROJECT_ACCOUNT_FILE}`),
      projectId: process.env.GOOGLE_PROJECT_ID,
    });
  }

  sendCase(createdCase) {
    return axios.post(`${this.apiUrl}/cases`, createdCase, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((err) => {
      throw new Error(err);
    });
  }

  async uploadFile(url, fileName) {
    const response = (await (axios.get(url, { responseType: 'arraybuffer' }))).data;
    this.gc.bucket(process.env.GOOGLE_BUCKET_NAME)
      .file(fileName)
      .save(response, (err) => {
        if (err) {
          throw new Error(err);
        }
      });
  }
}

module.exports = {
  ApiService,
};
