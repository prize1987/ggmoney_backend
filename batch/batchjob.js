import * as api from './api.js';
import database from './database.js';

const db = new database();

const insertStoreInfo = async (data) => {
  db.connect();

  const query = `INSERT INTO STORE_INFO (CMPNM_NM,
    INDUTYPE_NM,
    TELNO,
    REFINE_LOTNO_ADDR,
    REFINE_ROADNM_ADDR,
    REFINE_ZIP_CD,
    REFINE_WGS84_LOGT,
    REFINE_WGS84_LAT,
    SIGUN_NM) VALUES ?`;

  const result = await db.insert(query, data);
  console.log(result);

  db.end();
};

const getSigunData = async (pIndex, pSize, pSigun) => {
  const data = await api.getSigunData(pIndex, pSize, pSigun);
  return data.map((row) => [
    row.CMPNM_NM,
    row.INDUTYPE_NM,
    row.TELNO,
    row.REFINE_LOTNO_ADDR,
    row.REFINE_ROADNM_ADDR,
    row.REFINE_ZIP_CD,
    row.REFINE_WGS84_LOGT,
    row.REFINE_WGS84_LAT,
    row.SIGUN_NM,
  ]);
};

const main = async () => {
  const data = await getSigunData(1, 10, '수원시');

  insertStoreInfo(data);
};

main();
