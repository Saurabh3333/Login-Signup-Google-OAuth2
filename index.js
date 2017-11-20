const express = require('express');
var path = require('path');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');

var htmlPath = path.join(__dirname, '/');

const app = express();

//setup view engine
app.set('view engine','ejs');

app.use(cookieSession({
     maxAge: 24 * 60 * 60 * 1000,
     keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

//connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
	console.log('connected to mongodb');
});

//for making images and other external files accessible. For this path is included and htmlPath is defined
app.use(express.static(htmlPath));

// set up routes
app.use('/auth',authRoutes);
app.use('/profile',profileRoutes);

//create home route
app.get('/',(req, res) => {
	res.render('home', {user: req.user});
});

app.listen(3000, () => {
   console.log('app is listening to port 3000');
});