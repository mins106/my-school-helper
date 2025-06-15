const Database = require('better-sqlite3')
const db = new Database('reviews.db')

// ✅ 리뷰 테이블 생성
db.prepare(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dateCode TEXT,
    rating INTEGER,
    text TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run()

// ✅ 메모 테이블 생성
db.prepare(`
  CREATE TABLE IF NOT EXISTS memos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dateCode TEXT,
    period INTEGER,
    text TEXT,
    isPublic INTEGER,
    createdAt TEXT
  )
`).run()

// grade 컬럼 없으면 추가
try {
  db.prepare(`ALTER TABLE memos ADD COLUMN grade INTEGER`).run()
} catch (e) {
  if (!e.message.includes('duplicate column name')) {
    console.error('grade 컬럼 추가 실패:', e)
  }
}

// classNo 컬럼 없으면 추가
try {
  db.prepare(`ALTER TABLE memos ADD COLUMN classNo INTEGER`).run()
} catch (e) {
  if (!e.message.includes('duplicate column name')) {
    console.error('classNo 컬럼 추가 실패:', e)
  }
}

module.exports = db