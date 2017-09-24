//Requiring passport dependencies
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var db = require("../models");

//Configuring Passport to use a Local Strategy meaning a username or email address and password.
//This application is using only an email address so we configure the usernameField to reflect that
passport.use(new LocalStrategy(
  {
    usernameField: "email"
  },
  function (email, password, done) {
    db.User.findOne({
      where: {
        email: email
      }
    }).then(function (user) {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      else if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));


// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Exporting our configured passport
module.exports = passport;
