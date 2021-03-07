import * as api from './api.js';
import database from './database.js';

const main = async () => {
  const data = await api.getSigunData(1, 10, '수원시');
  console.log(data);

  const db = new database();
  db.connect();

  const tableData = await db.select('select * FROM STORE_INFO');
  console.log(tableData);

  db.end();
};

main();
