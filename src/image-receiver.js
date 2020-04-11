const axios = require('axios');

async function takeImageFromUrl(URL) {
	const image = (await axios({ method: 'get', url: URL, responseType: 'arraybuffer' })).data;

	try {
		const buffer = Buffer.from(image, 'base64');
		return buffer;
	} catch (err) {
		console.error(err);
	}
}

module.exports = { takeImageFromUrl };
