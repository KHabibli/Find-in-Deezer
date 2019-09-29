const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

// Load user model

const User = require('../models/user')

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'},(email,password,done) => {
        // Match user
        User.findOne({
            email
        }).then(user => {
            if(!user){
                return done(null,false, {message: 'No user found'})
            }
            // Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err
                if(isMatch){
                    return done(null, user)
                }else{
                    return done(null,false, {message: 'Incorrect password'})
                }
            })
        })
    }))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      })
}