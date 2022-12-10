const http = require('http');
const https = require('https');
const express = require('express');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path')
const port = 3000
const WebTorrent = require('webtorrent')
const fs = require('fs')

const client = new WebTorrent()
app.use(express.static('pages'));

io.on('connection', function (socket) {

    console.log('A user connected');
    socket.on('magnet', function (link, callback) {


        // console.log(link)

        let torrentId = link
        if (client.get(torrentId) == null) {
            let files
            let names = []
            client.add(torrentId, torrent => {
                files = torrent.files
                let length = files.length
                // console.log(files)

                files.forEach(element => {
                    names.push(element.name)
                });

                socket.emit('files', names, function (data) {

                    files.forEach(file => {

                        if (data.includes(file.name) == true) {
                            console.log(client.get(torrentId).magnetURI, "HHIHIHI")
                            const source = file.createReadStream()
                            const destination = fs.createWriteStream(file.name)
                            source.on('end', () => {
                                console.log(client.get(), "HHIHIHI")

                            }).pipe(destination)

                        }

                    })
                    client.remove(torrentId)
                })


            })
        } else {
            console.log("torrent exists already")
        }



    })

});


server.listen(port);
console.log(`Server listening on port: ${port}`)