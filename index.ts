import { Command } from "commander";
import { launch, getStream } from "puppeteer-stream";
const program = new Command();
const puppeteer = require("puppeteer");
const randomstring = require("randomstring");
const fs = require("fs");
const { exec } = require("child_process");

let stopWhileLoop = false;
var rerunStream = undefined;
var windows = undefined;
var fps = undefined;
var output = undefined;
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

const checkConfiguration = async () => {
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

// make sure provided link actually opens
const checkIfUrlIsValid = async () => {
  await checkConfiguration();
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(`https://twitch.tv/${options.user}`, {
      waitUntil: "load",
      timeout: 0,
    });
    console.log("Username is valid");
    startRecording();
  } catch (e: any) {
    console.log("Username could not be resloved.");
    process.exit();
  }
};

// generate random hex string to use for filename
const filename = randomstring.generate({
  length: 10,
  charset: "hex",
});

const startRecording = async () => {
  var browser = undefined;
  if (windows == true) {
    browser = await launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe ",
      // change to appropriate resolution
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      args: ["--start-maximized"],
    });
  } else {
    browser = await launch({
      executablePath: "/usr/bin/google-chrome-stable",
      // change to appropriate resolution
      defaultViewport: {
        width: 1024,
        height: 768,
      },
      args: ["--start-maximized"],
    });
  }
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
  // returns true or false if current opened stream is live or not. Reruns count as being live

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(`https://twitch.tv/${options.user}`);
  const originalUrl = page.url();

  const record = async () => {
    const file = fs.createWriteStream(
      __dirname + `/videos/${options.user}-${filename}-stream.mp4`
    );
    console.log(`Created file ${options.user}-${filename}-stream.mp4`);
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    await page.keyboard.press("f");
    try {
      await Promise.all([
        await page.click(
          `#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.InjectLayout-sc-588ddc-0.persistent-player > div > div.Layout-sc-nxg1ff-0.video-player > div > div > div > div > div.Layout-sc-nxg1ff-0.krOuYh.player-overlay-background.player-overlay-background--darkness-0.content-overlay-gate > div > div.Layout-sc-nxg1ff-0.bzQnIQ.content-overlay-gate__allow-pointers > button`
        ),
      ]);
      console.log("Stream is agerestricted");
      console.log(`Clicked "Start Watching" button`);
    } catch (err) {
      console.log("Stream is not agerestricted");
    }

    const stream = await getStream(page, { audio: true, video: true });
    console.log("Starting to record");

    var ffmpeg = undefined;
    // -r specifies what the wanted fps is
    if (windows == true) {
      ffmpeg = exec(
        `ffmpeg.exe -y -re -i - -r ${fps} ./videos/${options.user}-${filename}-export.mp4 -threads 1`,
        console.log(`Render fps set to ${fps}`)
      );
    } else {
      ffmpeg = exec(
        `ffmpeg -y -re -i - -r ${fps} ./videos/${options.user}-${filename}-export.mp4 -threads 1`,
        console.log(`Render fps set to ${fps}`)
      );
    }

    var progress = undefined;
    // outputs rendering data
    console.log(
      `Starting to render live video to ${options.user}-${filename}-export.mp4 \n\nPress enter in console to finish recording or wait until stream is over`
    );
    if (output == true) {
      ffmpeg.stderr
        .on("data", (chunk) => {
          console.log(chunk.toString());
          progress = chunk;
        })
        .on("error", function (err, stdout, stderr) {
          console.log("ffmpeg stdout:\n" + stdout);
          console.log("ffmpeg stderr:\n" + stderr);
        });
    }
    stream.pipe(ffmpeg.stdin);
    rl.question("", function (stringFromConsole) {
      if (stringFromConsole == "") {
        stopWhileLoop = true;
      }
      rl.close();
    });

    // wait until stream is over or enter is pressed in terminal
    while ((await checkIfLive()) == true) {
      if (stopWhileLoop) {
        break;
      }
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

    console.log(stream);
    console.log("#");
    console.log(stream.pipe);
    console.log("#");
    console.log(stream.pipe(file));

    stream.pipe(file);
    await stream.destroy();
    file.close();
    console.log("Recording finished");
    console.log("Waiting for render to finish");
    var test1 = 0;
    var test2 = 1;
    const pages = await browser.pages();
    await Promise.all(pages.map((page) => page.close()));
    await browser.close();
    // checks if the rendering data has changed. If it hasn't changed withing 5 seconds it will stop rendering and close file
    while (test1 != test2) {
      test1 = progress;
      await new Promise((resolve) => setTimeout(resolve, 5000));
      test2 = progress;
    }
    console.log("Render finished");
    console.log(ffmpeg);
    console.log("#");
    console.log(ffmpeg.stdin);
    ffmpeg.stdin.setEncoding("utf8");
    ffmpeg.stdin.write("q");
    ffmpeg.stdin.end();
    ffmpeg.kill();
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("Deleting temporary stream file");
    fs.unlinkSync(`./videos/${options.user}-${filename}-stream.mp4`);
    process.exit();
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
  record();
};
checkIfUrlIsValid();
