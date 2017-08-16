## Adding the Bot to a Server

As an authorized user of the bot you will need to add it to a server.

1. Go to the Discord developer pages (login if you haven't).
1. Go to the application with the bot you want to add to your channel.
1. Copy the Client/Application ID.
1. Go to https://discordapp.com/oauth2/authorize?client_id=CLIENT_ID_GOES_HERE&scope=bot&permissions=0 < You can set permissions for the bot here. Permissions can be calculated here.
1. Select server and click authorize.

> [Source](https://stackoverflow.com/questions/37689289/joining-a-server-with-the-discord-python-api)

# Debug Tool Documentation

## Example of Usage

Instead of console.log() require the tool.js file
and call the .debug() method passing in three arguments
(title, output, level)

[code] to call a debug()
[code] to activate debug_mode

### title: String

Should be a string that will prefix the output
argument in the resulting console.log()

### output: Object

Any object that will be suffixed onto the title
argument in the resulting console.log()

### level: Integer

A number that indicates how fine grained the output
of this particular output should be. Reference the **Debug Level Chart**

## Debug Level Chart

0. Production Environment Level Output
1. Staging Environment Level Output
2. General Debug Information for Development
3. Very Detailed and in-depth Output.
4. Highly Fine Grained Detailed and in-depth Output.
