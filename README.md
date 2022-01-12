<p align='center'>
    <a href="https://github.com/StianWiu/TwitchRec/actions/workflows/node.js.yml">
        <img alt="Github test" src="https://github.com/StianWiu/TwitchRec/actions/workflows/node.js.yml/badge.svg">
    </a>
    <a href='https://www.npmjs.com/package/twitchrec'>
        <img src='https://img.shields.io/npm/v/twitchrec.svg' alt='Latest npm version'>
        <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/stianwiu/twitchrec">
        <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/stianwiu/twitchrec">
        <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/stianwiu/twitchrec">
        <img src='https://img.shields.io/npm/dm/twitchrec.svg' alt='Dependents'>
    </a>
</p>

# Install

```bash
$ npm i -g twitchrec
```

You can also install this without the -g but it will not be available globally.

# Options

| **Name**         | **Type**  | **Description**                      | **Input** | **Required** |
| ---------------- | --------- | ------------------------------------ | --------- | ------------ |
| `-h --help`      | `Extra`   | Display information about program.   |           | ☓            |
| `-u --user`      | `setting` | Specify what user to record          | `string ` | ✓            |
| `-r --rerun`     | `setting` | Enable or disable reruns             | `boolean` | ☓            |
| `-c --category`  | `setting` | Chose specific category to record.   | `string ` | ☓            |
| `-m --max`       | `setting` | Control how large file can become    | `number ` | ☓            |
| `-l --loop`      | `setting` | Automatically wait for next stream   | `boolean` | ☓            |
| `-d --directory` | `setting` | Chose what directory to save to      | `string ` | ☓            |
| `-q --quality`   | `setting` | What quality to record. 0 is highest | `num `    | ☓            |

# Example commands

```bash
$ twitchrec -u <username>

$ twitchrec -u <username> -r <true/false> -c <category> -m <num> -l <true/false> -d <path> -q <num>

$ twitchrec --user <username> --rerun <true/false> --category <category> --max <num> --loop <true/false> --directory <path> --quality <num>
```

# Issues

If you are experiencing issues please open an issue on [GitHub](https://github.com/StianWiu/TwitchRec/issues) and I'll do my best to help you.

# Features

- Record only certain categories
- Record until certain file size has been reached
- Enable/Disable recording rerun streams
- Continue waiting for next stream after stream is done
- Automatically sorts recorded vods into folders based on streamer username
- Choose what quality to record.

# How it's done

The program works by using [puppeteer](https://github.com/puppeteer/puppeteer) to open a twitch stream checking if it is live and whether it is a rerun and more. Once it has gotten the required information and knows the specified user is live it will grab the twitch stream m3u8stream link. Using this link it will use [m3u8stream](https://www.npmjs.com/package/m3u8stream) to record that URL to a mp4 format.

This was made for windows and ubuntu so it has not been tested in any other operating system. Though it will most likely still work. Please see [Requirements](#requirements) section.

Feel free to take as much as you want from this project and use it on your own.

# Requirements

- For both windows and Linux you need [Node.js](https://nodejs.org/) and [NPM](https://nodejs.org/) installed.

# Build Setup

```bash
# clone repo
$ git clone https://github.com/StianWiu/TwitchRec/

# install dependencies
$ npm i

# start project with node
$ node index.js --user pignuuuu

# To see all options run
$ node index.js --help
```

# Extra

In order to edit the code you will need to go into the [index.ts](https://github.com/Pignuuu/twitch-recorder/blob/main/index.ts) file and add your code there.

Then to compile it into JavaScript

```bash
$ npm run build
```
