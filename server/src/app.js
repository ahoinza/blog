const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('./models/User');

const app = express();

app.use(express.json());

app.post('/api/users/register', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hashedPassword });
    const user = await newUser.save();

    res.status(201).json({ message: 'User created successfully.', user });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

module.exports = app;
