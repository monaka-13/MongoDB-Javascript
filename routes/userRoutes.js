const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users - Get all users
router.get('/', async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        next(err);
    }
});

// GET /api/users/user/:id - Get user by id
router.get('/user/:id', async (req, res, next) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        next(err);
    }
});

// POST /api/users/newuser - Create new user
router.post('/newuser', async (req, res, next) => {
    try {
        const { id, email, username } = req.body;
        if (!id || !email) return res.status(400).json({ error: 'id and email are required' });
        const exists = await User.findOne({ id });
        if (exists) return res.status(409).json({ error: 'User with this id already exists' });
        const user = new User({ id, email, username });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
});

// PUT /api/users/modify/:id - Update username by id
router.put('/modify/:id', async (req, res, next) => {
    try {
        const { username } = req.body;
        const user = await User.findOneAndUpdate(
            { id: req.params.id },
            { username },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        next(err);
    }
});

// DELETE /user/delete/:id - Delete user by id
router.delete('/delete/:id', async (req, res, next) => {
    try {
        const user = await User.findOneAndDelete({ id: req.params.id });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        next(err);
    }
});

// (Optional) GET /api/users/getrandomuser - Get one random user
router.get('/getrandomuser', async (req, res, next) => {
    try {
        const count = await User.countDocuments();
        const random = Math.floor(Math.random() * count);
        const user = await User.findOne().skip(random);
        if (!user) return res.status(404).json({ error: 'No users found' });
        res.json(user);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
