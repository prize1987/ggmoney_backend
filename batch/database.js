import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

export default class database {
  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  connect = () => {
    this.connection.connect();
  };

  end = () => {
    this.connection.end();
  };

  select = (query) => {
    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, rows, fields) => {
        if (error) reject(error);
        // console.log('User info is: ', rows);
        resolve(rows);
      });
    });
  };

  insert = (query, values) => {
    return new Promise((resolve, reject) => {
      this.connection.query(query, [values], (error, result) => {
        if (error) reject(error);
        // console.log('User info is: ', rows);
        resolve(result);
      });
    });
  };

  insertStoreInfo = async (data) => {
    const query = `INSERT INTO STORE_INFO (CMPNM_NM,
      INDUTYPE_NM,
      TELNO,
      REFINE_LOTNO_ADDR,
      REFINE_ROADNM_ADDR,
      REFINE_ZIP_CD,
      REFINE_WGS84_LOGT,
      REFINE_WGS84_LAT,
      SIGUN_NM) VALUES ?`;

    const result = await this.insert(query, data);
    console.log(result);
  };

  getStoreInfoCount = async (sigun) => {
    const query = `SELECT COUNT(*) CNT FROM STORE_INFO WHERE SIGUN_NM = '${sigun}'`;

    const result = await this.select(query);
    console.log(result);
    return result[0].CNT;
  };
}
