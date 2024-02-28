const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");

const cors = require('cors')
const {publishMess} = require('./Redis/socket')
const app = express();

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:'http://localhost:3000'
    }
});

app.use(cors());
app.use(express.json());

io.on("connection" , (socket)=>{
    
    console.log("User Connected " + socket.id);
    
    socket.on("join_room" , (data) => {
        socket.join(data);
        console.log(`User with userId: ${socket.id} Join Room: ${data}`);
    })

    socket.on("send_message" , async (msg)=>{
        // socket.broadcast.emit("receive-msg",{"user":socket.id,"message":message})
        // io.emit("receive-msg",{"user":socket.id,"message":message});
        
        // console.log(msg);
        await publishMess(msg,io);
    });
    
    socket.on("disconnect", () => {
        console.log("User Disconnected ", socket.id);
        socket.disconnect();
    }) 
});


app.use(express.static(path.resolve("./public")));

server.listen(5000,(err)=>{
    if(!err){
        console.log("server started");
    }
})
