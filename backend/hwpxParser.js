// backend/hwpxParser.js
const express = require('express');
const router = express.Router();
const AdmZip = require('adm-zip');
const { XMLParser } = require('fast-xml-parser');
const path = require('path');

// 학사일정 텍스트 추출 API
router.get('/calendar/raw', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'academic.hwpx');
    const zip = new AdmZip(filePath);
    const parser = new XMLParser();
    let text = '';

    try {
        zip.getEntries().forEach(entry => {
            if (entry.entryName.startsWith('Contents/') && entry.entryName.endsWith('.xml')) {
                const xml = entry.getData().toString('utf8');
                const json = parser.parse(xml);
                const paras = json?.['hs:sec']?.['hp:p'];
                const paraArray = Array.isArray(paras) ? paras : [paras];

                paraArray.forEach(p => {
                    const runs = p?.['hp:run'];
                    if (!runs) return;

                    const runArray = Array.isArray(runs) ? runs : [runs];

                    let line = '';
                    runArray.forEach(run => {
                        const text = run?.['hp:t'];
                        if (typeof text === 'string') {
                            line += text;
                        }
                    });

                    if (line.trim()) {
                        text += line.trim() + '\n';
                    }
                });
            }
        });

        res.send({ text });
    } catch (e) {
        console.error('📛 HWPX 추출 오류:', e);
        res.status(500).send('hwpx 파싱 실패');
    }
});

module.exports = router;
