import React, { useEffect, useState } from 'react'

const Chat = ({socket,username,room}) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messsageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: 
                    new Date(Date.now()).getHours()+":"
                    + new Date(Date.now()).getMinutes() 
            }

            await socket.emit("send_message",messsageData)
        }
    }

    useEffect(()=> {
        socket.on("receive_message",(data) => {
            console.log(data);
            setMessageList((list) => [...list,data])
        })
    },[socket])

  return (
    <div className='message'>
        <div className="chat_header">
            <h2>Live Chat</h2>
        </div>
        <div className="chat_body">
            {
                messageList.map((messageContent) => {
                    return (
                        <div className='msg' id={username === messageContent.author ? "you" : "other"}>
                            <div className="message_content">
                                <p>{messageContent.message}</p>
                            </div>
                            <div className='message_meta'>
                                <p id='time'><b>Time</b>: {messageContent.time}</p>
                                <p id='author' style={{marginLeft:"10px"}}><b>Send by: </b>{messageContent.author}</p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
        <div className="chat_footer">
            <input type="text" placeholder='hey...' onChange={(e) => setCurrentMessage(e.target.value)} style={{width:"250px",margin:"5px",padding:"5px", borderRadius:"5px"}}/>
            <button onClick={sendMessage} style={{height:"28px"}}>&#9658;</button>
        </div>
    </div>
  )
}

export default Chat 