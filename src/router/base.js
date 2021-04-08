import express from 'express';
import Database from '../database/Database.js';

const router = express.Router();
const db = new Database();

router.get('/', (req, res) => {
  res.send('root response');
});

router.get('/getStoreInfo', async (req, res) => {
  const sigun = req.query.sigun;
  const indutype = req.query.indutype;
  const conditions = req.query.conditions;
  const from = req.query.from;
  const limit = req.query.limit;

  const result = await db.selectStoreInfo(sigun, indutype, conditions, from, limit);
  res.json(result);
});

router.get('/getStoreInfoCount', async (req, res) => {
  const sigun = req.query.sigun;
  const indutype = req.query.indutype;
  const conditions = req.query.conditions;

  const result = await db.selectStoreInfoCount(sigun, indutype, conditions);
  res.json(result);
});

router.get('/getStoreInfoByArea', async (req, res) => {
  const indutype = req.query.indutype;
  const conditions = req.query.conditions;
  const lat_lcl = req.query.lat_lcl;
  const lat_ucl = req.query.lat_ucl;
  const lon_lcl = req.query.lon_lcl;
  const lon_ucl = req.query.lon_ucl;
  const limit = req.query.limit;

  const result = await db.selectStoreInfoByArea(indutype, conditions, lat_lcl, lat_ucl, lon_lcl, lon_ucl, limit);
  res.json(result);
});

export default router;
