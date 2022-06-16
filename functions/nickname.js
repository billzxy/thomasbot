const utils = require("./utils");

const NICKNAME_MEMBER_ID = process.env.NICKNAME_MEMBER_ID;
const NICKNAME_AUTO_RESET_INTERVAL = process.env.NICKNAME_AUTO_RESET_INTERVAL;
const NICKNAME_NAME = process.env.NICKNAME_NAME;
const HOME_GUILD_ID = process.env.HOME_GUILD_ID;

let global_nickname_timer = null;
let global_home_guild = null;
let global_nickname_member = null;


const changeNickname = () => {
    if(!global_home_guild.me.hasPermission('MANAGE_NICKNAMES')){
        console.log("Thomas does not have the MANAGE_NICKNAMES permission!")
        return;
    }
    if(!global_nickname_member){
        setGlobalGuildAndTargetMember();
    }
    if(NICKNAME_NAME !== global_nickname_member.nickname){
        global_nickname_member.setNickname(NICKNAME_NAME);
    }
}

const setGlobalGuildAndTargetMember = async botClient => {
    global_home_guild = await botClient.guilds.fetch(HOME_GUILD_ID);
    console.log("Home guild is: ", global_home_guild.name);
    global_nickname_member = await global_home_guild.members.fetch(NICKNAME_MEMBER_ID);
    console.log("Target guild member is, ", global_nickname_member.nickname)
    if(!global_home_guild.me.hasPermission('MANAGE_NICKNAMES')){
        console.log("Thomas does not have the MANAGE_NICKNAMES permission!")
    }
}

const toggleAutoNickname = async () => {
    if(global_nickname_timer){
        clearInterval(global_nickname_timer);
        global_nickname_timer = null;
        console.log("Nickname timer destroyed.")
        return;
    }
    global_nickname_timer = setInterval(() => {
        changeNickname();
    }, NICKNAME_AUTO_RESET_INTERVAL)
    console.log("Nickname timer set.")
};

module.exports = {
    changeNickname,
    toggleAutoNickname,
    setGlobalGuildAndTargetMember,
};
