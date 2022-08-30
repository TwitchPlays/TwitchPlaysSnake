const tmi = require('tmi.js');
var spawn = require('child_process').spawn;
var child = spawn(
    'python',
    ['snake.py']
);
var child_emit = function (message) {
    child.stdin.write(message + "\n");
}

require('dotenv').config()

// Define configuration options
const opts = {
    identity: {
        username: 'rob0hey',
        password: process.env.PASSWORD
    },
    channels: [
        'rob0hey'
    ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

var current_direction = "w"

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    commandName = msg.trim();
    console.log(commandName);

    if (commandName == "w" || commandName == "a" || commandName == "s" || commandName == "d") {
        console.log("new");
        current_direction = commandName;
    }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    startTimer();
}

function startTimer() {
    child_emit(current_direction);
    setTimeout(startTimer, 100);
}

child.stdout.on('data', function (_data) {

    try {
        var data = Buffer.from(_data, 'utf-8').toString();
        //console.log("DATA:", data);
    } catch (error) {
        console.error(error);
    }

});
child.stdout.on('exit', function (a) {
    console.log("EXIT:", a);
});
child.stdout.on('end', function (a) {
    console.log("END:", a);
});
child.on('error', function (error) {
    console.error(error);
});

child.stdout.pipe(process.stdout);