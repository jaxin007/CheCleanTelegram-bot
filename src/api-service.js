const axios = require('axios');
const path = require('path');

class ApiService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  sendCase(createdCase) {
    return axios.post(path.join(this.apiUrl, 'case'), createdCase, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

module.exports = {
  ApiService,
};
