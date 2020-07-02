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

  loginBot() {
    return axios.post(
      `${this.apiUrl}/login`,
      {
        username: process.env.JWT_USERNAME,
        password: process.env.JWT_PASSWORD,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then((response) => response.data.token);
  }

  sendCase(createdCase, token) {
    return axios.post(`${this.apiUrl}/cases`, createdCase,
      {
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).catch((err) => {
      throw new Error(err);
    });
  }

  async uploadFileByUrl(url, fileName) {
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
