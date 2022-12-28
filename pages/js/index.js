window.onload = async function () {

    let socket = io();
    let magnetlink


    function list(files) {
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
            socket.emit('selected', select)
        }
        document.getElementById("dl").appendChild(btn)

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
    }

    document.getElementById("magnetbtn").addEventListener("click", function () {
        //  console.log(document.getElementById("magnet").value)
        magnetlink = document.getElementById("magnet").value
        socket.emit('magnet', magnetlink, function (files) {
            console.log(files)
        })
    })

    socket.on('files', function (files, callback) {
        console.log("am i being recieved?", files)

        if (document.getElementById("dl").innerHTML !== "") {
            document.getElementById("dl").innerHTML = ""
            var div = document.getElementById('box');
            div.innerHTML = ""
            console.log("triffeed")


            var div = document.createElement("div");
            div.id = "dl"
            document.getElementById("box").appendChild(div);

           // list(files)
        }

        list(files)


    })

    socket.on('done', function () {
        console.log(document.getElementById("dl").innerHTML)
        if (document.getElementById("dl").innerHTML !== "") {
            document.getElementById("dl").innerHTML = ""
            var div = document.getElementById('box');
            div.innerHTML = ""
            var div2 = document.createElement("div");
            div2.id = "dl"
            document.getElementById("box").appendChild(div2);
        }

    });

}