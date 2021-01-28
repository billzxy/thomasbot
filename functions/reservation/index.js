const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers');

let resList = [];

const executeCommand = (args, sendMessage) => {
    const parser = yargs()
        .scriptName("")
        .usage("Usage: thomas reserve <command> [options]")
        .command({ 
            command: "make [options]",
            desc: ' - Make a gaming reservation/invitation',
            builder: (yargs) => {
                return yargs.option('time', {
                    alias: 't',
                    describe: " - Set the desired start time"
                }).option('game', {
                    alias: 'g',
                    describe: " - The game you wish to play"
                });
            }
        })
        .command({ 
            command: "<ls|list> [options]",
            aliases: ["list", "ls"],
            desc: ' - List all current reservations',
            builder: (yargs) => {
                return yargs.option('all', {
                    alias: 'a',
                    describe: " - List all reservations"
                });
            }
        })
        .example("thomas reserve make -h")
        .example("thomas reserve ls/list -h")
        .version(false)
        .help('h')
        .alias('h', 'help')
        .locale('en');
        // .completion('completion', function(current){
        //     console.log(current);
        // });
    
    parser.parse(hideBin(args), function (err, argv, output) {
        if (err) {console.error(err);}
        if (output)
            sendMessage(output)
        else{
            console.log(argv);
            switch(argv._[0]){
                case "make":
                    executeMake(argv, sendMessage);
                    break;
                case "list":
                    executeList(argv, sendMessage);
                    break;
            }
        }
    })
    //console.log(argv);
}

const executeMake = (argv, sendMessage) => {
    const game = argv.game, time = argv.time;
    resList.push(game+":"+time);
    sendMessage("Done!");
}

const executeList = (argv, sendMessage) => {
    if(argv.all==="true"){
        console.log("-a");
        sendMessage(prettyPrint(resList));
    }
}

const prettyPrint = list => {
    let stri = "";
    for(let res of list){
        stri += res+"\n";
    }
    return stri;
}

module.exports = (args, sendMessage) => { executeCommand(args, sendMessage); }