// configuring the strategies for passport

const LocalStrategy = require('passport-local').Strategy;

const User = require('../app/models/user');

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
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          let newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save((err) => {
            if(err) throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));
};
