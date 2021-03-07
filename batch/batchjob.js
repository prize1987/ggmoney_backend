import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect();

connection.query('SELECT * from STORE_INFO', (error, rows, fields) => {
  if (error) throw error;
  console.log('User info is: ', rows);
});

connection.end();

const apiTest = () => {
  const url = 'https://openapi.gg.go.kr/RegionMnyFacltStus';
  const appKey = process.env.API_KEY_GGMONEY;
  const pIndex = 1;
  const pSize = 10;
  const type = 'json';

  let fetch_url = url + '?KEY=' + appKey;
  fetch_url += '&pIndex=' + pIndex;
  fetch_url += '&pSize=' + pSize;
  fetch_url += '&type=' + type;
  fetch_url += '&SIGUN_NM=' + sigun;
};

apiTest();
