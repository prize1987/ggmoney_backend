import * as api from './api.js';
import Database from '../database/Database.js';

const db = new Database();
const PAGESIZE = 1000;

const updateSigun = async (sigun) => {
  // 1. API Count, DB Count get
  const apicnt = await api.getSigunDataCount(sigun);
  let dbcnt = await db.selectSigunDataCountMaster(sigun);
  console.log(`DB : ${dbcnt}, API : ${apicnt}`);

  if (apicnt === dbcnt) {
    console.log(`API, DB 건수 동일하여 작업 Skip함 (${apicnt})`);
    return;
  }

  // 2. API Total 건수 가져와서 iterate count 계산 (1000건씩 끊어 가져오기)
  const iterCnt = Math.ceil(apicnt / PAGESIZE);

  // 3. DB 테이블 All Delete
  await db.deleteStoreInfo(sigun);

  // 4. api call -> db insert (1000건씩 호출 후 Promise.All 활용)
  let promises = [];
  for (let i = 1; i <= iterCnt; i++) {
    promises.push(api.getSigunData(i, PAGESIZE, sigun));
  }

  const sigunDatas = await Promise.all(promises);
  promises = [];
  sigunDatas.forEach((sigunData) => {
    promises.push(db.insertStoreInfo(sigunData));
  });

  await Promise.all(promises);
  console.log('insert complete');

  // 5. API Count, DB Count
  dbcnt = await db.selectSigunDataCount(sigun);

  // 6. DB Count 마스터 테이블에 기록
  await db.updateSigunCount(sigun, dbcnt);
};

const main = async () => {
  db.connect();

  const sigunList = await db.selectSigunList();

  for await (const sigun of sigunList) {
    console.log(sigun.SIGUN_NM + ' Start');
    await updateSigun(sigun.SIGUN_NM);
  }

  db.end();
};

main();
