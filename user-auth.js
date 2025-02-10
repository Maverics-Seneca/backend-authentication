const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const fetch = require('node-fetch'); // Required for calling Firebase REST API

dotenv.config();

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
 * @route   POST /api/register
 * @desc    Register user and store details in Firestore
 */
app.post('/api/register', async (req, res) => {
    const { email, password, name, role } = req.body;

    try {
        // Create user in Firebase Authentication
        const user = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        // Store user details in Firestore
        await db.collection('users').doc(user.uid).set({
            email,
            name,
            role: role || 'user', // Default role is 'user'
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(201).json({ message: 'User registered successfully', uid: user.uid });
    } catch (error) {
        res.status(400).json({ message: 'Registration failed', error: error.message });
    }
});

/**
 * @route   POST /api/login
 * @desc    Authenticate user with Firebase Authentication and return ID Token
 */
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Firebase REST API request to sign in the user
        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, returnSecureToken: true }),
            }
        );

        const data = await response.json();

        if (data.error) {
            return res.status(401).json({ message: 'Authentication failed', error: data.error.message });
        }

        // Return the ID token & user UID
        res.json({ token: data.idToken, uid: data.localId });
    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Authentication Service running on port ${PORT}`));
