# Hi!

This is my side project Twitch-Recorder.

What it does currently is it uses puppeteer to open a specified twitch stream and proceeds to record it until stream is over. You can set it to a stream that is offline and it will wait for said streamer to start streaming.

The project could be done way more effeciently but I really wanted to get this working using puppeteer so I had some creative limits. So if there are better alternatives you should use those instead, if not then feel free to use this one. If you have any suggestions please do submit a pull request and I will gladly look at it.

The biggest problem right now is that ffmpeg takes up a large portion of the cpu like a good 80% so if you have any idea how I could limit that please tell me. please... my cpu is screaming.

This is made for ubuntu but if you go in and uncomment some stuff you can make it work for windows. Make sure to have google chrome installed and ffmpeg installed.

if your google chrome isn't installed at the usual location you will have to change the direcotory in the code.

## Build Setup

``` bash
# clone repo
$ git clone https://github.com/Pignuuu/twitch-recorder/

# install dependencies
$ npm i

# install ffmpeg
$ sudo apt-get install ffmpeg

# start project with node
$ node index.js -l or --link <twitch url>

```
