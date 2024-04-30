const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const port = 3000;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true })); 

mongoose.connect('mongodb://127.0.0.1:27017/Login');
const db = mongoose.connection;
db.once('open', () => {
    console.log('Mongoose connection successfully established');
});

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    pass: String,
    confirmPassword: String
});

const User = mongoose.model('User', userSchema); 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/signup', async (req, res) => {
    const { username, email, pass, confirmPassword } = req.body;
    const user = new User({ 
        username,
        email,
        pass,
        confirmPassword
    });
    await user.save();
    console.log(user);
    res.send("Form submitted");
});

app.listen(port, () => {
    console.log('listening on port');
});

// Handle user login
app.post('/login', async (req, res) => {
    const { username, confirmPassword } = req.body;
    try {
        // Perform authentication logic here
        const user = await User.findOne({ username, confirmPassword });
        if (user) {
            res.status(401).send('Invalid username or password');
        } else {
           
            res.redirect('Front/index.html'); 
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

