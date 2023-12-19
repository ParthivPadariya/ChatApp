import './App.css';
import React, { useState } from 'react'
import {io} from 'socket.io-client'

import Chat from './Chat.js'

const socket = io.connect("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room",room);
      setShowChat(!showChat)
    }
  }
  return ( 
    <div className="App">
      {!showChat ? 
        <div className="joinChatContainer">
          <h3>Join A Room</h3>
          <input type="text" placeholder='John..' onChange={(e) => setUsername(e.target.value)} style={{margin:"5px",padding:"5px", borderRadius:"5px"}}/>
          <input type="text" placeholder='Room id...' onChange={(e) => setRoom(e.target.value)} style={{margin:"5px",padding:"5px", borderRadius:"5px"}}/>
          <button onClick={joinRoom} style={{margin:"5px", width:"auto", height:"30px", borderRadius:"10px"}}>Join A Room</button>
        </div>
      
      :
        <Chat socket={socket} username = {username} room = {room}/>
      }
    </div>
  );
}

export default App;