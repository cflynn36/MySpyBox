const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
var userProfile;

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.render('pages/index.html');
});

app.get('/dashboard', function(req, res) {
  if (!req.user) {
    res.redirect('/');
    return;
  }

  res.render('pages/success', { user: req.user });
});

app.get('/log-in.html', function(req, res) {
  res.sendFile(__dirname + '/views/pages/log-in.html');
});

app.get('/dashboard', function(req, res) {
  res.sendFile(__dirname + '/views/pages/dashboard');
});



passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = 'YOUR-CLIENT-ID';
const GOOGLE_CLIENT_SECRET = 'YOUR-CLIENT-SECRET';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/dashboard');
  });

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));
