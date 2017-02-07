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
  // singup
  app.get('/signup', (req, res) => {
    res.render('signup.ejs', {message: req.flash('singupMessage')});
  });
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
};

function isLoggedIn(req, re, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}
