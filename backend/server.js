const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas successfully.'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Registration Endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { identifier, status } = req.body;

        // Basic validation
        if (!identifier || !status) {
            return res.status(400).json({ error: 'Identifier and status are required.' });
        }

        // Create new user (status will be hashed securely by the pre-save hook)
        const newUser = new User({
            identifier,
            status
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered securely.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

app.listen(PORT, () => {
    console.log(`Secure Auth Server running on port ${PORT}`);
});
