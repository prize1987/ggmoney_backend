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
}
