# Max Bot
## The Official Bot of the Full Sail Armada

Interested in learning how to use Max? See the [Usage documentation here](usage.md).

# Installation

### Prerequisites
* [Git](https://git-scm.com/downloads
)
* [Docker (Stable)](https://docs.docker.com/docker-for-mac/install/)

### Clone the Codebase.

```
git clone git@github.com:reactivepixel/Max-Bot.git
```

### ENV Vars


Create an ```.env``` file with the following sensitive information. Replace the "xxx"'s with some unique information for your local Environment.

```
MYSQL_ROOT_PASSWORD=xxx
MYSQL_USER=xxx
MYSQL_PASS=xxx
MYSQL_DATABASE=max
DISCORD_BOT_TOKEN=xxx_bot_token_from_next_step_xxx
NODE_ENV=development
DB_PORT_HOST=3306
DB_PORT_GUEST=3306
BOT_PORT_HOST=80
BOT_PORT_GUEST=3000
BOT_PORT_HOST=80
BOT_PORT_GUEST=3000
EMAIL_USERNAME=xxx
EMAIL_PASS=xxx
```

> Update ```DiscordBotToken``` with the token you receive from the next step.




### Bot Token

Obtain a [Discord App Bot Token](https://discordapp.com/developers/applications/me) from your registered app (or register a new one) to proceed or contact a Release Manager for Max's Dev Bot token.

Replace the ```{DiscordBotToken}``` within the ```max.config.js``` file with the token provided to you.

### Adding the Bot to a Server

As an authorized user of the bot you will need to add it to a server.

1. Go to the Discord developer pages (login if you haven't).
1. Go to the application with the bot you want to add to your channel.
1. Copy the Client/Application ID.
1. Go to https://discordapp.com/aboutoauth2/authorize?client_id=```CLIENT_ID_GOES_HERE```&scope=bot&permissions=0
1. Select server and click authorize.

> [Source](https://stackoverflow.com/questions/37689289/joining-a-server-with-the-discord-python-api)

### Configure Email Functionality
Max uses [Nodemailer](https://nodemailer.com/about/) to send verification emails to users joining the Armada server. to work proper locally please follow these steps to create a new gmail account to locally test with:

1. Create a new gmail.com account
2. Once logged in with this account enable [less secure application access](https://myaccount.google.com/u/1/lesssecureapps?pageId=none&pli=1).
3. fill in the ```EMAIL_USERNAME``` & ```EMAIL_PASS``` values on the ```.env``` file with this new gmail account's info.


# Running the Bot

## Local

To run the bot locally ensure that you have followed the installation instructions above.

Use docker-compose to start the container with the bot client.

```
docker-compose up
```

If all went well, and your **DEBUG_MODE** is set properly you will see a logged message of ```Bot Online and Ready!:```

Hop onto your discord server and find a room with the bot and run the command ```!help``` to see a display of optional commands.

# Style Guide

The AirBnB javascript style guide has been put in place and will be enforced through active and passive linting.

Ensure your local IDE has the ability to add eslint plugins. [Atom](https://atom.io) is recommended.

> [Source](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb#eslint-config-airbnb-1)

### Atom Configuration

Install the linter-eslint package for Atom.

```
apm install linter-eslint
```


## Confirm Linting Works

Removing a semi-colon from any line of Javascript will trigger the linter to automatically flag the edited line.

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


# Modules & integrations

## Database
### How to connect using Sequel Pro

You can find more information about the config file `db/config/config.json`

![](https://preview.ibb.co/d07YOG/Screen_Shot_2017_11_10_at_2_49_46_PM.png)


# Container Information

## Node Container

[Official Node](https://hub.docker.com/_/node/) Container used.

# Other Information

## [Change Log](changelog.md)
