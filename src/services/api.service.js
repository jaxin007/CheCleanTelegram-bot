const axios = require('axios');
const { Storage } = require('@google-cloud/storage');
const path = require('path');

class ApiService {
  constructor(apiUrl, googleBuckenName, googleAccountFile, googleProjectId) {
    this.apiUrl = apiUrl;
    this.googleBuckenName = googleBuckenName;
    this.gc = new Storage({
      keyFilename: path.join(__dirname, `../google-storage-config/${googleAccountFile}`),
      projectId: googleProjectId,
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
    this.gc.bucket(this.googleBuckenName)
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
