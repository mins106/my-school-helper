// backend/server.js
const express = require('express');
const Timetable = require('comcigan-parser');
const cors = require('cors');

const app = express();
app.use(cors());
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

app.listen(3001, () => {
  console.log('✅ 서버 실행 중: http://localhost:3001');
});