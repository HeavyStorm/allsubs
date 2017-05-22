const downloadFile = require('download-file')

/**
 * Download a file from a certain URL to the disk.
 * @param {string} url Path to download
 * @param {object} options Bag containing directory and filename to save to.
 */
function downloadPromise(url, options) {
	return new Promise((res, rej) => {
		downloadFile(url, options, err => {
			if (err) rej(err);
			else res();
		});
	});
}

module.exports = downloadPromise;