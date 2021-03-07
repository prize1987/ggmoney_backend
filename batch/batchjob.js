import * as api from './api.js';
import database from './database.js';

const db = new database();

const updateSigun = async () => {
  db.connect();

  // 1. API Count, DB Count get
  const apicnt = await api.getSigunDataCount('수원시');
  const dbcnt = await db.getStoreInfoCount('수원시');
  console.log(apicnt, dbcnt);

  if (apicnt === dbcnt) {
    console.log(`API, DB 건수 동일하여 작업 Skip함 (${apicnt})`);
    db.end();
    return;
  }

  // 2. API Total 건수 가져와서 iterate count 계산 (1000건씩 끊어 가져오기)

  // 3. DB 테이블 All Delete

  // 4. api call -> db insert (1000건씩 호출 후 Promise.All 활용)

  // 5. API Count, DB Count

  // 6. DB Count 마스터 테이블에 기록

  db.end();
};

const main = async () => {
  updateSigun('수원시');
};

main();
