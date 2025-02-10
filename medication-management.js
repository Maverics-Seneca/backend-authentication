const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/**
 * @route   POST /api/medication
 * @desc    Add medication details to Firestore
 */
app.post('/api/medication', async (req, res) => {
    const { userId, name, dosage, frequency } = req.body;

    try {
        await db.collection('medications').add({
            userId,
            name,
            dosage,
            frequency,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(201).json({ message: 'Medication added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding medication', error: error.message });
    }
});

/**
 * @route   GET /api/medication/:userId
 * @desc    Get medications for a user
 */
app.get('/api/medication/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const medsSnapshot = await db.collection('medications').where('userId', '==', userId).get();
        const medications = medsSnapshot.docs.map(doc => doc.data());

        res.json({ medications });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching medications', error: error.message });
    }
});

const PORT = 6000;
app.listen(PORT, () => console.log(`Medication Management Service running on port ${PORT}`));
