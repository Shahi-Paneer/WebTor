window.onload = async function () {

    let socket = io();
    let magnetlink

    let poop = ['movie1', 'movie45', 'LMAOOOO']

    document.getElementById("magnetbtn").addEventListener("click", function () {
        console.log(document.getElementById("magnet").value)
        magnetlink = document.getElementById("magnet").value
        socket.emit('magnet', magnetlink, function (files) {
            console.log(files)
        })
    })

    socket.on('files', function (files, callback) {
        console.log(files)

        files.forEach(e => {
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = "name";
            checkbox.value = "value";
            checkbox.id = e;

            var label = document.createElement('label')
            label.htmlFor = "id";
            label.appendChild(document.createTextNode(e));

            document.getElementById('box').appendChild(checkbox);
            document.getElementById('box').appendChild(label);
        });

        let btn = document.createElement("input");
        btn.type = "button";
        btn.value = "Download";
        btn.id = "download"

        btn.onclick = function () {
            let select = []
            files.forEach(e => {
                console.log(e, document.getElementById(e).checked)
                if (document.getElementById(e).checked === true) {
                    select.push(e)
                }


            });
            console.log(select)
            callback(select)
        }
        document.getElementById("dl").appendChild(btn)

        console.log(document.getElementById(files[0]).checked)

    })

}