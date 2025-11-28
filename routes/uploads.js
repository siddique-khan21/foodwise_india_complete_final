const express = require('express');
const db = require('../models/database');

const router = express.Router();

// Store document reference in database
router.post('/upload-document', express.json(), (req, res) => {
    const { userId, documentType } = req.body;

    console.log('📄 Document upload request:', { userId, documentType });

    if (!userId || !documentType) {
        return res.status(400).json({ error: 'Missing required fields: userId, documentType' });
    }

    // Create a sample file path
    const filePath = `uploads/sample_${documentType.replace(/\s+/g, '_')}_${userId}.pdf`;

    db.run(
        `INSERT INTO documents (user_id, document_type, file_path) VALUES (?, ?, ?)`,
        [userId, documentType, filePath],
        function(err) {
            if (err) {
                console.error('❌ Document upload error:', err);
                return res.status(500).json({ error: 'Failed to save document: ' + err.message });
            }
            console.log('✅ Document saved:', { documentId: this.lastID, documentType });
            res.json({ 
                success: true,
                message: 'Document uploaded successfully',
                documentId: this.lastID
            });
        }
    );
});

// Get user documents
router.get('/user-documents/:userId', (req, res) => {
    const userId = req.params.userId;

    console.log('📋 Fetching documents for user:', userId);

    db.all(
        `SELECT id, document_type, file_path, uploaded_at FROM documents WHERE user_id = ?`,
        [userId],
        (err, documents) => {
            if (err) {
                console.error('❌ Error fetching documents:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            console.log(`✅ Found ${documents.length} documents for user ${userId}`);
            res.json({ documents });
        }
    );
});

module.exports = router;