console.clear();
const logo = require("asciiart-logo");
const printLogo = () => {
  console.log(
    logo({
      name: "Pignuuu",
      font: "Chunky",
      lineChars: 10,
      padding: 2,
      margin: 3,
    })
      .emptyLine()
      .right("V1.5.0")
      .emptyLine()
      .center(
        'Twitch recording software. Developed by Pignuuu. "--help" for options'
      )
      .render()
  );
};
printLogo();

import { Command } from "commander";
import { Timer } from "timer-node";
const program = new Command();
const randomstring = require("randomstring");
var nrc = require("node-run-cmd");
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
const noRecordingSelected = () => {
  console.log("Both audio and video can't be disabled");
  process.exit();
};

program.option("-u, --user <string>", "Twitch user to record [Required]");
program.option(
  "-w, --windows <boolean>",
  "Using windows true or false [Required]"
);
program.option("-f, --frames <num>", "How many fps to export to [Optinal]");
program.option(
  "-t, --threads <num>",
  "How many threads to use when encoding [Optinal]"
);
program.option("-r, --rerun <boolean>", "Record reruns [Optinal]");
program.option("-d, --delete <boolean>", "Delete temp file [Optinal]");
program.option(
  "-l, --loop <boolean>",
  "Automatically wait for next stream [Optinal]"
);
program.option("-a, --audio <boolean>", "Record audio [Optinal]");
program.option("-v, --video <boolean>", "Record video [Optinal]");
program.option(
  "-c, --category <string>",
  "Only record certain category [Optinal]"
);

program.parse(process.argv);
const options = program.opts();

let windows = undefined;
let fps = undefined;
let threads = undefined;
let rerunStream = undefined;
let rerunEnable = undefined;
let tempDelete = undefined;
let loopRecording = undefined;
let recordAudio = undefined;
let recordVideo = undefined;
let fileExtenstion = ".mp4";
let category = undefined;

const getTime = () => {
  let date_ob = new Date();

  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();
  console.log(
    year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds
  );
};

const checkConfiguration = () => {
  if (options.user) {
    if (options.windows == "true" || options.windows == "false") {
      if (options.windows == "true") {
        windows = true;
      } else {
        windows = false;
      }
      if (options.rerun == "false") {
        rerunEnable = false;
      } else {
        rerunEnable = true;
      }
      if (options.delete == "false") {
        tempDelete = false;
      } else {
        tempDelete = true;
      }
      if (options.loop == "true") {
        loopRecording = true;
      } else {
        loopRecording = false;
      }
      if (options.category) {
        category = options.category.toLowerCase();
      }
      if (options.audio == options.video && options.audio == "false") {
        noRecordingSelected();
      } else {
        if (options.audio == "false") {
          recordAudio = false;
        } else {
          recordAudio = true;
        }
        if (options.video == "false") {
          recordVideo = false;
          fileExtenstion = ".mp3";
        } else {
          recordVideo = true;
        }
      }
      if (options.frames) {
        fps = options.frames;
      } else {
        fps = 24;
      }
      if (options.threads) {
        threads = options.threads;
      } else {
        threads = 1;
      }
    } else noOsSpecified();
  } else noUserSpecified();
};

checkConfiguration();

