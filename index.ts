#!/usr/bin/env node
console.clear();
try {
  require("asciiart-logo");
  require("axios");
  require("bug-killer");
  require("commander");
  require("enquirer");
  require("m3u8stream");
  require("puppeteer");
  require("randomstring");
  require("timer-node");
  require("fs");
  require("twitch-m3u8");
} catch (error) {
  console.log(
    "\x1b[31m%s",
    "\n\nPlease install the required dependencies by running npm install. Exiting...\n\n"
  );

  process.exit(1);
}
const fs = require("fs"),
  puppeteer = require("puppeteer"),
  m3u8stream = require("m3u8stream"),
  randomstring = require("randomstring"),
  logo = require("asciiart-logo"),
  Logger = require("bug-killer"),
  m3u8Info = require("twitch-m3u8"),
  axios = require("axios"),
  { Confirm } = require("enquirer");

// Set configuration for Logger(bug-killer) node module
Logger.config = {
  // The error type
  error: {
    color: [192, 57, 43],
    text: "error",
    level: 1,
  },
  // The warning type
  warn: {
    color: [241, 196, 15],
    text: "warn ",
    level: 2,
  },
  // The info type
  info: {
    color: [52, 152, 219],
    text: "info ",
    level: 3,
  },
  action: {
    color: [88, 232, 95],
    text: "action ",
    level: 3,
  },
  // Display date
  date: false,
  // Log level
  level: 4,
  // Output stream
  stream: process.stdout,
  // The options passed to `util.inspect`
  inspectOptions: { colors: true },
};

import { Command } from "commander";
import { Timer } from "timer-node";
const program = new Command();

let user,
  rerunEnable,
  category,
  maxSize,
  link,
  loopProgram,
  directoryPath,
  selectedQuality,
  finalQuality,
  filename;

// Generate a random string for the file name
filename = randomstring.generate({
  length: 10,
  charset: "hex",
});

const timer = new Timer({ label: "main-timer" });
const recording_timer = new Timer({ label: "recording-timer" });
timer.start();

const printLogo = () => {
  console.log(
    logo({
      name: "TwitchRec",
      font: "Chunky",
      lineChars: 10,
      padding: 2,
      margin: 3,
    })
      .emptyLine()
      .emptyLine()
      .center(
        'Twitch recording software. Developed by Pignuuu. "--help" for options'
      )
      .center("https://stianwiu.me")
      .render()
  );
};

printLogo();
program.requiredOption("-u, --user <string>", "Twitch username");
program.option("-r, --rerun <boolean>", "Should the program record reruns");
program.option("-c, --category <string>", "Only record certain category");
program.option("-m, --max <num>", "How many GB file can become");
program.option(
  "-l, --loop <boolean>",
  "Weather program should infinitely loop when stream is over"
);
program.option("-y, --yes", "Skip settings confirmation");
program.option("-d, --directory <string>", "Where to save the files produced");
program.option(
  "-q, --quality <num>",
  "What quality to record at, 0 is highest"
);
program.option("-v, --vod <string>", "Download vod using vod id");

program.parse(process.argv);
const options = program.opts();

