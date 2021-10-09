# About

This is my side project Twitch-Recorder.

What it does currently is it uses puppeteer to open a specified twitch stream and proceeds to record it until stream is over. You can set it to a stream that is offline and it will wait for said streamer to start streaming.

The project could be done way more effeciently but I really wanted to get this working using puppeteer so I had some creative limits. So if there are better alternatives you should use those instead, if not then feel free to use this one. If you have any suggestions please do submit a pull request and I will gladly look at it.

This is made for ubuntu primeraly but if you do -w true or --windows true it will work. Make sure to have google chrome installed.

if your google chrome isn't installed at the usual location you will have to change the directory in the code.

## Build Setup

```bash
# clone repo
$ git clone https://github.com/Pignuuu/twitch-recorder/

# install dependencies
$ npm i

# install ffmpeg. Only for linux, there is a ffmpeg exe included in the repository. Gotten from www.ffmpeg.org/
$ sudo apt-get install ffmpeg

# start project with node
$ node index.js --user pignuuuu --windows false --frames 32 --output false

# --user or -u is what twitch stream to record --windows or -w is if you are using windows --frames or -f is how many frames ffmpeg will render --output or -o is wether ffmpeg should output to console

```

# Extra

```bash
$ node index.js -h # View all specifications available
```

In order to edit the code you will need to go into the [index.ts](https://github.com/Pignuuu/twitch-recorder/blob/main/index.ts) file and code there.

Then to compile it into javascript run

```bash
$ npm run tsc
```
