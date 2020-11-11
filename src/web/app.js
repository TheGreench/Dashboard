/* eslint-disable no-unused-vars */
require('./strategies/discordstrategy.js');
require('dotenv').config();
const Str = require('@supercharge/strings');
const express = require('express');
const app = express();
const PORT = process.env.PORT || process.env.PORT2;
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const db = require('../utils/db.js');

// Routes
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard');
const profileRoute = require('./routes/profile');
/*
const homeRoute = require('./routes/home');
const guildRoute = require('./routes/servers');*/

// Discord Session
const secretT = Str.random(80);
app.use(session({
	secret: secretT,
	cookie: {
		maxAge: 60000 * 60 * 24,
	},
	saveUninitialized: false,
	resave: false,
	name: 'discord.oauth2',
	store: new MongoStore({
		mongooseConnection:  mongoose.connection,
	}),
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './public')));

// Passports
app.use(passport.initialize());
app.use(passport.session());

// Middleware Routes
app.use('/auth', authRoute);
app.use('/dashboard', dashboardRoute);
app.use('/profile', profileRoute);
/*
app.use('/home', homeRoute);
app.use('/servers', guildRoute);*/

app.get('/', isAuthorized, (req, res) => {
	res.render('index');
});

function isAuthorized(req, res, next, client) {
	if(req.user) {
		console.log('[WEB] User is logged in.');
		res.redirect('/');
	}
	else {
		console.log('[WEB] User is not logged in.');
		next();
	}
}

app.listen(PORT, () => console.log(`[WEB] Now listening to requests on port ${PORT}`));
db.then(() => console.log('[#] Connected to MongoDB.')).catch(err => console.log(err));