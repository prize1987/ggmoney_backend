import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const API_KEY = process.env.API_KEY_GGMONEY;

const request = async (url) => {
  try {
    const response = await fetch(encodeURI(url));
    const json = await response.json();
    return json;
  } catch (e) {
    console.log(e);
  }
};

const getSigunData = async (pIndex, pSize, pSigun) => {
  const url = 'https://openapi.gg.go.kr/RegionMnyFacltStus';
  const type = 'json';

  let fetch_url = url + '?KEY=' + API_KEY;
  fetch_url += '&pIndex=' + pIndex;
  fetch_url += '&pSize=' + pSize;
  fetch_url += '&type=' + type;
  fetch_url += '&SIGUN_NM=' + pSigun;

  const data = await request(fetch_url);
  return data.RegionMnyFacltStus[1].row.map((row) => [
    row.CMPNM_NM,
    row.INDUTYPE_NM,
    row.TELNO,
    row.REFINE_LOTNO_ADDR,
    row.REFINE_ROADNM_ADDR,
    row.REFINE_ZIP_CD,
    row.REFINE_WGS84_LOGT,
    row.REFINE_WGS84_LAT,
    row.SIGUN_NM,
  ]);
};

const getSigunDataCount = async (sigun) => {
  const url = 'https://openapi.gg.go.kr/RegionMnyFacltStus';
  const appKey = API_KEY_GGMONEY;
  const pIndex = 1;
  const pSize = 1;
  const type = 'json';

  let fetch_url = url + '?KEY=' + appKey;
  fetch_url += '&pIndex=' + pIndex;
  fetch_url += '&pSize=' + pSize;
  fetch_url += '&type=' + type;
  fetch_url += '&SIGUN_NM=' + sigun;

  const data = await request(fetch_url);
  return data.RegionMnyFacltStus[0].head[0].list_total_count;
};

export { getSigunData, getSigunDataCount };
