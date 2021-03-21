const Discord   = require('discord.js')
const BaseURL   = 'https://retrowave.ru'
const Client    = new Discord.Client()
const Token     = 'your-token'
const axios     = require('axios')
const Guilds    = new Discord.Collection()

var Tracks      = []
var Current     = 0
// Make a request for a user with a given ID
axios.get('https://retrowave.ru/api/v1/tracks?cursor=0&limit=400')
    .then(response => {
        Tracks = response.data.body.tracks
    })
    .catch(error => {
        console.log(error)
    })
Client.login(Token)
Client.on('message', async message => {
  if (!message.guild) return
  if (message.content === '!retro') {
    if (message.member.voice.channel) {
        /* check tracks */
        if(Tracks.length){
            const connection = await message.member.voice.channel.join()
            playMP3(connection)

        }else{
            message.reply('Downloading track list...')
        }
    }else {
        message.reply('You need to join a voice channel first!')
    }
  }
})

const playMP3 = connection =>{
    console.log(Tracks[Current])
    let dispatcher = connection.play(BaseURL+Tracks[Current].streamUrl)
    Client.user.setAvatar(BaseURL+Tracks[Current].artworkUrl)
    Client.user.setActivity(Tracks[Current].title, { type: 'LISTENING' })
    // dispatcher.pause()
    // dispatcher.resume()
    // dispatcher.setVolume(0.5) // half the volume
    dispatcher.on('finish', () => {
        Current++
        console.log('Finished playing!')
        playMP3(connection)
    })
    // dispatcher.destroy() // end the stream
}
