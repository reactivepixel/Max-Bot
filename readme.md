# Max Bot
## The Official Bot of the Full Sail Armada

Interested in learning how to use Max? See the [Usage documentation here](usage.md).

# Installation

### Prerequisites
* [Git](https://git-scm.com/downloads)
* [Node JS](https://github.com/nvm-sh/nvm#installation-and-update)
* [MariaDB](https://mariadb.com/kb/en/library/installing-mariadb-on-macos-using-homebrew/)

### Clone the Codebase.

```
git clone git@github.com:reactivepixel/Max-Bot.git
```

### ENV Vars


Create an ```.env``` file with the following sensitive information. Replace the "xxx"'s with some unique information for your local Environment.

> ```!verify``` will not work unless you additionally configure *your own* Gmail account to work with this bot. The Official Max email info will not be distributed.

```
NODE_ENV=development
DEBUG_MODE=3

DISCORD_BOT_TOKEN=xxx_bot_token_from_next_step_xxx

MYSQL_ROOT_PASSWORD=xxx
MYSQL_USER=xxx
MYSQL_PASS=xxx
MYSQL_DATABASE=max
MYSQL_HOST=localhost

EMAIL_USERNAME=xxx
EMAIL_PASS=xxx
GOOGLE_APP_PASSWORD=xxx
```

> Update ```DISCORD_BOT_TOKEN``` with the token you receive from the next step.


### Bot Token

Add a new App and create a Bot User then obtain the [Discord App Bot Token](https://discordapp.com/developers/applications/me) from the created Bot User or contact a Release Manager for Max's Dev Bot token.


Update the ```DISCORD_BOT_TOKEN``` in the .env file with the token provided to you.

Run ``$ gulp pm2`` to create a max.config.js file within your root directory.

### Adding the Bot to a Server

As an authorized user of the bot you will need to add it to a server.

1. Go to the Discord developer pages (login if you haven't).
2. Go to the application with the bot you want to add to your channel.
3. Copy the Client/Application ID.
4. Go to https://discordapp.com/oauth2/authorize?client_id=```CLIENT_ID_GOES_HERE```&scope=bot&permissions=0
5. Select server and click authorize.

> [Source](https://stackoverflow.com/questions/37689289/joining-a-server-with-the-discord-python-api)

### Optional Configure Email Functionality
Max uses [Nodemailer](https://nodemailer.com/about/) to send verification emails to users joining the Armada server. to work proper locally please follow these steps to create a new gmail account to locally test with:

1. Create a new gmail.com account
2. Once logged in with this account enable [less secure application access](https://myaccount.google.com/u/1/lesssecureapps?pageId=none&pli=1).
3. fill in the ```EMAIL_USERNAME``` & ```EMAIL_PASS``` values on the ```.env``` file with this new gmail account's info.

# Running the Bot Locally

```
npm install
npm start
```

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
