require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', err => {
  console.log('uncaughtException! Shutting down....');
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('DB connection succefull');
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close();
  process.exit(1);
});
