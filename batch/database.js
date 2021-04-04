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
        if (error) {
          this.connection.rollback();
          reject(error);
        }

        this.connection.commit();
        resolve(result);
      });
    });
  };

  update = (query) => {
    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, result) => {
        if (error) {
          this.connection.rollback();
          reject(error);
        }

        this.connection.commit();
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
    console.log('insert complete. ' + result.message);
  };

  deleteStoreInfo = async (sigun) => {
    const query = `DELETE FROM STORE_INFO
      WHERE SIGUN_NM = '${sigun}'`;

    const result = await this.update(query);
    console.log('delete count : ' + result.affectedRows);
  };

  selectStoreInfoCount = async (sigun) => {
    const query = `SELECT COUNT(*) AS CNT FROM STORE_INFO WHERE SIGUN_NM = '${sigun}'`;

    const result = await this.select(query);
    return result[0].CNT;
  };

  selectSigunDataCount = async (sigun) => {
    const query = `SELECT DATA_COUNT FROM SIGUN_INFO WHERE SIGUN_NM = '${sigun}'`;

    const result = await this.select(query);
    return result[0].DATA_COUNT;
  };

  updateSigunCount = async (sigun, count) => {
    const query = `UPDATE SIGUN_INFO
      SET DATA_COUNT = ${count}
      WHERE SIGUN_NM = '${sigun}'`;

    const result = await this.update(query);
    console.log('update count : ' + result.affectedRows);
  };

  selectSigunList = async () => {
    const query = `SELECT DISTINCT SIGUN_NM FROM SIGUN_INFO`;

    const result = await this.select(query);
    return result;
  };
}
