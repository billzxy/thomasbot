require('dotenv').config();
const nickname = require("./functions/nickname");

nickname.toggleAutoNickname();

console.log(process.env.NICKNAME_AUTO_RESET_INTERVAL)
setTimeout(()=>{
    nickname.toggleAutoNickname()
}, 10000)

