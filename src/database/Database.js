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

  // base method
  select = (query, value) => {
    return new Promise((resolve, reject) => {
      this.connection.query(query, value, (error, rows, fields) => {
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

  // queries
  // insert, update, delete
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

  updateSigunCount = async (sigun, count) => {
    const query = `UPDATE SIGUN_INFO
      SET DATA_COUNT = ${count}
      WHERE SIGUN_NM = '${sigun}'`;

    const result = await this.update(query);
    console.log('update count : ' + result.affectedRows);
  };

  deleteStoreInfo = async (sigun) => {
    const query = `DELETE FROM STORE_INFO
      WHERE SIGUN_NM = '${sigun}'`;

    const result = await this.update(query);
    console.log('delete count : ' + result.affectedRows);
  };

  // select
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

  selectSigunList = async () => {
    const query = `SELECT DISTINCT SIGUN_NM FROM SIGUN_INFO`;

    const result = await this.select(query);
    return result;
  };

  selectStoreInfo = async () => {
    const query = `SELECT CMPNM_NM,
      INDUTYPE_NM,
      TELNO,
      REFINE_LOTNO_ADDR,
      REFINE_ROADNM_ADDR,
      REFINE_ZIP_CD,
      REFINE_WGS84_LOGT,
      REFINE_WGS84_LAT,
      SIGUN_NM 
      FROM STORE_INFO 
      WHERE 1=1
      LIMIT ?, ?`;

    // for (let i = 1; i <= conditionList.length; i++) {
    //   selectQuery +=
    //     ' AND (CMPNM_NM LIKE ?' +
    //     i +
    //     ' OR REFINE_LOTNO_ADDR LIKE ?' +
    //     i +
    //     ' OR REFINE_ROADNM_ADDR LIKE ?' +
    //     i +
    //     ' OR INDUTYPE_NM LIKE ?' +
    //     i +
    //     ')';
    //   conditionList[i - 1] = '%' + conditionList[i - 1] + '%';
    // }

    // selectQuery += this.createIndutypeCon(indutype);

    const result = await this.select(query, [100, 2]);
    return result;
  };
}
