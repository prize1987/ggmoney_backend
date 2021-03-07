import * as api from './api.js';
import database from './database.js';

const main = await () => {
  const data = await api.getSigunData(pIndex, pSize, pSigun);
  console.log(data);
}

main();