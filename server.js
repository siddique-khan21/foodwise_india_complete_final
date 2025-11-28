const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get('/api', (req, res) => {
    res.json({ 
        message: 'FoodWise India API is running!',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users', 
            admin: '/api/admin'
        }
    });
});

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API Documentation: http://localhost:${PORT}/api`);
});
const uploadRoutes = require('./routes/uploads');

// Add this with other routes
app.use('/api/uploads', uploadRoutes);
const donationRoutes = require('./routes/donations');

// Add with other routes
app.use('/api/donations', donationRoutes);