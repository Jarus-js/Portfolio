//env var from Heroku goes here
module.exports = {
  mongoURI: process.env.MONGO_URI,
  secret: process.env.SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubSecret: process.env.GITHUB_SECRET
};
