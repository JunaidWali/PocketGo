//impoert required modules
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

//connect to MongoDB database
const url = "mongodb://localhost:27017/pocketgo_database";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => 

console.log('Connected to database'))
    .catch((err) => 
 
console.error("Error connecting to MongoDB: ", err));

// Verify Connection
if (mongoose.connection.readyState === mongoose.ConnectionStates.connected) {
    // Code that interacts with the database goes here

} else {
    console.error('Error connecting to MongoDB!');
}

// initialize express app
const app = express();

// Define basic routes
app.get('/', (req, res) => {
    res.send("PocketGo backend running!");
});

// start the server
app.listen(3000, () => console.log("Server listening on port 3000!"));

// Initialize passport
const passportInstance = passport.initialize();
app.use(passportInstance);


// Define a schema for the user with Mongoose
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, require: true },
    // Add other relevant user fields here
});

// Hash the user password before saving to the database
userSchema.pre('save', async function (next) {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
});

const User = mongoose.model('User', userSchema);


// Implement local authentication strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));
  



