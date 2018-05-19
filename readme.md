# Max Bot

## The Official Bot of the Full Sail Armada

Interested in learning how to use Max? See the [Usage documentation here](usage.md).

### Table of Contents

- [Installation](#installation)
- [Running the Bot](#running-the-bot)
- [Style Guide](#style-guide)
- [Debug Tool Documentation](#debug-tool-documentation)
- [Modules & Integrations](#modules--integrations)
- [Container Information](#container-information)
- [Other Information](#other-information)

# Installation

### Prerequisites
* [Git](https://git-scm.com/downloads)
* [Docker (Stable)](https://docs.docker.com/docker-for-mac/install/)
* [Discord Account](https://discordapp.com/register)

### Clone the Codebase.

```
git clone git@github.com:reactivepixel/Max-Bot.git
```

### ENV Vars


Create an ```.env``` file in the root directory with the following sensitive information. Replace the "xxx"'s with some unique information for your local Environment.

```shell
NODE_ENV=development
DEBUG_MODE=3
LANGUAGE=en

MYSQL_ROOT_PASSWORD=xxx
MYSQL_USER=xxx
MYSQL_PASS=xxx
MYSQL_DATABASE=max
MYSQL_HOST=mysql
DB_PORT_HOST=3306
DB_PORT_GUEST=3306

DISCORD_BOT_TOKEN=xxx_BOT_TOKEN_xxx

BOT_PORT_HOST=80
BOT_PORT_GUEST=3000

EMAIL_USERNAME=xxx
EMAIL_PASS=xxx
LANGUAGE=en
```

> Update ```DISCORD_BOT_TOKEN``` with the token you receive from the next step.

> Make sure ```LANGUAGE``` is set to ```en``` and is lowercase.

=======
### Setup Discord Server & Bot

1. Go to the Discord Client and create a new Discord Server. Need Help Follow this [Guide](https://support.discordapp.com/hc/en-us/articles/204849977-How-do-I-create-a-server-).
2. Go to the [Discord Developer Page](https://discordapp.com/developers) and create a new App.
3. Go to the App Review Page and Create a Bot User.
4. Update the ```DISCORD_BOT_TOKEN``` in the .env file with the App Bot User Token provided to you.

### Adding the Bot to a Server

As an authorized user of the bot you will need to add it to a server.

1. Go to the [Discord Developer Page](https://discordapp.com/developers).

1. Go to the App Review Page of the App with the Bot you want to add to your channel

1. Copy the Client ID under App Details.

1. Add your Client ID to the following URL and Acces the page.

    https://discordapp.com/oauth2/authorize?client_id=CLIENT_ID_HERE&scope=bot&permissions=0

1. Select the Server you would like the Bot to join and Authorize the action.

> [Source](https://stackoverflow.com/questions/37689289/joining-a-server-with-the-discord-python-api)

### Configure Email Functionality
Max uses [Nodemailer](https://nodemailer.com/about/) to send verification emails to users joining the Armada server. to work proper locally please follow these steps to create a new gmail account to locally test with:

1. Create a new [Google Account](https://accounts.google.com)
2. Enable [less secure application access](https://myaccount.google.com/u/1/lesssecureapps?pageId=none&pli=1) on your new Google Account.
3. Fill in the ```EMAIL_USERNAME``` & ```EMAIL_PASS``` values on the ```.env``` file with this new gmail account's info.

### Build

Install all the necessary dev dependencies 

```
npm install
```

Ensure that you have followed the installation instructions above and have docker running

```
docker-compose up --build
```


# Running the Bot

## Local

When running the bot locally ensure that you have followed the installation instructions above and have docker running.

Use Docker Copose to start and stop the container with the bot client.

```
docker-compose down && docker-compose up --build
```

> `docker-compose down` stops the container while `docker-compose up` starts the container



If all went well, and your **DEBUG_MODE** is set properly you will see a logged message of ```Bot Online and Ready!:```

Hop onto your discord server and find a room with the bot and run the command ```!help``` to see a display of optional commands.

# Style Guide

The [AirBnB JavaScript Style Guide](https://github.com/airbnb/javascript) has been put in place and will be enforced through active and passive linting.

## IDE Configuration

#### Visual Studio Code

Install the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) Package for Visual Studio Code

#### Atom

Install the [linter-eslint](https://atom.io/packages/linter-eslint) package for Atom.

```
apm install linter-eslint
```

#### Sublime Text

Install the [SublimeLinter](https://packagecontrol.io/packages/SublimeLinter) Package for Sublime Text with [Package Control](https://packagecontrol.io/installation)


### Confirm Linting Works

Removing a semi-colon from any line of Javascript will trigger the linter to automatically flag the edited line.

> [Source](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb#eslint-config-airbnb-1)

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


# Modules & Integrations

## Database
### How to connect using Sequel Pro

You can find more information about the config file `db/config/config.json`

![](https://preview.ibb.co/d07YOG/Screen_Shot_2017_11_10_at_2_49_46_PM.png)


# Container Information

## Node Container

[Officical Node](https://hub.docker.com/_/node/) Container used.

# Other Information

## [Change Log](changelog.md)
