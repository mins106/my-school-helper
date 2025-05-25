// backend/meal.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const ATPT_OFCDC_SC_CODE = 'J10'; // 경기도교육청
const SD_SCHUL_CODE = '7531032';  // 동백중학교 고유번호
const NEIS_API_KEY = 'YOUR_API_KEY_HERE'; // 👉 여기에 실제 NEIS API KEY를 입력하세요

router.get('/meal', async (req, res) => {
  const { date } = req.query;

  if (!date) return res.status(400).send('날짜를 지정해 주세요.');

  const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}&MLSV_YMD=${date}&Type=json&KEY=${NEIS_API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.mealServiceDietInfo && data.mealServiceDietInfo[1].row.length > 0) {
      let meal = data.mealServiceDietInfo[1].row[0].DDISH_NM;
      meal = meal.replace(/<br\/>/g, '\n').replace(/[0-9.]/g, '').replace(/\./g, '').trim();
      res.json({ meal });
    } else {
      res.json({ meal: '급식 정보 없음' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('급식 정보를 가져오는 데 실패했습니다.');
  }
});

module.exports = router;
