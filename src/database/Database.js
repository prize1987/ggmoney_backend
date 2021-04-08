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
      case '숙박':
        con += "숙박업%') ";
        break;
      case '여행':
        con += "여행%') ";
        break;
      case '레저':
        con += "레저%' ";
        con += " OR INDUTYPE_NM LIKE '%레져%') ";
        break;
      case '문화/취미':
        con += "문화%' ";
        con += " OR INDUTYPE_NM LIKE '%취미%') ";
        break;
      case '의류/잡화/생활가전':
        con += "의류%' ";
        con += " OR INDUTYPE_NM LIKE '%잡화%' ";
        con += " OR INDUTYPE_NM LIKE '%주방%' ";
        con += " OR INDUTYPE_NM LIKE '%직물%' ";
        con += " OR INDUTYPE_NM LIKE '%가구%' ";
        con += " OR INDUTYPE_NM LIKE '%자재%' ";
        con += " OR INDUTYPE_NM LIKE '%제품%' ";
        con += " OR INDUTYPE_NM LIKE '%농업%') ";
        break;
      case '주유소':
        con += "연료판매점%') ";
        break;
      case '유통/편의점':
        con += "유통%' ";
        con += " OR INDUTYPE_NM LIKE '%도매%' ";
        con += " OR INDUTYPE_NM LIKE '%소매%') ";
        break;
      case '서적/문구':
        con += "서적%') ";
        break;
      case '학원':
        con += "학원%') ";
        break;
      case '사무통신':
        con += "사무통신%') ";
        break;
      case '자동차판매/정비':
        con += "자동차%') ";
        break;
      case '서비스':
        con += "서비스%') ";
        break;
      case '보험':
        con += "보험%') ";
        break;
      case '병원':
        con += "병원%' ";
        con += " OR INDUTYPE_NM LIKE '%의원%') ";
        con += " AND INDUTYPE_NM NOT LIKE '%기타의료기관%' ";
        break;
      case '약국':
        con += "약국%') ";
        break;
      case '기타 의료기관':
        con += "기타의료기관%') ";
        break;
      case '미용/안경/보건위생':
        con += "보건위생%') ";
        break;
      case '음식점':
        con += "음식%') ";
        break;
      case '제과/음료식품':
        con += "식품%') ";
        break;
      case '기타':
        con += "기타%' ";
        con += " OR INDUTYPE_NM LIKE '%별도%' ";
        con += " OR INDUTYPE_NM LIKE '%회원제%') ";
        break;
      case '전체':
      case '':
      default:
        con += "%') ";
        break;
    }

    return con;
  };

  selectStoreInfo = async (sigun, indutype, conditions, from, limit) => {
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

  selectStoreInfoCount = async (sigun, indutype, conditions) => {
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

  selectStoreInfoByArea = async (sigun, indutype, conditions, lat_lcl, lat_ucl, lon_lcl, lon_ucl, limit) => {
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
        AND CONVERT(REFINE_WGS84_LOG, DOUBLE) >= ?
        AND CONVERT(REFINE_WGS84_LOG, DOUBLE) <= ?`,
      [+lat_lcl, +lat_ucl, +lon_lcl, +lon_ucl]
    );

    query += this.createIndutypeCon(indutype);
    query += mysql.format(` LIMIT 0, ?`, +limit);

    const result = await this.select(query);
    return result;
  };
}
