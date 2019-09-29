var request = require("request")

const deezerArtist = (artist, callback) => {

    var options = {
        method: 'GET',
        url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
        qs: {q: `${artist}`},
        headers: {
          'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
          'x-rapidapi-key': '253c117fdcmsh5602d98a536a494p13cf6cjsn373ae510bc6f'
        },
        json: true
      }
       let songs = []

       request(options, function (error, response, body) {
          if (error) return  callback(new Error(error),undefined)
          if(body.total === 0) return callback(new Error('Unable to find the artist'), undefined)
          const data = body.data
          const artist_id = body.data[0].artist.id
          for(var i = 0; i < data.length; i++) {
            let duration = data[i].duration%60 < 10 ? `${Math.floor(data[i].duration/60)}:0${data[i].duration%60}` : `${Math.floor(data[i].duration/60)}:${data[i].duration%60}`
              songs.push({
                song_id: data[i].id,
                title: data[i].title_short, 
                duration,
                rank: data[i].rank,
                link: data[i].link,
                album: data[i].album.title
              })
          }
          request({
                    method: 'GET',
                    url: `https://deezerdevs-deezer.p.rapidapi.com/artist/${artist_id}`,
                    headers: {
                      'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
                      'x-rapidapi-key': '253c117fdcmsh5602d98a536a494p13cf6cjsn373ae510bc6f'
                    },
                    json: true
          }, function (error, response, body) {
            if (error) return  callback(new Error(error),undefined)
            callback(undefined, {
              songs,
              fans: body.nb_fan,
              number_of_albums: body.nb_album,
              link: body.link,
              picture: body.picture
            })
          });
          

      })
}


module.exports = deezerArtist
