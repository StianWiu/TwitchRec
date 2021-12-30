# Install

```bash
$ npm i -g twitchrec
```

You can also install this without the -g but it will not be available globally.

# Options

```bash
-h, --help # Display help for command

-u, --user <string> # Twitch username [Required]
-r, --rerun <boolean> # Record reruns
-c, --category <string> # Only record certain category
-m, --max <num> # How many GB file can become
-l, --loop <boolean> # Weather program should infinitely loop when stream is over
```

# Example commands

```bash
$ twitchrec -u <username>

$ twitchrec -u <username> -r <true/false> -c <category> -m <num> -l <true/false>

$ twitchrec --user <username> --rerun <true/false> --category <category> --max <num> --loop <true/false>
```

# Issues

If you are experiencing issues please open an issue on [GitHub](https://github.com/StianWiu/TwitchRec/issues) and I'll do my best to help you.

# Features

- Record only certain categories
- Record until certain file size has been reached
- Enable/Disable recording rerun streams
- Continue waiting for next stream after stream is done
- Automatically sorts recorded vods into folders based on streamer username

# How it's done

The program works by using [puppeteer](https://github.com/puppeteer/puppeteer) to open a twitch stream checking if it is live and whether it is a rerun and more. Once it has gotten the required information and knows the specified user is live it will grab the twitch stream m3u8stream link. Using this link it will use [m3u8stream](https://www.npmjs.com/package/m3u8stream) to record that URL to a mp4 format.

This was made for windows and ubuntu so it has not been tested in any other operating system. Though it will most likely still work. Please see [Requirements](#requirements) section.

Feel free to take as much as you want from this project and use it on your own. No credit needed but much appreciated.

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
$ npm run compile
```
