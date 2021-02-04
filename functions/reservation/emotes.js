

class Emote{
    static emoteList = {
        yea:{
            name:'yea',
            id:'731797334479994901'
        }, 
        nay:{
            name:'nay',
            id:'731797314036957195'
        }
    };

    static getEmoteStr = (name) =>{
        return `<:${this.emoteList[name].name}:${this.emoteList[name].id}>`;
    }

    static equalsEmoteId = (emoteName, id) => {
        return this.emoteList[emoteName].id=== id;
    }

    static includes = (id) => {
        for(let [name, emote] of Object.entries(this.emoteList)){
            if(id===emote.id)
                return true;
        }
        return false;
    }

}

module.exports = Emote;