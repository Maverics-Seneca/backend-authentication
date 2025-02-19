const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken'); // For secure authentication
const bcrypt = require('bcryptjs'); // For password hashing

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
const SECRET_KEY = process.env.JWT_SECRET

/**
 * @route   POST /api/register
 * @desc    Register user and store details in Firestore
 */
app.post('/api/register', async (req, res) => {
    const { email, password, name, role } = req.body;

    try {
        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in Firebase Authentication
        const user = await admin.auth().createUser({
            email,
            password, // Firebase stores it securely
            displayName: name,
        });

        // Store user details in Firestore
        await db.collection('users').doc(user.uid).set({
            email,
            name,
            role: role || 'user', // Default role is 'user'
            password: hashedPassword, // Store hashed password
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(201).json({ message: 'User registered successfully', uid: user.uid });
    } catch (error) {
        res.status(400).json({ message: 'Registration failed', error: error.message });
    }
});

/**
 * @route   POST /api/login
 * @desc    Authenticate user and return JWT token
 */
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Retrieve user from Firestore
        const users = await db.collection('users').where('email', '==', email).get();

        if (users.empty) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        let userData;
        users.forEach(doc => {
            userData = { id: doc.id, ...doc.data() };
        });

        // Validate password
        const isValid = await bcrypt.compare(password, userData.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: userData.id, email: userData.email, role: userData.role },
            SECRET_KEY,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.json({ token, userId: userData.id, role: userData.role });
    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
});

/**
 * @route   GET /api/user
 * @desc    Get user details (Protected Route)
 */
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

app.get('/api/user', authenticateUser, async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...UserData } = userDoc.data(); // Exclude password

        res.json(UserData);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Authentication Service running on port ${PORT}`));
