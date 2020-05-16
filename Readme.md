# CheClean ![](https://cdn1.savepice.ru/uploads/2020/4/29/12359aaeeca0908fe7afd91c61b4478c-full.png)

## The goal of this project is to make Cherkasy cleaner and better. The bot helps deliver garbage places location to cleaner utilities.

When you send the `/create` command, the bot asks you to give a description, photo, and location of the garbage place that you found. After all these steps, it will gather all the data collected and send it to our database, where the administrator of the utility company will manage all cases and send them to the companies for cleaning.

## Table of Contents

1.  [User guide](#user-guide)
    1.  [Bot commands](#bot-commands)
    2.  [Creating a case](#creating-a-case)
2.  [Quick start](#quick-start)
    1.  [Requirements](#requirements)
    2.  [Installation](#installation)
    3.  [Run](#run)
    4.  [Docker](#docker)
3.  [Credits](#credits)

## User guide

### Bot commands:
* `/create` - start creating case.
* `/help` - user help.
* `/cancel` - stop creating case and quit.
* `/contacts` - developers contacts.

### Creating a case
* Go to Telegram and find bot called `@CheClean_bot`.
* Use the _`/create`_ command to starting creating a case.
* Write your description. For example: _I see trash_.
* Upload a photo which shows what happened.
* Upload your location so we can see the incident location.
* Bot will send you a case preview where you can accept or decline the case. If you accept, bot will create it.

## Quick start

### Requirements
* [node v13](https://nodejs.org/dist/v13.12.0/)
* [redis-server](https://redis.io/download)

### Installation
```shell
> npm install
```

### Run
```shell
> npm start
```
### Docker
You may use this app only with [docker](https://www.docker.com/). 

You can use this command for the first launch or on CI.
```shell
> npm run docker:init
```

After previous step you can use the following command for local development.
```shell
> npm run docker
```

## Credits
Made by Master of Code students

1. https://github.com/jaxin007 - Bot developer
2. https://github.com/Lexander1108 - BackEnd developer
3. https://github.com/schikk - FrontEnd developer
4. https://github.com/KolyaStelmax - DevOps

Special thanks to Master of Code for the mentoring and helping. 2020(c)
