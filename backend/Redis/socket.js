const Redis = require('ioredis')
require('dotenv').config()

const redisOption = {
    host:process.env.HOST,
    port: process.env.PORT,
    username:'default',
    password:process.env.PASSWORD,
}







async function publishMess(message,io) {
    const pub = new Redis(redisOption).on('connect', () => {
        console.log("Publisher Connected");
    })
    .on('error', () => {
        console.log("Publisher Error");
    })
    .on('close',() => {
        console.log("Publisher Disconnected");
    });

    
    console.log("Sending.. ",message);
    await pub.publish("MESSAGE",JSON.stringify(message));
    console.log("Message Send");
    pub.disconnect();
    
    const sub = new Redis(redisOption).on('connect', () => {
        console.log("Subscriber Connected");
    })
    .on('error', () => {
        console.log("Subscriber Connection Error");
    })
    .on('close',() => {
        console.log("Subscriber Disconnected");
    });
    
    await sub.subscribe("MESSAGE",(err, count) => {
        if (err) {
          console.error("Failed to subscribe: %s", err.message);
        } else {
          console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
        }
    });

    
    sub.on('message', async (channel,message) => {
        
        if (channel == "MESSAGE") {
            const msg = JSON.parse(message);
            console.log("Message Receive..");
            await io.to(msg.room).emit("receive_message",msg);
            console.log("Message Received");
            sub.disconnect();
        }
    })
    
}
module.exports = {publishMess};