async function startRecording() {
  console.log(`Twitch Streamer: ${options.user}`);
  console.log(`Using windows: ${windows}`);
  console.log(`Frames Per Second: ${fps}`);
  console.log(`Threads: ${threads}`);
  console.log(`Record reruns: ${rerunEnable}`);
  console.log(`Delete temp file : ${tempDelete}`);
  console.log(`Wait for next stream: ${loopRecording}`);
  console.log(`Record audio: ${recordAudio}`);
  console.log(`Record Video: ${recordVideo}\n`);

  const filename = randomstring.generate({
    length: 10,
    charset: "hex",
  });
  const timer = new Timer({ label: "main-timer" });
  const recording_timer = new Timer({ label: "recording-timer" });
  timer.start();
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
  console.log("Opening browser.");
  const page = await browser.newPage();
  console.log("Opening twitch stream");
  await page.goto(`https://www.twitch.tv/${options.user}`);
  const originalUrl = page.url();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const checkIfCorrect = async () => {
    try {
      await Promise.all([
        await page.click(
          "#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--hold-chat.channel-root--live.channel-root--home.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP > div.channel-root__info.channel-root__info--home > div > div.Layout-sc-nxg1ff-0.bPMozh.home-header-sticky > div.Layout-sc-nxg1ff-0.Bza-dv > div > div > ul > li:nth-child(5) > a > div > div.ScTextWrapper-sc-18v7095-1.eFGtCR"
        ),
      ]);
      console.log('Clicked "Chat" button');
    } catch (err) {}
  };
  await checkIfCorrect();

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
      return false;
    else return true;
  };

  console.log("Waiting for page to load");
  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log("Checking if streamer is live");
  if ((await checkIfLive()) == false) {
    console.log("Streamer is not live");
  }

  const checkContinueWithRerun = async () => {
    if (rerunEnable == false && (await checkIfRerun()) == true) {
      return false;
    } else {
      return true;
    }
  };

  const checkCategory = async () => {
    let value1 = undefined;
    let value2 = undefined;
    try {
      let element1 = await page.$(
        "#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--watch-chat.channel-root--live.channel-root--watch.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP.channel-root__main--with-chat > div.channel-root__info.channel-root__info--with-chat > div > div.Layout-sc-nxg1ff-0.jLilpG > div > div > div > div.Layout-sc-nxg1ff-0.iMexhI > div.Layout-sc-nxg1ff-0.dglwHV > div.Layout-sc-nxg1ff-0.kBOtQI > div > div:nth-child(2) > div > div > div.Layout-sc-nxg1ff-0.ftYIWt > a > span"
      );
      value1 = await page.evaluate((el) => el.textContent, element1);
      value1 = value1.toLowerCase();
    } catch (err) {}
    if (value1 == category) {
      return true;
    }
    try {
      let element2 = await page.$(
        "#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--watch-chat.channel-root--live.channel-root--watch.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP.channel-root__main--with-chat > div.channel-root__info.channel-root__info--with-chat > div > div.Layout-sc-nxg1ff-0.jLilpG > div > div.Layout-sc-nxg1ff-0.hMFNaU.metadata-layout__split-top > div.Layout-sc-nxg1ff-0 > div > div > div > div > div > a > span"
      );
      value2 = await page.evaluate((el) => el.textContent, element2);
      value2 = value2.toLowerCase();
    } catch (err) {}
    if (value2 == category) {
      return true;
    } else {
      return false;
    }
  };

  while (
    (await checkIfLive()) == false ||
    (await checkContinueWithRerun()) == false ||
    (await checkCategory()) == false
  ) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    await checkIfCorrect();
  }
  console.log("Checking if stream is a rerun");
  if ((await checkIfRerun()) == true) {
    console.log("This stream is a rerun");
    rerunStream = true;
  } else {
    rerunStream = false;
  }

  console.log("Reloading webpage");
  await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  console.log("Fullscreening stream");
  await page.keyboard.press("f");
  console.log("Checking if stream is agerestricted");
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
  const file = fs.createWriteStream(
    `./videos/${options.user}-${filename}.webm`
  );
  const stream = await getStream(page, {
    audio: recordAudio,
    video: recordVideo,
  });
  recording_timer.start();
  console.log("Now recording");
  getTime();
  console.log(
    "Recording will stop when:\nStreamer goes offline / Streamer raids different stream / Streamer starts a rerun"
  );

  stream.pipe(file);

  while ((await checkIfLive()) == true) {
    if (originalUrl != page.url()) {
      console.log("Stopping recording because streamer raided someone else");
      break;
    }
    if ((await checkIfRerun()) == true && rerunStream == false) {
      console.log("Stream is a rerun");
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 15000));
  }

  await stream.destroy();
  stream.on("end", () => {});
  recording_timer.stop();
  console.log("Closing browser");
  await browser.close();
  await new Promise((resolve) => setTimeout(resolve, 2500));
  console.log(
    `FFmpeg encoding starting now.\nFps set to ${fps}\nEncoding using ${threads} threads\n`
  );
  if (windows == true) {
    await nrc.run(
      `ffmpeg.exe -i videos/${options.user}-${filename}.webm -threads ${threads} -r ${fps} -c:v libx264 -crf 20 -preset fast videos/${options.user}-${filename}${fileExtenstion}`
    );
  } else {
    await nrc.run(
      `ffmpeg -i videos/${options.user}-${filename}.webm -threads ${threads} -r ${fps} -c:v libx264 -crf 20 -preset fast videos/${options.user}-${filename}${fileExtenstion}`
    );
  }
  if (tempDelete == true) {
    console.log("Encoding has finished.\nDeleting temporary stream file.");
    await fs.unlinkSync(`./videos/${options.user}-${filename}.webm`);
  }
  await new Promise((resolve) => setTimeout(resolve, 2500));
  console.clear();
  await printLogo();
  console.log(
    `\n\nYour file is ready. File:${options.user}-${filename}.mp4\n `
  );
  timer.stop();
  console.log(timer.format("Entire process took D:%d H:%h M:%m S:%s"));
  console.log(recording_timer.format("Recorded for D:%d H:%h M:%m S:%s"));
  if (loopRecording == false) {
    process.exit();
  }
}

const checkIfLoop = async () => {
  if (loopRecording == true) {
    await startRecording();
    await new Promise((resolve) => setTimeout(resolve, 7000));
    return checkIfLoop();
  } else {
    startRecording();
    return;
  }
};
checkIfLoop();
