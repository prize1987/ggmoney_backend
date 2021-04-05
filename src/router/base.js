import express from 'express';
import Database from '../database/Database.js';

const router = express.Router();
const db = new Database();

router.get('/', (req, res) => {
  res.send('root response');
});

router.get('/test', async (req, res) => {
  const indutype = req.query.indutype;
  const conditions = req.query.conditions;
  const from = req.query.from;
  const limit = req.query.limit;

  const testData = await db.selectStoreInfo();
  res.json(testData);
  // console.log(testData, testData.length);
  console.log(indutype, conditions, from, limit, testData.length);
});

export default router;
