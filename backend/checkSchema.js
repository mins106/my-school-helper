const db = require('./db')

const rows = db.prepare('PRAGMA table_info(memos)').all()
console.table(rows)