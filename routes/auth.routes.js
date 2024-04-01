const express = require('express')
const router = express.Router()
require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {userModel} = require('../models/user.model')

router.get('/', (req,res) => {
    res.json("Login Page")
})





router.post('/signup', async(req,res) => {
    try{
    const {username, email, password, contact, role} = req.body;

    const hashedPassword = await bcrypt.hash(password, 5);

    const user = new userModel({
        username,
        email,
        password: hashedPassword,
        contact, 
        role,
    })

    await user.save();

    res.status(201).json({msg: "User registered successfully"})
    }
    catch(err){
        console.error('Error during user registration:', err);
        res.status(500).json({msg: 'Internal Server Error'});
    }
})




router.post('/login', async (req, res) => {
    try {
        const { contact, password } = req.body;

        const user = await userModel.findOne({ contact });

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                // Generate token
                const token = jwt.sign({ userId: user._id, role: user.role,name: user.username}, process.env.JWT_SECRET, { expiresIn: '10s' });

                res.status(200).json({ token, role: user.role, username: user.username });
            } else {
                res.status(401).json({ msg: 'Invalid Credentials' });
            }
        } else {
            res.status(401).json({ msg: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});




module.exports = router


