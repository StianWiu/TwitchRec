import { Command } from "commander";
const program = new Command();
const randomstring = require("randomstring");
const { exec } = require("child_process");
const { launch, getStream } = require("puppeteer-stream");
const fs = require("fs");

// Add options for command
const noUserSpecified = () => {
  console.log("Missing argument -u or --user");
  process.exit();
};
const noOsSpecified = () => {
  console.log("Missing argument -w or --windows");
  process.exit();
};

program.option("-u, --user <username>", "Twitch user to record [Required]");
program.option(
  "-w, --windows <true/false>",
  "Using windows true or false [Required]"
);
program.option("-f, --frames <number>", "How many fps to export to [Optinal]");
program.option(
  "-o, --output <true/false>",
  "Print ffmpeg to console? [Optinal]"
);

program.parse(process.argv);
const options = program.opts();

let windows = undefined;
let fps = undefined;
let output = undefined;
let rerunStream = undefined;

const checkConfiguration = () => {
  if (options.user) {
    if (options.windows == "true" || options.windows == "false") {
      if (options.windows == "true") {
        windows = true;
      } else {
        windows = false;
      }
      if (options.frames) {
        fps = options.frames;
      } else {
        fps = 24;
      }
      if (options.output) {
        if (options.output == "true") {
          output = true;
        }
        output = false;
      } else {
        output = true;
      }
    } else noOsSpecified();
  } else noUserSpecified();
};
checkConfiguration();

const filename = randomstring.generate({
  length: 10,
  charset: "hex",
});

async function startRecording() {
  let browser = undefined;
  if (windows == true) {
    browser = await launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe ",
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    });
  } else {
    browser = await launch({
      executablePath: "/usr/bin/google-chrome-stable",
      defaultViewport: {
        width: 1024,
        height: 768,
      },
    });
  }

  const page = await browser.newPage();
  await page.goto(`https://www.twitch.tv/${options.user}`);
  const originalUrl = page.url();

  const checkIfLive = async () => {
    if (
      (await page.$(
        `#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--watch-chat.channel-root--live.channel-root--watch.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP.channel-root__main--with-chat > div.channel-root__info.channel-root__info--with-chat > div > div.Layout-sc-nxg1ff-0.jLilpG > div > div > div > div.Layout-sc-nxg1ff-0.iMHulU > div > div > div > a > div.Layout-sc-nxg1ff-0.ScHaloIndicator-sc-1l14b0i-1.dKzslu.tw-halo__indicator > div > div > div`
      )) !== null
    )
      return true;
    else return false;
  };
  const checkIfRerun = async () => {
    if (
      (await page.$(
        `#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--watch-chat.channel-root--live.channel-root--watch.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP.channel-root__main--with-chat > div.channel-root__info.channel-root__info--with-chat > div > div.Layout-sc-nxg1ff-0.jLilpG > div > div > div > div.Layout-sc-nxg1ff-0.iMexhI > div.Layout-sc-nxg1ff-0.dglwHV > div.Layout-sc-nxg1ff-0.kBOtQI > div > div:nth-child(2) > div > div > div.Layout-sc-nxg1ff-0.ftYIWt > a > span`
      )) !== null
    )
      return true;
    else return false;
  };

  await new Promise((resolve) => setTimeout(resolve, 5000));

  while ((await checkIfLive()) == false) {
    console.log("Streamer is not live");
    await new Promise((resolve) => setTimeout(resolve, 60000));
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  }
  if ((await checkIfRerun()) == false) {
    console.log("This stream is a rerun \nContinuing to record anyways");
    rerunStream = true;
  } else {
    rerunStream = false;
  }

  await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  await page.keyboard.press("f");
  try {
    await Promise.all([
      await page.click(
        `#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.InjectLayout-sc-588ddc-0.persistent-player > div > div.Layout-sc-nxg1ff-0.video-player > div > div > div > div > div.Layout-sc-nxg1ff-0.krOuYh.player-overlay-background.player-overlay-background--darkness-0.content-overlay-gate > div > div.Layout-sc-nxg1ff-0.bzQnIQ.content-overlay-gate__allow-pointers > button`
      ),
    ]);
    console.log('Stream is agerestricted\nClicked "Start Watching" button');
  } catch (err) {
    console.log("Stream is not agerestricted");
  }

  const stream = await getStream(page, {
    audio: true,
    video: true,
    frameSize: 1000,
  });
  // this will pipe the stream to ffmpeg and convert the webm to mp4 format
  let ffmpeg = undefined;
  if (windows == true) {
    ffmpeg = exec(
      `ffmpeg.exe -async 1 -y -i - -r ${fps} videos/${options.user}-${filename}.mp4`
    );
  } else {
    ffmpeg = exec(
      `ffmpeg -async 1 -y -i - -r ${fps} videos/${options.user}-${filename}.mp4`
    );
  }
  // console logs output from ffmpeg
  if (output == true) {
    ffmpeg.stderr.on("data", (chunk) => {
      console.log(chunk.toString());
    });
  }

  stream.pipe(ffmpeg.stdin);

  while ((await checkIfLive()) == true) {
    if (originalUrl != page.url()) {
      console.log("Stopping recording because streamer raided someone else");
      break;
    }
    if ((await checkIfRerun()) == false && rerunStream == false) {
      console.log("Stream is a rerun");
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 15000));
  }

  await stream.destroy();
  stream.on("end", () => {});
  ffmpeg.stdin.setEncoding("utf8");
  ffmpeg.stdin.write("q");
  ffmpeg.stdin.end();
  ffmpeg.kill();

  console.log("finished");
  process.exit();
}

startRecording();
