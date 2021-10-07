import { Command } from "commander";
import { launch, getStream } from "puppeteer-stream";
const program = new Command();
const puppeteer = require("puppeteer");
const randomstring = require("randomstring");
const fs = require("fs");
const { exec } = require("child_process");

const noLinkSpecified = () => {
  console.log("Missing argument -l or --link");
  process.exit();
};
const noTimeSpecified = () => {
  console.log("Missing argument -t or --time");
  process.exit();
};

program
  .option("-l, --link <link>", "link to webscrape")
  .option("-t, --time <time>", "how many minutes to record");

program.parse(process.argv);

const options = program.opts();
const checkIfUrlIsValid = async () => {
  if (options.time == undefined) noTimeSpecified();
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
    // executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe ",
    executablePath: "/usr/bin/google-chrome-stable",
    defaultViewport: {
      width: 1024,
      height: 768,
    },
  });

  const page = await browser.newPage();
  await page.goto(options.link);
  await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  await page.keyboard.press("f");
  try {
    await Promise.all([
      await page.click(
        `#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.InjectLayout-sc-588ddc-0.persistent-player > div > div.Layout-sc-nxg1ff-0.video-player > div > div > div > div > div.Layout-sc-nxg1ff-0.krOuYh.player-overlay-background.player-overlay-background--darkness-0.content-overlay-gate > div > div.Layout-sc-nxg1ff-0.bzQnIQ.content-overlay-gate__allow-pointers > button`
      ),
    ]);
    console.log("Stream is agerestricted");
  } catch (err) {
    console.log("Stream is not agerestricted");
  }
  const stream = await getStream(page, { audio: true, video: true });
  console.log("recording");
  const ffmpeg = exec(`ffmpeg -y -i - ./videos/${filename}.mp4`);
  ffmpeg.stderr.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  stream.pipe(ffmpeg.stdin);

  stream.pipe(file);
  setTimeout(async () => {
    await stream.destroy();
    file.close();
    console.log("finished");
    ffmpeg.stdin.setEncoding("utf8");
    ffmpeg.stdin.write("q");
    ffmpeg.stdin.end();
    ffmpeg.kill();

    process.exit();
  }, 60000 * options.time);
}

checkIfUrlIsValid();
