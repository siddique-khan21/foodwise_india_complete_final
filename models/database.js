const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Use NEW database file
const dbPath = path.join(dbDir, 'foodwise_fixed.db');
const db = new sqlite3.Database(dbPath);

console.log('📁 Database path:', dbPath);

// Create tables with CORRECT roles
db.serialize(() => {
    // Users table - CORRECT ROLES
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('donor', 'receiver', 'volunteer', 'animal', 'compost', 'admin')),
        name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        pincode TEXT,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating users table:', err);
        } else {
            console.log('✅ Users table created with correct roles');
        }
    });

    // Other tables...
    db.run(`CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        document_type TEXT NOT NULL,
        file_path TEXT NOT NULL,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS bank_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        account_holder TEXT NOT NULL,
        account_number TEXT NOT NULL,
        ifsc_code TEXT NOT NULL,
        bank_name TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
});

module.exports = db;
// Documents table
db.run(`CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    document_type TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
)`, (err) => {
    if (err) console.error('Error creating documents table:', err);
    else console.log('✅ Documents table ready');
});
// Donations table
db.run(`CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_id INTEGER NOT NULL,
    food_name TEXT NOT NULL,
    description TEXT,
    quantity REAL NOT NULL,
    storage_temp TEXT NOT NULL,
    hours_cooked INTEGER NOT NULL,
    category TEXT NOT NULL,
    address TEXT NOT NULL,
    location_link TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'completed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    accepted_by INTEGER,
    FOREIGN KEY(donor_id) REFERENCES users(id),
    FOREIGN KEY(accepted_by) REFERENCES users(id)
)`, (err) => {
    if (err) console.error('Error creating donations table:', err);
    else console.log('✅ Donations table ready');
});