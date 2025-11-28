const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../models/database');

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
    const { email, password, name, phone, role, address, pincode } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(`INSERT INTO users (email, password, name, phone, role, address, pincode) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [email, hashedPassword, name, phone, role, address, pincode],
            function(err) {
                if (err) {
                    return res.status(400).json({ error: 'User already exists' });
                }
                res.json({ 
                    message: 'Registration successful - pending admin approval',
                    userId: this.lastID
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// User login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (user.status !== 'approved') {
            return res.status(400).json({ error: 'Account pending admin approval' });
        }

        res.json({ 
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
});

module.exports = router;
// Admin login
router.post('/admin-login', (req, res) => {
    const { email, password } = req.body;

    // Hardcoded admin credentials for now
    const adminEmail = 'admin@foodwise.org';
    const adminPassword = 'Admin123!';

    if (email === adminEmail && password === adminPassword) {
        res.json({ 
            success: true,
            message: 'Admin login successful',
            user: {
                id: 1,
                name: 'FoodWise Admin',
                email: email,
                role: 'admin'
            }
        });
    } else {
        res.status(400).json({ error: 'Invalid admin credentials' });
    }
});
// User login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log('🔐 Login attempt:', email);

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // For now, simple password check (in production, use bcrypt)
        if (password !== 'TempPass123!') {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Check account status
        if (user.status === 'pending') {
            return res.status(400).json({ error: 'Account pending admin approval' });
        }

        if (user.status === 'rejected') {
            return res.status(400).json({ error: 'Account rejected. Please contact admin.' });
        }

        res.json({ 
    success: true,
    message: 'Login successful',
    user: {
        id: user.id,
        name: user.name || 'User',
        email: user.email,
        role: user.role
    }
});
    });
});
//console.log('🔐 User found:', user ? user.email : 'No user');