const checkConfiguration = async () => {
  user = options.user.toLowerCase();
  if (options.rerun == "false") {
    rerunEnable = false;
  } else {
    rerunEnable = true;
  }
  if (options.category) {
    category = options.category.toLowerCase();
  } else {
    category = "disabled";
  }
  if (options.max) {
    maxSize = Number(options.max) + "GB";
  } else {
    maxSize = "disabled";
  }
  if (options.quality) {
    selectedQuality = options.quality;
  } else {
    selectedQuality = 0;
  }
  if (options.loop == "true") {
    loopProgram = true;
  } else {
    loopProgram = false;
  }
  if (options.directory) {
    directoryPath = options.directory;
    if (directoryPath.substr(directoryPath.length - 1) != "/") {
      directoryPath = directoryPath + "/";
    }
    try {
      fs.accessSync(directoryPath, fs.constants.W_OK);
    } catch (err) {
      Logger.log(
        `Couldn't find or couldn't write to ${directoryPath}`,
        "error"
      );
      process.exit();
    }
  } else {
    directoryPath = "./";
  }
  if (options.vod) {
    let vodUrl;
    await m3u8Info
      .getVod(options.vod)
      .then((data) => {
        vodUrl = data[1].url;
      })
      .catch((err) => console.error(err));
    if (!(await fs.existsSync(`${directoryPath}videos/${user}`))) {
      await fs.mkdirSync(`${directoryPath}videos/${user}`);
    }
    const vod = await m3u8stream(vodUrl).pipe(
      fs.createWriteStream(
        `${directoryPath}videos/${user}/${user}-${filename}-vod.mp4`
      )
    );
    let recording = true;
    while (recording == true) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      vod.on("finish", () => {
        recording = false;
      });
      console.log(
        logo({
          name: "TwitchRec",
          font: "Chunky",
          lineChars: 10,
          padding: 2,
          margin: 3,
        })
          .emptyLine()
          .left(`Downloading for: ${timer.format("D:%d H:%h M:%m S:%s")}`)
          .emptyLine(``)
          .left(`Vod is being downloaded`)
          .emptyLine(`${console.clear()}`)
          .center("Twitch recording software. Developed by Pignuuu.")
          .center("https://stianwiu.me")
          .render()
      );
    }
    Logger.log("Vod download finished", "info");
    process.exit();
  }
  console.clear();
  if (!options.yes) {
    console.log(
      logo({
        name: "Settings",
        font: "Chunky",
        lineChars: 10,
        padding: 2,
        margin: 3,
      })
        .emptyLine()
        .center("Are these settings correct?")
        .emptyLine()
        .left(`Username: ${user}`)
        .left(`Reruns: ${rerunEnable}`)
        .left(`Category: ${category}`)
        .left(`Max size: ${maxSize}`)
        .left(`Loop: ${loopProgram}`)
        .left(`Directory: ${directoryPath}`)
        .left(`Quality: ${selectedQuality}`)
        .emptyLine()
        .center("You can skip this by adding -y or --yes to the command")
        .render()
    );

    const prompt = new Confirm({
      name: "question",
      message: "Are these settings correct?",
    });

    await prompt.run().then((answer) => {
      if (!answer) {
        Logger.log("Program stopped by user", "warn");
        process.exit();
      }
      console.clear();
      printLogo();
    });
  } else {
    console.clear();
    printLogo();
  }
};
const startProcess = async () => {
  await checkConfiguration();
  Logger.log("Loading please wait...", "info");
  const browser = await puppeteer.launch({
    // headless: false, // Uncomment this line to see the browser pop up
    args: ["--no-sandbox"],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });
  const page = await browser.newPage();
  await page.goto(`https://www.twitch.tv/${user}`);
  // Use puppeteer to check if user exists
  const checkIfUserExists = async () => {
    try {
      await page.waitForSelector(
        "#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div.Layout-sc-nxg1ff-0.bDMqsP.core-error__message-container > p",
        { timeout: 3000 }
      );
      return false;
    } catch (error) {
      return true;
    }
  };
  // Use puppeteer to check if specified user is streaming
  const checkIfUserIsLive = async () => {
    try {
      await page.waitForSelector(
        "#root > div > div.Layout-sc-nxg1ff-0.qViOJ > div.Layout-sc-nxg1ff-0.kXaHWh > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--watch-chat.channel-root--live.channel-root--watch.channel-root--unanimated > div.Layout-sc-nxg1ff-0.dzgehN.channel-root__main--with-chat > div.channel-root__info.channel-root__info--with-chat > div > div.Layout-sc-nxg1ff-0.bIubrA > div > div.Layout-sc-nxg1ff-0.kjqBUq > div > div.Layout-sc-nxg1ff-0.eofBxm > div > div > div > a > div.Layout-sc-nxg1ff-0.ScHaloIndicator-sc-1l14b0i-1.eTMKpM.tw-halo__indicator > div > div > div",
        { timeout: 3000 }
      );
      return true;
    } catch (error) {
      return false;
    }
  };

  // Use puppeteer to check if specified user is streaming a rerun
  const checkIfStreamIsRerun = async () => {
    try {
      await page.waitForSelector(
        "#root > div > div.Layout-sc-nxg1ff-0.qViOJ > div.Layout-sc-nxg1ff-0.kXaHWh > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--watch-chat.channel-root--live.channel-root--watch.channel-root--unanimated > div.Layout-sc-nxg1ff-0.dzgehN.channel-root__main--with-chat > div.channel-root__info.channel-root__info--with-chat > div > div.Layout-sc-nxg1ff-0.bIubrA > div > div.Layout-sc-nxg1ff-0.kqDEiC.metadata-layout__split-top",
        { timeout: 3000 }
      );
      console.log("rerun true");
      return true;
    } catch (error) {
      console.log("rerun false");
      return false;
    }
  };

  // Check if program is supposed to record a rerun, if not program will wait until stream is truly live
  const checkIfRecordRerun = async () => {
    if (rerunEnable == false && (await checkIfStreamIsRerun()) == true) {
      return false;
    } else {
      return true;
    }
  };
  // Use puppeteer to click "Chat" button to open actual stream in case streamer is offline. If this doesn't happen program won't work.
  const clickChatButton = async () => {
    try {
      await page.waitForSelector(
        "#root > div > div.Layout-sc-nxg1ff-0.qViOJ > div.Layout-sc-nxg1ff-0.kXaHWh > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--home.channel-root--unanimated > div.Layout-sc-nxg1ff-0.dzgehN > div.channel-root__info.channel-root__info--offline.channel-root__info--home > div > div.Layout-sc-nxg1ff-0.cJNGgb.home-header-sticky > div.Layout-sc-nxg1ff-0.bAswat > div > div > ul > li:nth-child(5) > a",
        { timeout: 3000 }
      );
      await page.click(
        "#root > div > div.Layout-sc-nxg1ff-0.qViOJ > div.Layout-sc-nxg1ff-0.kXaHWh > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--home.channel-root--unanimated > div.Layout-sc-nxg1ff-0.dzgehN > div.channel-root__info.channel-root__info--offline.channel-root__info--home > div > div.Layout-sc-nxg1ff-0.cJNGgb.home-header-sticky > div.Layout-sc-nxg1ff-0.bAswat > div > div > ul > li:nth-child(5) > a"
      );
      Logger.log("Clicked 'Chat' button", "action");
    } catch (err) {}
  };
  await clickChatButton();

  // Get current recording's file size in gigabytes
  const getFileSizeGb = async () => {
    var stats = fs.statSync(
      `${directoryPath}videos/${user}/${user}-${filename}.mp4`
    );
    var fileSizeInBytes = stats.size;
    var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    var fileSizeInGigabytes = fileSizeInMegabytes * 0.001;
    return fileSizeInGigabytes.toString().substring(0, 6);
  };

  // Check if category is same as specified by user
  const checkCategory = async () => {
    if (category == "disabled") {
      return true;
    }
    let value1;
    let value2;
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
        "#root > div > div.Layout-sc-nxg1ff-0.qViOJ > div.Layout-sc-nxg1ff-0.kXaHWh > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--watch-chat.channel-root--live.channel-root--watch.channel-root--unanimated > div.Layout-sc-nxg1ff-0.dzgehN.channel-root__main--with-chat > div.channel-root__info.channel-root__info--with-chat > div > div.Layout-sc-nxg1ff-0.bIubrA > div > div > div > div.Layout-sc-nxg1ff-0.bdWyTy > div.Layout-sc-nxg1ff-0.hMomhv > div.Layout-sc-nxg1ff-0.kNMtLK > div > div:nth-child(2) > div > div > div.Layout-sc-nxg1ff-0.kQDQFf > a > span"
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

  // Check if stream is live
  async function checkM3u8StreamUrl(url) {
    try {
      await axios.head(url);
      return true;
    } catch (err) {
      return false;
    }
  }

  //Print recording progress to console.
  const recordingProgress = async () => {
    console.log(
      logo({
        name: "TwitchRec",
        font: "Chunky",
        lineChars: 10,
        padding: 2,
        margin: 3,
      })
        .emptyLine()
        .left(`User: ${user}`)
        .emptyLine()
        .left(`File size: ${await getFileSizeGb()} GB`)
        .left(`Running for: ${timer.format("D:%d H:%h M:%m S:%s")}`)
        .left(`Recording: ${recording_timer.format("D:%d H:%h M:%m S:%s")}`)
        .left(`Rerun: ${await checkIfStreamIsRerun()}`)
        .left(`Quality: ${finalQuality}`)
        .emptyLine(`${console.clear()}`)
        .center("Twitch recording software. Developed by Pignuuu.")
        .center("https://stianwiu.me")
        .render()
    );
  };

  const startRecording = async () => {
    // Make sure ./videos folder exists. If not, create it.
    if (!(await fs.existsSync(`${directoryPath}videos`))) {
      await fs.mkdirSync(`${directoryPath}videos`);
    }

    Logger.log("Getting raw stream url", "info");
    await m3u8Info
      .getStream(user)
      .then((data) => {
        if (selectedQuality < data.length && selectedQuality >= 0) {
          link = data[selectedQuality].url;
          finalQuality = data[selectedQuality].quality;
          Logger.log(`Quality set to: ${finalQuality}`, "info");
        } else {
          Logger.error("You can't record at that quality", "error");
          process.exit();
        }
      })
      .catch((err) => console.error(err));

    Logger.log("Recording started", "action");
    recording_timer.start();
    if (!(await fs.existsSync(`${directoryPath}videos/${user}`))) {
      await fs.mkdirSync(`${directoryPath}videos/${user}`);
    }
    const stream = await m3u8stream(link).pipe(
      fs.createWriteStream(
        `${directoryPath}videos/${user}/${user}-${filename}.mp4`
      )
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await recordingProgress();
    let finishedRecording = false;
    while (
      (await checkM3u8StreamUrl(link)) == true &&
      finishedRecording == false
    ) {
      await recordingProgress();
      if ((await checkCategory()) == false) {
        stream.end();
        finishedRecording = true;
        Logger.log("Stream has changed category", "info");
      }
      if ((await getFileSizeGb()) > maxSize && maxSize != "disabled") {
        stream.end();
        finishedRecording = true;
        Logger.log("Max file size reached", "warn");
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  };

  (async () => {
    if (await checkIfUserExists()) {
      Logger.log("User exists", "info");
      if ((await checkIfUserIsLive()) == false) {
        Logger.log(
          `Recording will start when ${user} goes live or starts a rerun`,
          "info"
        );
      }
      while (loopProgram == true) {
        // Generate a random string for the file name
        filename = randomstring.generate({
          length: 10,
          charset: "hex",
        });
        while (
          (await checkIfUserIsLive()) == false ||
          (await checkIfRecordRerun()) == false ||
          (await checkCategory()) == false
        ) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        await startRecording();
        await printLogo();
        Logger.log(
          `Your file is ready. File: ./${user}/${user}-${filename}.mp4`,
          "info"
        );
        timer.stop();
        Logger.log(`Final file size: ${await getFileSizeGb()} GB`, "info");
        Logger.log(
          timer.format("Entire process took D:%d H:%h M:%m S:%s"),
          "info"
        );
        Logger.log(
          recording_timer.format("Recorded for D:%d H:%h M:%m S:%s\n"),
          "info"
        );
        Logger.log("Waiting for stream to start again", "info");
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        await clickChatButton();
      }
      if (loopProgram == false) {
        while (
          (await checkIfUserIsLive()) == false ||
          (await checkIfRecordRerun()) == false ||
          (await checkCategory()) == false
        ) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        await startRecording();
        await printLogo();
        Logger.log(
          `Your file is ready. File: ${directoryPath}${user}/${user}-${filename}.mp4`,
          "info"
        );
        timer.stop();
        Logger.log(`Final file size: ${await getFileSizeGb()} GB`, "info");
        Logger.log(
          timer.format("Entire process took D:%d H:%h M:%m S:%s"),
          "info"
        );
        Logger.log(
          recording_timer.format("Recorded for D:%d H:%h M:%m S:%s"),
          "info"
        );
      }
      process.exit();
    } else {
      Logger.log("User does not exist", "error");
      process.exit();
    }
  })();
};

startProcess();
