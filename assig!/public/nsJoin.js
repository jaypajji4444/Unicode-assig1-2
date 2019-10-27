const joinNs = (endpoint) => {
    if(nsSocket){
        //check to  see if nsSocket is actully a socket
        nsSocket.close(); 
        // remove event listerner s on submit message button when any namespace closees.
        document.querySelector("#user-input").removeEventListener("submit",onSubmit)
        
    }
    //connection to endpoints i.e namespace
    nsSocket = io(`http://localhost:3001${endpoint}`);
    nsSocket.on("nsRoomLoad", (nsRooms) => {
        const RoomUl = document.querySelector('.room-list');
        RoomUl.innerHTML = "";
        nsRooms.forEach(room => {
            let glpyh;
            if (room.privateRoom) {
                glpyh = "lock";
            }
            else {
                glpyh = "globe";
            }
            RoomUl.innerHTML += `
    <li class="roomboo"><span class="glypicon glyphicon-${glpyh}"></span>${room.roomTitle}</li>`
        });
        console.log(RoomUl)
        Array.from(document.getElementsByClassName("roomboo")).forEach(Element => {

            Element.addEventListener("click", (e) => {
                console.log(`someone clicked ${e.target.innerText}`)
                joinRoom(e.target.innerText)
                console.log(e.target.innerHTML)
            })
        })

        // Automatically add room for the first time..
        const topRoom = document.querySelector(".roomboo");
        const topName = topRoom.innerText;
        joinRoom(topName);
    })




    nsSocket.on("messageToClients", (data) => {
        const ul=document.querySelector("#messages");
        ul.innerHTML += htmlBuild(data); 
       
    });

   function htmlBuild(data){
        console.log(data)
       const html= `
        <li>
        <div class="user-image">
            <img src="${data.avatar}"/>
        </div>
        <div class="user-message">
            <div class="user-name-time"><b>${data.username}</b><span >${data.time}</span></div>
            <div class="message-text">${data.msg}</div>
        </div>
    </li>`
    return html;
    }




    const form = document.querySelector(".message-form");
    form.addEventListener("submit",onSubmit )
    function onSubmit(event)
        {
            event.preventDefault();
            // console.log("form submitted")
            const input = document.getElementById("user-message");
            // const name = document.getElementById("userName").value;
            if (input.value != "") {
                const newMessage = input.value;
                const date = new Date();
                time = `${date.getHours()}:${date.getMinutes()}`
                nsSocket.emit("newMessageToServer", { text: newMessage, time })
                input.value = "";
            }
        }
    

}