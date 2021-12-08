console.clear();

const fs = require("fs");
const puppeteer = require("puppeteer");
const m3u8stream = require("m3u8stream");
const randomstring = require("randomstring");
const logo = require("asciiart-logo");

const filename = randomstring.generate({
  length: 10,
  charset: "hex",
});
import { Command } from "commander";
import { Timer } from "timer-node";
import { stdout } from "process";
const program = new Command();

let user;
let rerunEnable;

const timer = new Timer({ label: "main-timer" });
const recording_timer = new Timer({ label: "recording-timer" });
timer.start();

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
      .right("V2.1.0")
      .emptyLine()
      .center(
        'Twitch recording software. Developed by Pignuuu. "--help" for options'
      )
      .render()
  );
};
printLogo();
program.requiredOption("-u, --user <string>", "Twitch username");
program.option("-r, --rerun <boolean>", "Record reruns [Optional]");

program.parse(process.argv);
const options = program.opts();

const checkConfiguration = () => {
  user = options.user.toLowerCase();
  if (options.rerun == "false") {
    rerunEnable = false;
  } else {
    rerunEnable = true;
  }
};
checkConfiguration();

const startProcess = async () => {
  const browser = await puppeteer.launch({
    // headless: false,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });
  const page = await browser.newPage();
  await page.goto(`https://www.twitch.tv/${user}`);
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

  const checkIfUserIsLive = async () => {
    try {
      await page.waitForSelector(
        "#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--watch-chat.channel-root--live.channel-root--watch.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP.channel-root__main--with-chat > div.channel-root__info.channel-root__info--with-chat > div > div.Layout-sc-nxg1ff-0.jLilpG > div > div > div > div.Layout-sc-nxg1ff-0.iMHulU > div > div > div > a > div.Layout-sc-nxg1ff-0.ScHaloIndicator-sc-1l14b0i-1.dKzslu.tw-halo__indicator > div > div > div",
        { timeout: 3000 }
      );
      return true;
    } catch (error) {
      return false;
    }
  };

  const checkIfStreamIsRerun = async () => {
    try {
      await page.waitForSelector(
        "#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--watch-chat.channel-root--live.channel-root--watch.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP.channel-root__main--with-chat > div.channel-root__info.channel-root__info--with-chat > div > div.Layout-sc-nxg1ff-0.jLilpG > div > div.Layout-sc-nxg1ff-0.hMFNaU.metadata-layout__split-top > div.Layout-sc-nxg1ff-0 > div > div > div > div > div > a > span",
        { timeout: 3000 }
      );
      return true;
    } catch (error) {
      return false;
    }
  };

  const checkIfRecordRerun = async () => {
    if (rerunEnable == false && (await checkIfStreamIsRerun()) == true) {
      return false;
    } else {
      return true;
    }
  };
  const clickChatButton = async () => {
    try {
      await page.waitForSelector(
        "#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--home.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP > div.channel-root__info.channel-root__info--offline.channel-root__info--home > div > div.Layout-sc-nxg1ff-0.bPMozh.home-header-sticky > div.Layout-sc-nxg1ff-0.Bza-dv > div > div > ul > li:nth-child(5) > a > div > div.ScTextWrapper-sc-18v7095-1.eFGtCR > div",
        { timeout: 3000 }
      );
      await page.click(
        "#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--home.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP > div.channel-root__info.channel-root__info--offline.channel-root__info--home > div > div.Layout-sc-nxg1ff-0.bPMozh.home-header-sticky > div.Layout-sc-nxg1ff-0.Bza-dv > div > div > ul > li:nth-child(5) > a > div > div.ScTextWrapper-sc-18v7095-1.eFGtCR > div"
      );
      stdout.write('[ACTION] Clicked "Chat" button\n');
    } catch (err) {}
  };
  await clickChatButton();

  const getFileSize = async () => {
    var fileInfo = fs.statSync(`videos/${user}/${user}-${filename}.mp4`);
    var fileSize = fileInfo.size;
    return fileSize;
  };
  const getFileSizeGb = async () => {
    var stats = fs.statSync(`videos/${user}/${user}-${filename}.mp4`);
    var fileSizeInBytes = stats.size;
    var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    var fileSizeInGigabytes = fileSizeInMegabytes * 0.001;
    return fileSizeInGigabytes.toString().substring(0, 6);
  };
  const recordingProgress = async () => {
    console.clear();
    console.log(
      logo({
        name: "Pignuuu",
        font: "Chunky",
        lineChars: 10,
        padding: 2,
        margin: 3,
      })
        .emptyLine()
        .left(`User: ${user}`)
        .emptyLine()
        .left(`Filesize: ${await getFileSizeGb()} GB`)
        .left(`Running for: ${timer.format("D:%d H:%h M:%m S:%s")}`)
        .left(`Recording: ${recording_timer.format("D:%d H:%h M:%m S:%s")}`)
        .left(`Rerun: ${await checkIfStreamIsRerun()}`)
        .render()
    );
  };

  const startRecording = async () => {
    stdout.write("\n[INFO] Getting raw stream url");
    await page.goto(`https://pwn.sh/tools/getstream.html`);
    await page.waitForSelector("#input-url");
    await page.click("#input-url");
    await page.keyboard.type(`twitch.tv/${options.user}`);
    await page.waitForSelector("#go");
    await page.click("#go");
    await page.waitForSelector("#alert_result > a:nth-child(1)");
    const link = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("#alert_result > a:nth-child(1)"),
        (a) => a.getAttribute("href")
      )
    );
    browser.close();
    stdout.write("\n[ACTION] Recording started");
    recording_timer.start();
    if (!(await fs.existsSync(`./videos/${user}`))) {
      await fs.mkdirSync(`./videos/${user}`);
    }
    await m3u8stream(link[0]).pipe(
      fs.createWriteStream(`videos/${user}/${user}-${filename}.mp4`)
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));
    recordingProgress();
    var variableFileSize = await getFileSize();
    await new Promise((resolve) => setTimeout(resolve, 30000));
    while (variableFileSize != (await getFileSize())) {
      variableFileSize = await getFileSize();
      recordingProgress();
      await new Promise((resolve) => setTimeout(resolve, 30000));
    }
  };

  (async () => {
    if (await checkIfUserExists()) {
      stdout.write("\n[INFO] User exists");
      stdout.write(
        "\n[INFO] Recording will start when user goes live or starts a rerun."
      );
      while (
        (await checkIfUserIsLive()) == false ||
        (await checkIfRecordRerun()) == false
      ) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
      await startRecording();
      await printLogo();
      stdout.write(
        `\n\nYour file is ready. File:./${user}/${user}-${filename}.mp4\n`
      );
      timer.stop();
      stdout.write(
        timer.format("[INFO] Entire process took D:%d H:%h M:%m S:%s\n")
      );
      stdout.write(
        recording_timer.format("[INFO] Recorded for D:%d H:%h M:%m S:%s\n")
      );
    } else {
      stdout.write("\n[INFO] User does not exist. Exiting");
      process.exit();
    }
  })();
};

startProcess();
