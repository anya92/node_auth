// all the routes for our application

module.exports = (app,passport) => {
  // home page
  app.get('/', (req, res) => {
    res.render('index.ejs');
  });
  // login
  app.get('/login', (req, res) => {
    res.render('login.ejs', {message: req.flash('loginMessage')});
  });
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));
  // singup
  app.get('/signup', (req, res) => {
    res.render('signup.ejs', {message: req.flash('singupMessage')});
  });
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));
  // profile
  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', {
      user: req.user
    });
  });
  // logout
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  // google routes
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}));
  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));
};

function isLoggedIn(req, re, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}
