import { Command } from "commander";
import { launch, getStream } from "puppeteer-stream";
const program = new Command();
const puppeteer = require("puppeteer");
const randomstring = require("randomstring");
const fs = require("fs");
const { exec } = require("child_process");

let stopWhileLoop = false;
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const noLinkSpecified = () => {
  console.log("Missing argument -l or --link");
  process.exit();
};

program.option("-l, --link <link>", "link to webscrape");

program.parse(process.argv);

const options = program.opts();
const checkIfUrlIsValid = async () => {
  if (options.link) {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });
      const page = await browser.newPage();
      await page.goto(options.link, { waitUntil: "load", timeout: 0 });
      console.log("Link is valid");
      startRecording();
    } catch (e: any) {
      console.log("Link could not be resloved.");
      process.exit();
    }
  } else noLinkSpecified();
};
const filename = randomstring.generate({
  length: 10,
  charset: "hex",
});
const file = fs.createWriteStream(__dirname + `/videos/${filename}.mp4`);

async function startRecording() {
  const browser = await launch({
    // If using windows change to this
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe ",
    // executablePath: "/usr/bin/google-chrome-stable",
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
    args: ["--start-maximized"],
  });
  const checkIfLive = async () => {
    if (
      (await page.$(
        `#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--watch-chat.channel-root--live.channel-root--watch.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP.channel-root__main--with-chat > div.channel-root__info.channel-root__info--with-chat > div > div.Layout-sc-nxg1ff-0.jLilpG > div > div > div > div.Layout-sc-nxg1ff-0.iMHulU > div > div > div > a > div.Layout-sc-nxg1ff-0.ScHaloIndicator-sc-1l14b0i-1.dKzslu.tw-halo__indicator > div > div > div`
      )) !== null
    )
      return true;
    else return false;
  };

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(options.link);

  const record = async () => {
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    await page.keyboard.press("f");
    try {
      await Promise.all([
        await page.click(
          `#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.InjectLayout-sc-588ddc-0.persistent-player > div > div.Layout-sc-nxg1ff-0.video-player > div > div > div > div > div.Layout-sc-nxg1ff-0.krOuYh.player-overlay-background.player-overlay-background--darkness-0.content-overlay-gate > div > div.Layout-sc-nxg1ff-0.bzQnIQ.content-overlay-gate__allow-pointers > button`
        ),
      ]);
      console.log("Stream is agerestricted");
      console.log(`"Clicked "Start Watching" button`);
    } catch (err) {
      console.log("Stream is not agerestricted");
    }

    const stream = await getStream(page, { audio: true, video: true });
    console.log("Starting to record");

    // un comment for ubuntu linux
    const ffmpeg = exec(
      `ffmpeg -y -i - -r 31 -threads 1 ./videos/${filename}-export.mp4`
    );

    // un comment for windows
    // const ffmpeg = exec(
    //   `ffmpeg.exe -y -i - -r 31 -threads 1 ./videos/${filename}-export.mp4`
    // );

    var progress = undefined;
    ffmpeg.stderr.on("data", (chunk) => {
      console.log(chunk.toString());
      progress = chunk;
    });
    stream.pipe(ffmpeg.stdin);

    rl.question("", function (stringFromConsole) {
      if (stringFromConsole == "") {
        stopWhileLoop = true;
      }
      rl.close();
    });

    // Wait until
    while ((await checkIfLive()) == true) {
      if (stopWhileLoop) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 60000));
    }

    stream.pipe(file);
    await stream.destroy();
    file.close();
    console.log("Recording finished");
    console.log("Waiting for render to finish");
    var test1 = 0;
    var test2 = 1;
    await browser.close();
    // make sure render is finished before continuing to save file.
    while (test1 != test2) {
      test1 = progress;
      await new Promise((resolve) => setTimeout(resolve, 5000));
      test2 = progress;
    }
    console.log("Render finished");
    ffmpeg.stdin.setEncoding("utf8");
    ffmpeg.stdin.write("q");
    ffmpeg.stdin.end();
    ffmpeg.kill();
    console.log("Deleting stream file");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    fs.unlinkSync(`./videos/${filename}.mp4`);
    process.exit();
  };
  await new Promise((resolve) => setTimeout(resolve, 5000));
  while ((await checkIfLive()) == false) {
    console.log("Streamer is not live");
    await new Promise((resolve) => setTimeout(resolve, 60000));
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  }
  record();
}
checkIfUrlIsValid();
