const express = require('express');
const db = require('../models/database');

const router = express.Router();

// Create new donation
router.post('/create', (req, res) => {
    const { donor_id, food_name, description, quantity, storage_temp, hours_cooked, category, address, location_link } = req.body;

    db.run(
        `INSERT INTO donations (donor_id, food_name, description, quantity, storage_temp, hours_cooked, category, address, location_link) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [donor_id, food_name, description, quantity, storage_temp, hours_cooked, category, address, location_link],
        function(err) {
            if (err) {
                console.error('Donation creation error:', err);
                return res.status(500).json({ error: 'Failed to create donation' });
            }
            res.json({ 
                success: true,
                message: 'Donation created successfully',
                donationId: this.lastID
            });
        }
    );
});

// Get donations for NGOs (all edible donations)
router.get('/for-ngo', (req, res) => {
    db.all(
        `SELECT d.*, u.name as donor_name, u.phone as donor_phone 
         FROM donations d 
         JOIN users u ON d.donor_id = u.id 
         WHERE d.category = 'Edible - Donate to NGO' AND d.status = 'pending'`,
        (err, donations) => {
            if (err) {
                console.error('Error fetching NGO donations:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ donations });
        }
    );
});

// Get donations for Animal Farms - TEMPORARY FIX
router.get('/for-animal', (req, res) => {
    db.all(
        `SELECT d.*, u.name as donor_name, u.phone as donor_phone 
         FROM donations d 
         JOIN users u ON d.donor_id = u.id 
         WHERE d.status = 'pending'`, // REMOVED CATEGORY FILTER
        (err, donations) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            console.log('🐄 Animal Feed Donations Found:', donations.length);
            res.json({ donations });
        }
    );
});

// Get donations for Composting - TEMPORARY FIX
router.get('/for-compost', (req, res) => {
    db.all(
        `SELECT d.*, u.name as donor_name, u.phone as donor_phone 
         FROM donations d 
         JOIN users u ON d.donor_id = u.id 
         WHERE d.status = 'pending'`, // REMOVED CATEGORY FILTER
        (err, donations) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            console.log('🌿 Compost Donations Found:', donations.length);
            res.json({ donations });
        }
    );
});

// Accept donation
router.post('/accept/:id', (req, res) => {
    const donationId = req.params.id;
    const { accepted_by } = req.body;

    db.run(
        `UPDATE donations SET status = 'accepted', accepted_by = ? WHERE id = ?`,
        [accepted_by, donationId],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ success: true, message: 'Donation accepted successfully' });
        }
    );
});
// Get donor's donation history
router.get('/donor-history/:donorId', (req, res) => {
    const donorId = req.params.donorId;
    
    db.all(
        `SELECT * FROM donations WHERE donor_id = ? ORDER BY created_at DESC`,
        [donorId],
        (err, donations) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ donations });
        }
    );
});

// Get acceptor's history
router.get('/acceptor-history/:acceptorId', (req, res) => {
    const acceptorId = req.params.acceptorId;
    
    db.all(
        `SELECT d.*, u.name as donor_name FROM donations d 
         JOIN users u ON d.donor_id = u.id 
         WHERE d.accepted_by = ? ORDER BY d.created_at DESC`,
        [acceptorId],
        (err, donations) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ donations });
        }
    );
});

// Delete donation
router.delete('/:id', (req, res) => {
    const donationId = req.params.id;
    
    db.run(`DELETE FROM donations WHERE id = ?`, [donationId], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true, message: 'Donation deleted' });
    });
});

// DEBUG: Get ALL donations to see what's actually stored
router.get('/debug-all', (req, res) => {
    db.all(
        `SELECT d.id, d.food_name, d.category, d.status, u.name as donor_name 
         FROM donations d 
         JOIN users u ON d.donor_id = u.id`,
        (err, donations) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            console.log('🔍 ALL DONATIONS IN DATABASE:', donations);
            res.json({ donations });
        }
    );
});

module.exports = router;