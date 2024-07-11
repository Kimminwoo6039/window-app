const Database = require("better-sqlite3")
const path = require("path")

console.log('ok')

const dbPath = path.join(__dirname, "../../meercatch.db")

const db = new Database(dbPath,{ verbose: console.log })
db.pragma("journal_mode = WAL")

console.log("ok")
exports.db = db
