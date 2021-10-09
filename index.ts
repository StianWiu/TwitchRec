// import { Command } from "commander";
// const program = new Command();
// const randomstring = require("randomstring");
// const fs = require("fs");

// program.option("-u, --user <username>", "Twitch user to record [Required]");
// program.parse(process.argv);
// const options = program.opts();

const { launch, getStream } = require("puppeteer-stream");
const fs = require("fs");
const { exec } = require("child_process");

async function test() {
  const browser = await launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe ",
    // executablePath: "/usr/bin/google-chrome-stable",
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  const page = await browser.newPage();
  await page.goto("https://www.twitch.tv/aboedmxtest");
  const stream = await getStream(page, {
    audio: true,
    video: true,
    frameSize: 1000,
  });
  console.log("recording");
  // this will pipe the stream to ffmpeg and convert the webm to mp4 format
  const ffmpeg = exec(`ffmpeg -y -r 25 -i - videos/output.mp4`);
  ffmpeg.stderr.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  stream.pipe(ffmpeg.stdin);

  setTimeout(async () => {
    await stream.destroy();
    stream.on("end", () => {});
    ffmpeg.stdin.setEncoding("utf8");
    ffmpeg.stdin.write("q");
    ffmpeg.stdin.end();
    ffmpeg.kill();

    console.log("finished");
  }, 30000);
}

test();
