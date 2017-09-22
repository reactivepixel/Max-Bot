# Local Installation

## Prerequisites

* [Git](https://git-scm.com/downloads
)
* [Docker (Stable)](https://docs.docker.com/docker-for-mac/install/)

## Clone the Codebase.

```
git clone git@github.com:reactivepixel/Max-Bot.git
```

## Discord Bot Connection

If working on the official team, contact your Release Manager for the Dev Bot Token and plug that into the file ```max.config.js```.

Otherwise if you are setting up your own Discord Bot follow the [Bot Token](./optional_installs.md/#optional-advanced-bot-configuration) directions:


# Running the Bot

## Local

To run the bot locally ensure that you have followed the installation instructions above.

Use docker-compose to start the container with the bot client.

```
docker-compose up --build
```

To Stop the bot run the command:

```
docker-compose stop
```

> Note: Any changes to the codebase will require you to close the Docker container and re 'up'.

If all went well, and your **DEBUG_MODE** is set properly (See the chart below) you will see a logged message of ```Bot Online and Ready!:```

Hop onto your discord server and find a room with the bot and run the command ```!help``` to see a display of optional commands.

# Style Guide

The AirBnB javascript style guide has been put in place and will be enforced through active and passive linting.

Ensure your local IDE has the ability to add eslint plugins. [Atom](https://atom.io) is recommended.

Locally install the style guide dependancies for Atom's IDE

```
npm install
```

> [Source](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb#eslint-config-airbnb-1)

### Atom Configuration

Install the linter-eslint package for Atom.

```
npm install linter-eslint
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

# Container Information

## Node Container

[Official Node](https://hub.docker.com/_/node/) Container used.

# Other Information

## Server routes

There are three routes that can be hit when a email is sent. The email is sent and the link that is in that email is a url with the route `/welcome:code` on the end. The `:code` is the UUID code that was sent to the user. When the email is sent and the UUID code isn't in the database the `/success` page will be hit because the user was verified. If the UUID code is in the database the user will be redirected to the `/error` page.

```
/welcome/:code 
/error
/success

```
### Test
To test this you can follow the commands below:

```
git fetch origin
git checkout web

npm i

docker-compose down -v && docker-compose up --build
```


## Send gmail through Node.js 

### Before beginning
You must have experience in Node.js. You will install the dependency Nodemailer. This package is great because it has no dependencies other than Node itself. Theoretically, this package will work for more than gmail.

> **Note:** We will create two objects: transporter and mailoptions: name, html, etc... 

We will then call the sendmail method of the transporter and pass the mailoptions as an argument to the function.

### Step 1

Install the nodemailer dependency into your node server. 

```
npm install nodemailer -S
```

### Step 2

Add your account credentials as variables to your environment config. They should look like this.

```
ACCOUNT_USERNAME: 'XXXXXXX@gmail.com'
ACCOUNT_PASSWORD: 'XXXXXXX'
```

### Step 3

Add the nodemailer.js file to your project. Copy the attached gist below.

[Download this Nodemailer Gist](https://gist.github.com/jonathandavidpollock/b8e73974e79f2e3be314ec9f3a3775ef)

### Step 4

Edit the mailoptions variable to your liking. This variable is the email to be sent to the user. There are more options than needed on nodemailer if needed. For example, you can specify the watchText option which is the text that displays on the watch.

## [Change Log](changelog.md)
