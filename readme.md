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
docker-compose up
```

> Note: Any changes to the codebase will require you to close the Docker container and re 'up'.

If all went well, and your **DEBUG_MODE** is set properly (See the chart below) you will see a logged message of ```Bot Online and Ready!:```

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

# Container Information

## Node Container

[Official Node](https://hub.docker.com/_/node/) Container used. 

# Other Information

## [Change Log](changelog.md)
