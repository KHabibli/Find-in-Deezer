const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const deezerArtist = require('./utils/deezerArtist')
const deezerSong = require('./utils/deezerSong')
const { ensureAuthenticated, deleteSong, checkList } = require('./helpers/auth')

const app = express()
const port = process.env.PORT || 5000

// Load keys
const keys = require('./config/keys')

// Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Connecting to the database
mongoose.connect('mongodb+srv://findindeezer:iostream14@findindeezer-f7yf1.mongodb.net/findindeezer?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
})

// Map global promise - get rid of warning
// mongoose.Promise = global.Promise;

// Load models
const User = require('./models/user')
const Playlist = require('./models/playlist')

// Passport Config
require('./config/passport')(passport)

// Session middleware
app.use(session({ 
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

// flash middleware
app.use(flash())

// Method override
app.use(methodOverride('_method'))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())


// Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.user = req.user || null
    next()
})

app.listen(port , () => {
    console.log(`Server is up on port ${port}.`)
})


app.get('/' , ensureAuthenticated, (req,res) => {
    res.render('index')
})

app.post('/artist',ensureAuthenticated,checkList, (req, res) => {
    if (!req.body.artist) {
        return res.render('index',{
            errors: [{
                text: 'Invalid input!'
            }]
        })
    }
    deezerArtist(req.body.artist, (error, data) => {
        if(error) {
            return res.render('index',{
                errors: [{
                    text: 'Invalid input!'
                }]
            })
        }
        res.render('result', {
            albums: data.number_of_albums,
            fans: data.fans,
            songs: data.songs,
            artist_link: data.link,
            artist_picture: data.picture
        })
    })

})

// Load login page
app.get('/login', (req, res) => {
    res.render('login')
})
// Login
app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/welcome',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
})
// Logout
app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
})


// Load register page
app.get('/register', (req, res) => {
    res.render('register')
})

// Register
app.post('/register', (req, res) => {
    let errors = []
    if(req.body.password1 !== req.body.password2){
        errors.push({text: 'Passwords dont match!'})
    }
    if(!req.body.name){
        errors.push({text: 'Invalid name!'})
    }
    if(!req.body.email){
        errors.push({text: 'Invalid email!'})
    }
    if(req.body.password1.length < 4){
        errors.push({text: 'Password is too short'})
    }
    if(errors.length > 0){
        res.render('register', {
            errors,
            name: req.body.name,
            email: req.body.email
        })
    }else{
        bcrypt.genSalt(9, function(err, salt) {
            bcrypt.hash(req.body.password1, salt, function(err, hash) {
                if(err) throw new Error()
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                })
                newUser.save().then(user => {
                    req.flash('success_msg','You are now registered and can log in')
                    res.redirect('/login')
                }).catch(err => {
                    res.render('/register', {
                        errors: [{
                            text: 'This email has been taken!'
                        }],
                        name: req.body.name,
                        email: req.body.email
                    })
                    
                })
            })
        })
    }
})

app.get('/welcome', ensureAuthenticated, (req, res) => {
    res.render('welcome', {
        user: req.user
    })
})


app.get('/myList',ensureAuthenticated, (req, res) => {
    Playlist.find({user:req.user.id}).then(data => {
        res.render('myList', {
            data
        })
    })
    
})

app.post('/myList',ensureAuthenticated, (req, res) => {
    deezerSong(req.body.id, (error, data) => {
        if(error) {
            return res.render('index',{
                errors: [{
                    text: 'Invalid input!'
                }]
            })
        }
        const newSong = new Playlist({
            title: data.title,
            duration: data.duration,
            album: data.album,
            link: data.link,
            id: data.id,
            artist: data.artist,
            user: req.user.id
        })
        newSong.save().then(data => {
                req.flash('success_msg','New song is added to your list')
                res.redirect('/myList')
            })
        })
    })

app.delete('/myList/:id',deleteSong, (req, res) => {
    Playlist.findByIdAndRemove(req.params.id).then(() => {
        req.flash('success_msg','Song is deleted')
        res.redirect('/myList')
    })
})
