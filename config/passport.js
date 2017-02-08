// configuring the strategies for passport

const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../app/models/user');

const configAuth = require('./auth');

module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    process.nextTick(() => {
      User.findOne({'local.email': email}, (err, user) => {
        if (err) return done(err);
        if (user) return done(null, false, req.flash('signupMessage', 'That email is already taken'));

          let newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save((err) => {
            if(err) throw err;
            return done(null, newUser);
          });

      });
    });
  }));
  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
  },
  (req, email, password, done) => {
    User.findOne({'local.email' : email}, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, req.flash('loginMessage', 'No user found'));
      if (!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Wrong password'));
      return done(null, user);
    });
  }));
  passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
  },
    (token, refreshToken, profile, done) => {
      process.nextTick(() => {
        User.findOne({'google.id': profile.id}, (err, user) => {
          if(err) return done(err);
          if(user) {
            return done(null,user);
          } else {
            let newUser = new User();
            newUser.google.id = profile.id;
            newUser.google.token = token;
            newUser.google.name = profile.displayName;
            newUser.google.email = profile.emails[0].value;
            newUser.save((err) => {
              if (err) throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }));
};
