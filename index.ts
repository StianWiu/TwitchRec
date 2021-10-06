import { Command } from "commander";
import { launch, getStream } from "puppeteer-stream";
const program = new Command();
const puppeteer = require("puppeteer");
const randomstring = require("randomstring");
const fs = require("fs");
const random = require("random");

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
const file = fs.createWriteStream(__dirname + `/videos/${filename}.webm`);

async function startRecording() {
  const browser = await launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  const page = await browser.newPage();
  await page.goto(options.link);
  await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  await page.keyboard.press("f");
  const stream = await getStream(page, { audio: true, video: true });
  console.log("recording");

  stream.pipe(file);
  setTimeout(async () => {
    await stream.destroy();
    file.close();
    console.log("finished");
    
    process.exit();
  }, 15000 * options.time);
}

checkIfUrlIsValid();
