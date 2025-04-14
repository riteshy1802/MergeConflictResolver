const axios = require('axios');
const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;

const exchangeCodeForToken = async (code) => {
    try {
        const config = {
            headers: {
              Accept: 'application/json',
            },
        }
        const response = await axios.post('https://github.com/login/oauth/access_token', {
            client_id,
            client_secret,
            code: code,
            redirect_uri: 'http://localhost:3000/auth/github/callback'
          }, config);
        return response.data.access_token;
    } catch (error) {
        console.log("Some Error occured while exchanging code for token", error);
    }
}

module.exports = exchangeCodeForToken;