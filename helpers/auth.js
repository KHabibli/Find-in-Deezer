const Playlist = require('../models/playlist')
module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
        res.redirect('/login')
    },
    deleteSong: function(req, res, next){
        if(req.params.id == req.user.id){
            return next()
        }
        res.redirect('/')
    },
    checkList: function(req, res, next){
        Playlist.find({user: req.user.id}).then(list => {
            let test = list.find(song => {
                return song.id == req.body.id
            })
            if(test === undefined){
                return next()
            }
            res.redirect('/')
            
        })
    }
    // ensureGuest: function(req, res, next){
    //     if(req.isAuthenticated()){
    //         res.redirect('/dashboard')
    //     }else{
    //         return next()
    //     }
    // }
}