const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { WebcastPushConnection } = require('@toscolis/tiktok-live-connector');

const TIKTOK_USERNAME = "korlapempat"; 

app.use(express.static(__dirname));
app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html'); });

let tiktokConnection = new WebcastPushConnection(TIKTOK_USERNAME);
tiktokConnection.connect().then(state => {
    console.log(`Connected to room: ${state.roomId}`);
}).catch(err => { console.error('TikTok Connection Error', err); });

tiktokConnection.on('gift', (data) => {
    io.emit('giftEvent', {
        uniqueId: data.uniqueId,
        profilePic: data.profilePictureUrl,
        giftName: data.giftName,
        repeatCount: data.repeatCount
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
