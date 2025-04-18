const axios = require('axios');

async function exchangeCodeForToken(code) {
  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
      },
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('GitHub OAuth response:', response.data);

    return response.data.access_token;
  } catch (error) {
    console.error("Error exchanging code for token:", error.response?.data || error.message);
    throw new Error("Error exchanging code for token");
  }
}

module.exports = { exchangeCodeForToken };
