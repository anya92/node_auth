// setup our application
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import flash from 'connect-flash';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import configDB from '../config';

const app = express();
const port = process.env.PORT || 8080;
const mLab = `mongodb://${configDB.host}/${configDB.name}`;

mongoose.connect(mLab);
// set up express application
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

// for passport
app.use(session({secret: 'topsecret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// routes
require('../app/routes.js')(app, passport);
//launch
app.listen(port);
console.log(`Server running on port ${port}`);
