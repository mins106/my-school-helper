const Database = require('better-sqlite3')
const db = new Database('reviews.db')

// 테이블이 없으면 생성
db.prepare(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dateCode TEXT,
    rating INTEGER,
    text TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run()

module.exports = db