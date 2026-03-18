const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('deep-email-validator');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// Register User
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, department } = req.body;

        // Role-based Email Validation Rules
        const emailLower = email.toLowerCase();

        if (role === 'student') {
            // Must strictly match: Optional 1 letter, 3 letters, 2 digits, 2 letters, 3 digits @gecskp.ac.in
            // Examples: pkd23cs028@gecskp.ac.in or lpkd23cs068@gecskp.ac.in
            const studentRegex = /^[a-z]?[a-z]{3}\d{2}[a-z]{2}\d{3}@gecskp\.ac\.in$/;
            if (!studentRegex.test(emailLower)) {
                return res.status(400).json({
                    message: 'Invalid Student Email. Must use your official 10 or 11-character college ID (e.g., lpkd23cs068@gecskp.ac.in)'
                });
            }
        }
        else if (role === 'staff') {
            // Must end with @gecskp.ac.in
            if (!emailLower.endsWith('@gecskp.ac.in')) {
                return res.status(400).json({
                    message: 'Invalid Staff Email. Must use an official @gecskp.ac.in address.'
                });
            }
        }
        else if (role === 'admin') {
            // Prevent public admin registration entirely
            return res.status(403).json({ message: 'Security Policy: Admin accounts cannot be self-registered.' });
        }

        // Active Email Validation
        // College servers often block external SMTP/MX pings, causing false negatives.
        // We will validate syntax and disposable emails, but ignore MX/SMTP for gecskp.ac.in
        const isCollegeEmail = emailLower.endsWith('@gecskp.ac.in');

        const isEmailValid = await validator.validate({
            email: emailLower,
            validateRegex: true,
            validateMx: !isCollegeEmail, // Skip MX check for college email
            validateTypo: true,
            validateDisposable: true,
            validateSMTP: false, // SMTP often times out, rely on MX for others
        });

        if (!isEmailValid.valid) {
            return res.status(400).json({
                message: 'Email address appears to be invalid or does not exist. Please use an active, working email.'
            });
        }

        const existingUser = await User.findOne({ email: emailLower });
        if (existingUser) return res.status(400).json({ message: 'Email address already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email: emailLower, password: hashedPassword, role, department });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        // Include email and department in localStorage payload for Profile view
        res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email, department: user.department } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

module.exports = router;
