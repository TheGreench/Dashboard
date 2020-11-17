/* eslint-disable no-unused-vars */
require('./strategies/discordstrategy.js');
require('dotenv').config();
const Str = require('@supercharge/strings');
const express = require('express');
const app = express();
const PORT = process.env.PORT || process.env.PORT2;
// const PORT = process.env.PORT2;
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

// Routes
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard');
/*
const homeRoute = require('./routes/home');;*/

// Discord Session
app.use(session({
	secret: process.env.SECRET_COOKIE,
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
/*
app.use('/home', homeRoute);*/

app.get('/', isAuthorized, (req, res) => {
	res.render('index');
});
app.get('/forbidden', (req, res) => {
	res.sendStatus(403);
});
app.get('/404', (req, res) => {
	res.sendStatus(404);
});
app.get('/400', (req, res) => {
	res.sendStatus(400);
});
app.get('/discord', (req, res) => {
	res.redirect('https://discord.gg/mpZvhJQ');
});
app.get('/invite', (req, res) => {
	res.redirect('https://discord.com/api/oauth2/authorize?client_id=717709652409712690&permissions=8&scope=bot');
});

function isAuthorized(req, res, next, client) {
	if(req.user) {
		console.log('[WEB] User is logged in.');
		res.redirect('/dashboard');
	}
	else {
		console.log('[WEB] User is not logged in.');
		next();
	}
}

app.listen(PORT, () => console.log(`[WEB] Now listening to requests on port ${PORT}`));