import express from 'express';
import baseRouter from './router/base.js';
// import dotenv from 'dotenv';
// dotenv.config();

const app = express();

app.use('/', baseRouter);

app.listen(32590, () => {
  console.log('server on1');
});
