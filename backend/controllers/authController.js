const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');
const User = require('../models/User');

dotEnv.config();

const secretKey = process.env.WhatIsYourName



const signup = async(req, res) => {
    const { username, email, password } = req.body;
    try {
        const userEmail = await User.findOne({ email });
        if (userEmail) {
            return res.status(400).json("Email already taken");
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", redirectUrl: "/login" });
        console.log('registered')

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }

}

const login = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid username or password" })
        }
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "1h" })

        const userId = user._id;
        const username = user.username;

        res.status(200).json({ success: "Login successful", token, userId, username, redirectUrl: "/" })
        console.log(email, "this is token", token);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }

}


module.exports = { signup, login }