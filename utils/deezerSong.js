const request = require("request");

const deezerSong = (id, callback) => {
      
      request({
        method: 'GET',
        url: `https://deezerdevs-deezer.p.rapidapi.com/track/${id}`,
        headers: {
          'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
          'x-rapidapi-key': '253c117fdcmsh5602d98a536a494p13cf6cjsn373ae510bc6f'
        },
        json:true
        }, function (error, response, body) {
          if (error) return  callback(new Error(error),undefined)
      
        //   console.log(body)
        let duration = body.duration%60 < 10 ? `${Math.floor(body.duration/60)}:0${body.duration%60}` : `${Math.floor(body.duration/60)}:${body.duration%60}`
        callback(undefined,{
            title: body.title_short,
            duration,
            album: body.album.title,
            link: body.link,
            id
        })
      });


}


module.exports = deezerSong