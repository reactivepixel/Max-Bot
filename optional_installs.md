### Optional: Advanced Bot Configuration

Obtain a [Discord App Bot Token](https://discordapp.com/developers/applications/me) from your registered app (or register a new one) to proceed or contact a Release Manager for Max's Dev Bot token.

Click on the ```Add a Bot User``` to instantiate your app as a "bot".

Replace the ```{DiscordBotToken}``` within the ```max.config.js``` file with the token provided to you.

### Adding the Bot to a Server

As an authorized user of the bot you will need to add it to a server.

1. Go to the Discord developer pages (login if you haven't).
1. Go to the application with the bot you want to add to your channel.
1. Copy the Client/Application ID.
1. Go to https://discordapp.com/oauth2/authorize?client_id=```CLIENT_ID_GOES_HERE```&scope=bot&permissions=0
1. Select server and click authorize.

> [Source](https://stackoverflow.com/questions/37689289/joining-a-server-with-the-discord-python-api)
