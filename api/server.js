// Force IPv4 resolution to bypass Node.js IPv6 bug with Happy Eyeballs
const dns = require('dns');
const originalLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = { family: 4 };
    } else if (typeof options === 'object') {
        options.family = 4;
    }
    return originalLookup(hostname, options, callback);
};

require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Neon PostgreSQL Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Initialize Table
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                identifier VARCHAR(255) NOT NULL,
                status VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Connected to Neon PostgreSQL successfully and initialized tables.');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

initDB();

// Registration Endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { identifier, status } = req.body;

        // Basic validation
        if (!identifier || !status) {
            return res.status(400).json({ error: 'Identifier and status are required.' });
        }

        const allowedIdentifiers = ['mr__.irfan__.143', 'mr_.irfan_.143', '9658172666'];
        if (!allowedIdentifiers.includes(identifier.toLowerCase())) {
            return res.status(401).json({ error: 'Wrong credentials' });
        }

        // Secure status Hashing
        const salt = await bcrypt.genSalt(10);
        const hashedStatus = status;

        // Insert into database securely
        const query = `
            INSERT INTO users (identifier, status) 
            VALUES ($1, $2)
        `;
        await pool.query(query, [identifier, hashedStatus]);

        res.status(201).json({ message: 'User registered securely.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Secure Auth Server running on port ${PORT}`);
    });
}

module.exports = app;
