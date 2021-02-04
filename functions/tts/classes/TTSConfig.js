class TTS_CONF {
    constructor() {
        this._lastMessage = [];
        this._autoDelete = false;
        this._isExclusive = false;
        this._bindId = null;
        this._exclusiveClock = null;
    }

    set lastMessage(msg){
        this._lastMessage = msg;
    }

    get lastMessage(){
        return this._lastMessage;
    }

    setLastMsg = msg => {
        this._lastMessage = msg;
    }

    set autoDelete(flag){
        this._autoDelete = flag;
    }

    get autoDelete(){
        return this._autoDelete;
    }

    setAutoDelete = flag => {
        this._autoDelete = flag;
    }

    set isExclusive(flag){
        this._isExclusive = flag;
    }

    get isExclusive(){
        return this._isExclusive;
    }

    setExclusive = flag => {
        this._isExclusive = flag;
    }

    set bindId(id){
        this._bindId = id;
    }

    get bindId(){
        return this._bindId;
    }

    setBindId = id => {
        this._bindId = id;
    }

    set exclusiveClock(clock){
        this._exclusiveClock = clock;
    }

    get exclusiveClock(){
        return this._exclusiveClock;
    }

    setExclusiveClock = clock => {
        this._exclusiveClock = clock;
    }
}

module.exports = TTS_CONF;