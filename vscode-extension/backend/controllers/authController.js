const {exchangeCodeForToken} = require('../utils/githubOAuth');
const CLIENT_ID=process.env.GITHUB_CLIENT_ID;
const REDIRECT_URI=process.env.REDIRECT_URI;
const asyncHandler = require('express-async-handler');

const login = asyncHandler(async (req, res) => {
    const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`;
    res.redirect(githubAuthURL);
})

const handleCallback = asyncHandler(async (req, res) => {
    const code = req.query.code;
    if(!code){
        res.status(400).json({message:"Please provide a code to generate a token!"});
    }else{
        try {
            const token = await exchangeCodeForToken(code);
            res.redirect(`http://localhost:5173/#/oauth-success?token=${token}`);
        } catch (error) {
            console.log("Some error occured in the token generation process", error);
            res.status(500).json({message:"Some error occured in the token generation process"});
        }
    }
})

module.exports = {login,handleCallback};