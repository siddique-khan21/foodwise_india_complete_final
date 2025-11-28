const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../models/database');

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
    const { email, password, name, phone, role, address, pincode } = req.body;

    console.log('📥 Registration attempt:', { email, role, name });

    // Validate required fields
    if (!email || !password || !name || !role) {
        console.log('❌ Missing fields:', { email: !!email, password: !!password, name: !!name, role: !!role });
        return res.status(400).json({ error: 'Missing required fields: email, password, name, role' });
    }

    // Validate role
    const validRoles = ['donor', 'receiver', 'volunteer', 'animal', 'compost', 'admin'];
    if (!validRoles.includes(role)) {
        console.log('❌ Invalid role:', role);
        return res.status(400).json({ error: `Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}` });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log('🔐 Password hashed, inserting into database...');
        
        db.run(
            `INSERT INTO users (email, password, name, phone, role, address, pincode, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [email, hashedPassword, name, phone, role, address, pincode],
            function(err) {
                if (err) {
                    console.error('❌ Database INSERT error:', err.message, err.code);
                    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                        return res.status(400).json({ error: 'Email already registered' });
                    }
                    return res.status(500).json({ error: `Database error: ${err.message}` });
                }
                console.log('✅ User registered successfully, ID:', this.lastID);
                res.json({ 
                    success: true,
                    message: 'Registration successful - pending admin approval',
                    userId: this.lastID
                });
            }
        );
    } catch (error) {
        console.error('❌ Registration process error:', error);
        res.status(500).json({ error: 'Server error during registration: ' + error.message });
    }
});

// Get user profile
router.get('/profile/:id', (req, res) => {
    const userId = req.params.id;
    
    db.get(
        `SELECT id, email, name, phone, role, address, pincode, status, created_at 
         FROM users WHERE id = ?`,
        [userId],
        (err, user) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (!user) return res.status(404).json({ error: 'User not found' });
            
            res.json({ user });
        }
    );
});
// Get all volunteers
router.get('/volunteers', (req, res) => {
    db.all(
        `SELECT name, phone, address, pincode FROM users WHERE role = 'volunteer' AND status = 'approved'`,
        (err, volunteers) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ volunteers });
        }
    );
});

module.exports = router;