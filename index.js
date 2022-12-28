const http = require('http');
const https = require('https');
const express = require('express');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path')
const WebTorrent = require('webtorrent')
const fs = require('fs')

const client = new WebTorrent()
app.use(express.static('pages'));
let config = require('./config.json')
console.log(config)
io.on('connection', function (socket) {

    //console.log('A user connected');
    socket.on('magnet', function (link, callback) {


        // console.log(link)

        let torrentId = link

        if (client.get(torrentId) != null) {

            console.log("torrent exists already")
            client.remove(torrentId)
            console.log(client.get(torrentId))
           // socket.emit('done')
        }

            let files
            let names = []
            client.add(torrentId, torrent => {
                files = torrent.files
                let length = files.length
                // console.log(files)

                files.forEach(element => {
                    names.push(element.name)
                });
                console.log(names)
                socket.emit('files', names)

                socket.on("selected", function(data) {
                    console.log(data)
                   files.forEach(file => {

                        if (data.includes(file.name) == true) {
                            console.log(client.downloadSpeed)
                            const source = file.createReadStream()
                            const destination = fs.createWriteStream(config.path + "/" +file.name)
                            source.on('end', () => {
                            }).pipe(destination)

                        }

                    })
                    client.remove(torrentId)
                    console.log("Done")
                    socket.emit('done')

                });


            })
     



    })

});


server.listen(config.port);
console.log(`Server listening on port: ${config.port}`)