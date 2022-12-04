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


        console.log(link)

        let torrentId = link
        let files
        let names = []
        client.add(torrentId, torrent => {
            files = torrent.files
            let length = files.length
            console.log(files)

            files.forEach(element => {
                names.push(element.name)
            });

            socket.emit('files', names, function(data){

                console.log(data)
                files.forEach(file => {
                  
                    if (data.includes(file.name) == true){
                    const source = file.createReadStream()
                    const destination = fs.createWriteStream(file.name)
                    source.on('end', () => {
                        console.log('file:\t\t', file.name)
                        // close after all files are saved
                        length -= 1
                    }).pipe(destination)
                }
                })

            })
            
            // Stream each file to the disk
           /* files.forEach(file => {
                const source = file.createReadStream()
                const destination = fs.createWriteStream(file.name)
                source.on('end', () => {
                    console.log('file:\t\t', file.name)
                    // close after all files are saved
                    length -= 1
                }).pipe(destination)
            }) */
        })


    })

});


server.listen(port);
