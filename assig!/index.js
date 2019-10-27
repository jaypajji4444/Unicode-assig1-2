const express=require("express");
const mongoose=require("mongoose");
const app=express();
const bodyParser=require("body-parser");

const Chat=require("./models/chat");
const socketIo=require("socket.io");
const namespaces=require("./Chat/data/namespaces");
//const CORS=require("cors");

app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  

const db=async ()=>{
    await mongoose.connect("mongodb://localhost:27017/Restuarant",{useNewUrlParser:true});
   
}

db().catch(err=>console.log(err));


const RestRoute=require("./routes/res");
const UserRoute=require("./routes/User");



app.use("/Restuarant",RestRoute);
app.use("/User",UserRoute);




const port=3001 || process.env.PORT;
const expressServer=app.listen(port,()=>{
    console.log(`Server running successfully on port:${port}`)
})

const io=socketIo(expressServer);

// Connection to individual namspaces....
namespaces.forEach(namespace=>{
    const thisNS=io.of(namespace.endpoint);
    thisNS.on("connection",(nsSocket)=>{
        
        // getting the infor about user name through handshake send by query objects when clinet connected 
        console.log(nsSocket.handshake.query.username)
        const username=nsSocket.handshake.query.username;

        console.log(`${nsSocket.id} has connected to namespace ${namespace.endpoint}`)
        // a socket has connected our chatgruop namespaces..


        // sedn that group info  back..
        // send room name list
        nsSocket.emit("nsRoomLoad",namespace.rooms);



        // join room from list room selected..
        nsSocket.on("joinRoom",(roomToJoin,numberOfUsersCallback)=>{


            // leaving the room before joining
            const roomLeave=Object.keys(nsSocket.rooms)[1]
            nsSocket.leave(roomLeave);
            roomMembersUpdate(namespace,roomLeave);//Updating room mmebers after leaving


            // Joining the troom
            nsSocket.join(roomToJoin);
            roomMembersUpdate(namespace,roomToJoin);// Updating room menbers  after joining


           // send back history message to room after finding the rooom
            const nsRoom=namespace.rooms.find(room=>{
                return room.roomTitle==roomToJoin;
            })
            nsSocket.emit("historyMsg",nsRoom.history);

           
            

        })

        nsSocket.on("newMessageToServer",async(data)=>{ 
            const message={
                msg:data.text,
                time:data.time,
                username:username,
                avatar:"https://via.placeholder.com/30"
            }

            Chat.create(message).then(data=>console.log(data)).catch(r=>console.log(r))
            // saving message to db........
           


          
            // Send this message to all present in room where this socket i.e where this cleint is...
           // console.log(nsSocket.rooms);//gives info abt room to which this soxket belongs..it is object{<socket.id>,roomToJoin}

            //gettting the keys of the object..to get the room of the sokcet
            const roomTitle=Object.keys(nsSocket.rooms)[1];
          

            // find the room objectfor this room
            const nsRoom=namespace.rooms.find(room=>{
                return room.roomTitle=roomTitle; //return the room match  this Namespace room...
            })
            //console.log(nsRoom)
            //save messages to history..
            nsRoom.addMessage(message)
           // send to room
           io.of(namespace.endpoint).in(roomTitle).emit("messageToClients",message);
           


            
             
            
        })




    })
})



// connection to main namspace........

io.on("connection",(socket,req)=>{ //similar to io.of("/").on("connection",...)

   //console.log(socket.handshake)
// construct an array to send back img and endpoint for each name space.
    const nameSpaceData=namespaces.map(ns=>{
        return {
            img:ns.img,
            endpoint:ns.endpoint
        }
    })

    // send list of namespace to client dnt use io use socket bcoz we jst want to sent to client coneexted..
    socket.emit("nslist",nameSpaceData);
    


})


function roomMembersUpdate(namespace,roomName){
     // Updating number of client in real time to all clients
     io.of(namespace.endpoint).in(roomName).clients((error,client)=>{
        io.of(namespace.endpoint).in(roomName).emit("updateClientNumber",client.length)
    })
}