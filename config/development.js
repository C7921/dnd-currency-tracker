module.exports = {
  port: process.env.PORT || 8080,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://mongodb:27017/dnd-currency'
  },
  logLevel: 'debug'
};
