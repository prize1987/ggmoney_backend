import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

export default class database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 1000,
    });
  }

  endConnection = () => {
    this.pool.end();
  };

  // base method
  select = (query, value) => {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) reject(err);
        connection.query(query, value, (error, rows, fields) => {
          connection.release();
          if (error) reject(error);
          resolve(rows);
        });
      });
    });
  };

  insert = (query, values) => {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) reject(err);
        connection.query(query, [values], (error, result) => {
          if (error) {
            connection.rollback();
            connection.release();
            reject(error);
          }

          connection.commit();
          connection.release();
          resolve(result);
        });
      });
    });
  };

  update = (query) => {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) reject(err);
        connection.query(query, (error, result) => {
          if (error) {
            connection.rollback();
            connection.release();
            reject(error);
          }

          connection.commit();
          connection.release();
          resolve(result);
        });
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
  selectSigunDataCount = async (sigun) => {
    const query = `SELECT COUNT(*) AS CNT FROM STORE_INFO WHERE SIGUN_NM = '${sigun}'`;

    const result = await this.select(query);
    return result[0].CNT;
  };

  selectSigunDataCountMaster = async (sigun) => {
    const query = `SELECT DATA_COUNT FROM SIGUN_INFO WHERE SIGUN_NM = '${sigun}'`;

    const result = await this.select(query);
    return result[0].DATA_COUNT;
  };

  selectSigunList = async () => {
    const query = `SELECT DISTINCT SIGUN_NM FROM SIGUN_INFO`;

    const result = await this.select(query);
    return result;
  };

  createIndutypeCon = (indutype) => {
    let con = " AND (INDUTYPE_NM LIKE '%";

    switch (indutype) {
      case '??????':
        con += "?????????%') ";
        break;
      case '??????':
        con += "??????%') ";
        break;
      case '??????':
        con += "??????%' ";
        con += " OR INDUTYPE_NM LIKE '%??????%') ";
        break;
      case '??????/??????':
        con += "??????%' ";
        con += " OR INDUTYPE_NM LIKE '%??????%') ";
        break;
      case '??????/??????/????????????':
        con += "??????%' ";
        con += " OR INDUTYPE_NM LIKE '%??????%' ";
        con += " OR INDUTYPE_NM LIKE '%??????%' ";
        con += " OR INDUTYPE_NM LIKE '%??????%' ";
        con += " OR INDUTYPE_NM LIKE '%??????%' ";
        con += " OR INDUTYPE_NM LIKE '%??????%' ";
        con += " OR INDUTYPE_NM LIKE '%??????%' ";
        con += " OR INDUTYPE_NM LIKE '%??????%') ";
        break;
      case '?????????':
        con += "???????????????%') ";
        break;
      case '??????/?????????':
        con += "??????%' ";
        con += " OR INDUTYPE_NM LIKE '%??????%' ";
        con += " OR INDUTYPE_NM LIKE '%??????%') ";
        break;
      case '??????/??????':
        con += "??????%') ";
        break;
      case '??????':
        con += "??????%') ";
        break;
      case '????????????':
        con += "????????????%') ";
        break;
      case '???????????????/??????':
        con += "?????????%') ";
        break;
      case '?????????':
        con += "?????????%') ";
        break;
      case '??????':
        con += "??????%') ";
        break;
      case '??????':
        con += "??????%' ";
        con += " OR INDUTYPE_NM LIKE '%??????%') ";
        con += " AND INDUTYPE_NM NOT LIKE '%??????????????????%' ";
        break;
      case '??????':
        con += "??????%') ";
        break;
      case '?????? ????????????':
        con += "??????????????????%') ";
        break;
      case '??????/??????/????????????':
        con += "????????????%') ";
        break;
      case '?????????':
        con += "??????%') ";
        break;
      case '??????/????????????':
        con += "??????%') ";
        break;
      case '??????':
        con += "??????%' ";
        con += " OR INDUTYPE_NM LIKE '%??????%' ";
        con += " OR INDUTYPE_NM LIKE '%?????????%') ";
        break;
      case '??????':
      case '':
      default:
        con += "%') ";
        break;
    }

    return con;
  };

  selectStoreInfo = async (sigun = '', indutype = '', conditions = '', from = 0, limit = 10) => {
    let query = `SELECT CMPNM_NM,
      INDUTYPE_NM,
      TELNO,
      REFINE_LOTNO_ADDR,
      REFINE_ROADNM_ADDR,
      REFINE_ZIP_CD,
      REFINE_WGS84_LOGT,
      REFINE_WGS84_LAT,
      SIGUN_NM 
      FROM STORE_INFO 
      WHERE 1=1`;

    const sigunList = sigun
      .split(' ')
      .map((item) => `'${item}'`)
      .join(',');
    query += ` AND SIGUN_NM IN (${sigunList})`;

    conditions.split(' ').forEach((condition) => {
      query += mysql.format(
        ` AND (CMPNM_NM LIKE ?
          OR REFINE_LOTNO_ADDR LIKE ?
          OR REFINE_ROADNM_ADDR LIKE ?
          OR INDUTYPE_NM LIKE ?)`,
        Array(4).fill(`%${condition}%`)
      );
    });

    query += this.createIndutypeCon(indutype);
    query += mysql.format(` LIMIT ?, ?`, [+from, +limit]);

    const result = await this.select(query);
    return result;
  };

  selectStoreInfoCount = async (sigun = '', indutype = '', conditions = '') => {
    let query = `SELECT COUNT(*) CNT
      FROM STORE_INFO 
      WHERE 1=1`;

    const sigunList = sigun
      .split(' ')
      .map((item) => `'${item}'`)
      .join(',');
    query += ` AND SIGUN_NM IN (${sigunList})`;

    conditions.split(' ').forEach((condition) => {
      query += mysql.format(
        ` AND (CMPNM_NM LIKE ?
          OR REFINE_LOTNO_ADDR LIKE ?
          OR REFINE_ROADNM_ADDR LIKE ?
          OR INDUTYPE_NM LIKE ?)`,
        Array(4).fill(`%${condition}%`)
      );
    });

    query += this.createIndutypeCon(indutype);

    const result = await this.select(query);
    return result;
  };

  selectStoreInfoByArea = async (
    sigun = '',
    indutype = '',
    conditions = '',
    lat_lcl = 0,
    lat_ucl = 0,
    lon_lcl = 0,
    lon_ucl = 0,
    limit = 10
  ) => {
    let query = `SELECT CMPNM_NM,
      INDUTYPE_NM,
      TELNO,
      REFINE_LOTNO_ADDR,
      REFINE_ROADNM_ADDR,
      REFINE_ZIP_CD,
      REFINE_WGS84_LOGT,
      REFINE_WGS84_LAT,
      SIGUN_NM 
      FROM STORE_INFO 
      WHERE 1=1`;

    const sigunList = sigun
      .split(' ')
      .map((item) => `'${item}'`)
      .join(',');
    query += ` AND SIGUN_NM IN (${sigunList})`;

    conditions.split(' ').forEach((condition) => {
      query += mysql.format(
        ` AND (CMPNM_NM LIKE ?
          OR REFINE_LOTNO_ADDR LIKE ?
          OR REFINE_ROADNM_ADDR LIKE ?
          OR INDUTYPE_NM LIKE ?)`,
        Array(4).fill(`%${condition}%`)
      );
    });

    query += mysql.format(
      ` AND CONVERT(REFINE_WGS84_LAT, DOUBLE) >= ?
        AND CONVERT(REFINE_WGS84_LAT, DOUBLE) <= ?
        AND CONVERT(REFINE_WGS84_LOGT, DOUBLE) >= ?
        AND CONVERT(REFINE_WGS84_LOGT, DOUBLE) <= ?`,
      [+lat_lcl, +lat_ucl, +lon_lcl, +lon_ucl]
    );

    query += this.createIndutypeCon(indutype);
    query += mysql.format(` LIMIT 0, ?`, +limit);

    const result = await this.select(query);
    return result;
  };
}
