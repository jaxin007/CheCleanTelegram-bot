import axios from 'axios';
import * as path from 'path';

export class ApiService {
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
