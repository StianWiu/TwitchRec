# About

This is my side project Twitch-Recorder.

The way this program works is, it uses [puppeteer](https://github.com/puppeteer/puppeteer) to open a twitch stream checking if it is live and whether it is a rerun and more. Once it has gotten the required information and knows the specified user is live it will grab the twitch stream m3u8stream link. Using this link it will use [m3u8stream](https://www.npmjs.com/package/m3u8stream) to record that URL to a mp4 format.

This was made for windows and ubuntu so it has not been tested in any other operating system. Though it will most likely still work. Please see [Requirements](#requirements) section.

I made this program out of spite. There is a twitch streamer I like that only streams at 4am my time and their VOD's are sub only. So I just leave this program running on my server so I have the stream saved for later.

Feel free to take as much as you want from this project and use it on your own. No credit needed but much appreciated.

# Pros & cons

- **[PRO]** It works in a terminal so you can just throw it onto any server with node.js and an internet connection.
- **[CON]** Not the most straight forward way to do it but accomplishes it's goal. Very hacky code.
- **[PRO]** Quick and simple install. Requires 2 commands to get set up.

# Features

- Record only certain categories
- Record until certain file size has been reached
- Enable/Disable recording rerun streams
- Continue waiting for next stream after stream is done
- Automatically sorts recorded vods into folders based on streamer username

# Options

```
-u, --user <string> Twitch username [Required]
-r, --rerun <boolean> Record reruns [Optional] Default: True
-c, --category <string> Only record certain category [Optional]
-m, --max <num> How many GB file can become [Optional]
-l, --loop <boolean> Weather program should infinitely loop when stream is over [Optional] Default: False
-h, --help display help for command
```

## Example commands

```bash
$ node index.js -u <username>

$ node index.js -u <username> -r <true/false> -c <category> -m <num> -l <true/false>

$ node index.js --user <username> --rerun <true/false> --category <category> --max <num> --loop <true/false>
```

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

# Issues

If you are experiencing issues please open an issue on [GitHub](https://github.com/StianWiu/TwitchRec/issues) and I'll do my best to help you.

# Extra

In order to edit the code you will need to go into the [index.ts](https://github.com/Pignuuu/twitch-recorder/blob/main/index.ts) file and add your code there$.

Then to compile it into JavaScript

```bash
$ npm run compile
```
