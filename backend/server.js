// backend/server.js
const express = require('express');
const Timetable = require('comcigan-parser');
const cors = require('cors');
const axios = require('axios');
const db = require('./db')

const app = express();
app.use(cors());
app.use(express.json())

const timetable = new Timetable();

app.get('/api/timetable', async (req, res) => {
  const { grade, classNo, weekday } = req.query;

  try {
    await timetable.init();

    const schools = await timetable.search('동백중학교');
    const school = schools.find(s => s.name === '동백중학교' && s.region === '경기');
    if (!school) return res.status(404).send('학교 없음');

    timetable.setSchool(school.code);
    const data = await timetable.getTimetable();

    const gradeNum = parseInt(grade);
    const classNum = parseInt(classNo);
    const dayNum = parseInt(weekday);

    const result = data[gradeNum]?.[classNum]?.[dayNum];
    if (!result) return res.status(404).send('시간표 없음');

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('서버 오류');
  }
});

// ✅ 급식 API
app.get('/api/meal', async (req, res) => {
  const { date } = req.query;
  const API_KEY = 'dcfb8b0b9566467990aaaef78f1ff519';

  const params = {
    KEY: API_KEY,
    TYPE: 'json',
    ATPT_OFCDC_SC_CODE: 'J10',
    SD_SCHUL_CODE: '7751196',
    MLSV_YMD: date
  };

  try {
    const { data } = await axios.get('https://open.neis.go.kr/hub/mealServiceDietInfo', { params });
    const mealData = data?.mealServiceDietInfo?.[1]?.row?.[0];

    if (!mealData) {
      return res.json({
        date,
        kcal: '-',
        menu: []
      });
    }

    const menuList = mealData.DDISH_NM.replace(/\([^\)]+\)/g, '').split('<br/>');

    res.json({
      date,
      kcal: mealData.CAL_INFO,
      menu: menuList
    });
  } catch (err) {
    console.error('급식 API 오류:', err.message);
    res.status(500).send('서버 내부 오류');
  }
});

// 리뷰 저장 API
app.post('/api/review', (req, res) => {
  const { date, rating, text } = req.body;

  try {
    const numericRating = parseInt(rating);
    const createdAt = new Date().toISOString(); // 한국시간으로 하고 싶으면 +9시간 더해도 OK
    const stmt = db.prepare('INSERT INTO reviews (dateCode, rating, text, createdAt) VALUES (?, ?, ?, ?)');
    const info = stmt.run(date, numericRating, text, createdAt);

    res.status(201).json({
      id: info.lastInsertRowid,
      dateCode: date,
      rating: numericRating,
      text,
      createdAt
    });
  } catch (err) {
    console.error('리뷰 저장 오류:', err);
    res.status(500).json({ error: '저장 실패' });
  }
});

// 특정 날짜 리뷰 조회
app.get('/api/review/:dateCode', (req, res) => {
  const stmt = db.prepare('SELECT * FROM reviews WHERE dateCode = ? ORDER BY createdAt DESC')
  const reviews = stmt.all(req.params.dateCode)
  res.json(reviews)
})

// 평균 별점 조회 API
app.get('/api/review/:dateCode/avg', (req, res) => {
  try {
    const stmt = db.prepare('SELECT AVG(rating) as avg FROM reviews WHERE dateCode = ?')
    const row = stmt.get(req.params.dateCode)
    res.json({ avg: row?.avg || 0 })
  } catch (err) {
    console.error('평균 별점 조회 오류:', err)
    res.status(500).json({ error: '평균 조회 실패' })
  }
})

// ✅ 서버는 맨 마지막에 시작해야 함!
app.listen(3001, () => {
  console.log('✅ 서버 실행 중: http://localhost:3001');
});