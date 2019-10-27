//const socket = io("http://localhost:3001");
// Prompt creation to get the username...........
const username=prompt("What is your name?");
console.log(username)
const socket=io("http://localhost:3001",{ 
    query:{
        username:username
    }
})
let nsSocket="";


// listen for nslist event
socket.on("nslist", (nsdata) => {
    const nsDiv = document.querySelector(".namespaces");
    nsDiv.innerHTML = "";
    nsdata.forEach(data => {
        nsDiv.innerHTML += `
        <div class="namespace" ns=${data.endpoint}><img src=${data.img}></div>`
    });

    Array.from(document.getElementsByClassName("namespace")).forEach(Element => {

        Element.addEventListener("click", (e) => {
            e.preventDefault();
            const nsEndpoint = Element.getAttribute("ns");
            console.log(nsEndpoint)
            joinNs(nsEndpoint);
        })
    })
    
    joinNs("/zomato");

})




