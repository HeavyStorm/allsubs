const OS = require('opensubtitles-api');

let config = {
	useragent: 'OSTestUserAgentTemp',
	// username: 'Username',
	// password: 'Password',
	// ssl: true
};

const OpenSubtitles = new OS(config);

module.exports = OpenSubtitles;