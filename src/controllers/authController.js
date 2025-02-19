const { admin, db } = require('../config/firebase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    const { email, password, name, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        await db.collection('users').doc(user.uid).set({
            email,
            name,
            role: role || 'user',
            password: hashedPassword,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(201).json({ message: 'User registered successfully', uid: user.uid });
    } catch (error) {
        res.status(400).json({ message: 'Registration failed', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const users = await db.collection('users').where('email', '==', email).get();
        if (users.empty) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        let userData;
        users.forEach(doc => {
            userData = { id: doc.id, ...doc.data() };
        });

        const isValid = await bcrypt.compare(password, userData.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: userData.id, email: userData.email, role: userData.role },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({ token, userId: userData.id, role: userData.role });
    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...userData } = userDoc.data();
        res.json(userData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
};