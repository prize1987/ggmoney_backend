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
  return data.RegionMnyFacltStus[1].row;
};

export { getSigunData };
