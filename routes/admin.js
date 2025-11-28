const express = require('express');
const db = require('../models/database');

const router = express.Router();

// Get pending approvals
router.get('/pending-approvals', (req, res) => {
    db.all(
        `SELECT id, email, name, phone, role, address, pincode, created_at 
         FROM users WHERE status = 'pending'`,
        (err, users) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ pendingUsers: users });
        }
    );
});

// Approve/Reject user
router.post('/approve-user/:userId', (req, res) => {
    const { userId } = req.params;
    const { action } = req.body; // 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({ error: 'Invalid action' });
    }

    const status = action === 'approve' ? 'approved' : 'rejected';

    db.run(
        `UPDATE users SET status = ? WHERE id = ?`,
        [status, userId],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
            
            res.json({ 
                success: true,
                message: `User ${status} successfully`
            });
        }
    );
});

// Get platform stats
router.get('/stats', (req, res) => {
    db.get(
        `SELECT 
            COUNT(*) as totalUsers,
            SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approvedUsers,
            SUM(CASE WHEN role = 'donor' THEN 1 ELSE 0 END) as totalDonors,
            SUM(CASE WHEN role = 'receiver' THEN 1 ELSE 0 END) as totalReceivers,
            SUM(CASE WHEN role = 'volunteer' THEN 1 ELSE 0 END) as totalVolunteers
         FROM users`,
        (err, stats) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ stats });
        }
    );
});

module.exports = router;
// Get all pending registrations
router.get('/pending-registrations', (req, res) => {
    db.all(
        `SELECT id, email, name, phone, role, address, pincode, created_at 
         FROM users WHERE status = 'pending' ORDER BY created_at DESC`,
        (err, users) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ pendingRegistrations: users });
        }
    );
});

// Get all approved users
router.get('/approved-users', (req, res) => {
    db.all(
        `SELECT id, email, name, phone, role, address, pincode, created_at 
         FROM users WHERE status = 'approved' ORDER BY created_at DESC`,
        (err, users) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ approvedUsers: users });
        }
    );
});

// Approve/Reject user
router.post('/update-user-status/:userId', (req, res) => {
    const { userId } = req.params;
    const { action } = req.body; // 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({ error: 'Invalid action' });
    }

    const status = action === 'approve' ? 'approved' : 'rejected';

    db.run(
        `UPDATE users SET status = ? WHERE id = ?`,
        [status, userId],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
            
            res.json({ 
                success: true,
                message: `User ${status} successfully`
            });
        }
    );
});