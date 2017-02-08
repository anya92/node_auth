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

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.google.token) {
                            user.google.token = token;
                            user.google.name  = profile.displayName;
                            user.google.email = profile.emails[0].value; // pull the first email

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }

                        return done(null, user);
                    } else {
                        var newUser          = new User();

                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = profile.emails[0].value; // pull the first email

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user               = req.user; // pull the user out of the session

                user.google.id    = profile.id;
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = profile.emails[0].value; // pull the first email

                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });

            }

        });

    }));
};
