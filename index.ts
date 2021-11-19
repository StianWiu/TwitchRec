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
      .right("V1.8.6")
      .emptyLine()
      .center(
        'Twitch recording software. Developed by Pignuuu. "--help" for options'
      )
      .render()
  );
};
printLogo();
const { exec } = require("child_process");
import { Command } from "commander";
import { stdout } from "process";
import { Timer } from "timer-node";
const program = new Command();
var nrc = require("node-run-cmd");
const randomstring = require("randomstring");
const { launch, getStream } = require("puppeteer-stream");
const fs = require("fs");

// Add options for command

program.requiredOption(
  "-u, --user <string>",
  "Twitch user to record [Required]"
);
program.requiredOption(
  "-w, --windows <boolean>",
  "Using Windows true or false [Required]"
);
program.option("-f, --frames <num>", "How many fps to export to [Optional]");
program.option(
  "-t, --threads <num>",
  "How many threads to use when encoding [Optional]"
);
program.option("-r, --rerun <boolean>", "Record reruns [Optional]");
program.option("-d, --delete <boolean>", "Delete temp file [Optional]");
program.option(
  "-l, --loop <boolean>",
  "Automatically wait for next stream [Optional]"
);
program.option("-a, --audio <boolean>", "Record audio [Optional]");
program.option("-v, --video <boolean>", "Record video [Optional]");
program.option(
  "-c, --category <string>",
  "Only record certain category [Optional]"
);
program.option(
  "-s, --silence <string>",
  "Cut out silence from final recording [Optional]"
);
program.option(
  "-m, --max <num>",
  "Choose what the maximum filesize can be specify in GB [Optional]"
);
program.option(
  "-o, --organize <boolean>",
  "Choose if file should be automatically sorted into folders [Optional]"
);
program.option(
  "-ad, --skipAd <boolean>",
  "If program should wait 1 minute to avoid recording ads [Optional]"
);
program.option(
  "-x, --experimental <boolean>",
  "If program should use fast method for encoding. NOT RECCOMENDED possible loss in quality and desync between audio and video [Optional]"
);

program.parse(process.argv);
const options = program.opts();

let user;
let windows;
let fps;
let threads;
let rerunStream;
let rerunEnable;
let tempDelete;
let loopRecording;
let recordAudio;
let recordVideo;
let fileExtenstion = ".mp4";
let category;
let silence;
let maxSize;
let cutVideo;
let organizeFiles;
let skipAd;
let experimental;
let skipCutting;

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
  stdout.write(
    "[INFO] " +
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
      seconds +
      "\n"
  );
};

const checkConfiguration = () => {
  user = options.user.toLowerCase();
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
  if (options.silence == "true") {
    silence = true;
  } else {
    silence = false;
  }
  if (options.category) {
    category = options.category.toLowerCase();
  } else {
    category = "undefined";
  }
  if (options.audio == options.video && options.audio == "false") {
    stdout.write("[ERROR] Both audio and video can't be disabled\n");
    process.exit();
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
  if (options.max) {
    maxSize = options.max;
  } else {
    maxSize = undefined;
  }
  if (options.organize == "false") {
    organizeFiles = false;
  } else {
    organizeFiles = true;
  }
  if (options.skipAd == "false") {
    skipAd = false;
  } else {
    skipAd = true;
  }
  if (options.experimental == "true") {
    experimental = true;
  } else {
    experimental = false;
  }
};

checkConfiguration();

async function startRecording() {
  stdout.write(`[SETTING] Twitch Streamer: ${user}\n`);
  stdout.write(`[SETTING] Using windows: ${windows}\n`);
  stdout.write(`[SETTING] Frames Per Second: ${fps}\n`);
  stdout.write(`[SETTING] Threads: ${threads}\n`);
  stdout.write(`[SETTING] Record reruns: ${rerunEnable}\n`);
  stdout.write(`[SETTING] Delete temp file : ${tempDelete}\n`);
  stdout.write(`[SETTING] Wait for next stream: ${loopRecording}\n`);
  stdout.write(`[SETTING] Record audio: ${recordAudio}\n`);
  stdout.write(`[SETTING] Record Video: ${recordVideo}\n`);
  stdout.write(`[SETTING] Category: ${category}\n`);
  stdout.write(`[SETTING] Cut silence: ${silence}\n`);
  stdout.write(`[SETTING] Organize: ${organizeFiles}\n`);
  stdout.write(`[SETTING] Skip ad: ${skipAd}\n`);
  stdout.write(`[SETTING] Experimental encoding: ${experimental}\n`);
  stdout.write(`[SETTING] Max filesize: ${maxSize}\n\n`);

  const filename = randomstring.generate({
    length: 10,
    charset: "hex",
  });

  const timer = new Timer({ label: "main-timer" });
  const recording_timer = new Timer({ label: "recording-timer" });
  const encoding_timer = new Timer({ label: "encoding-timer" });
  timer.start();
  let browser = undefined;
  if (windows == true) {
    browser = await launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe ",
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      ignoreDefaultArgs: ["--enable-automation"],
      args: [" --start-fullscreen", "--disable-infobars", "--no-sandbox"],
    });
  } else {
    browser = await launch({
      executablePath: "/usr/bin/google-chrome-stable",
      defaultViewport: {
        width: 1024,
        height: 768,
      },
      ignoreDefaultArgs: ["--enable-automation"],
      args: ["--start-fullscreen", "--disable-infobars", "--no-sandbox"],
    });
  }
  stdout.write("[ACTION] Opening browser\n");
  const page = await browser.newPage();
  stdout.write("[ACTION] Opening twitch stream\n");
  await page.goto(`https://www.twitch.tv/${user}`);
  const originalUrl = page.url();
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const checkIfUserExists = async () => {
    if (
      (await page.$(
        `#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div.Layout-sc-nxg1ff-0.bDMqsP.core-error__message-container > p`
      )) !== null
    )
      return true;
    else return false;
  };
  if (await checkIfUserExists()) {
    stdout.write("[ERROR] User does not exist\n");
    process.exit();
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
      return false;
    else return true;
  };

  stdout.write("[INFO] Waiting for page to load\n");
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const checkIfCorrect = async () => {
    try {
      await Promise.all([
        await page.click(
          "#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--home.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP > div.channel-root__info.channel-root__info--offline.channel-root__info--home > div > div.Layout-sc-nxg1ff-0.bPMozh.home-header-sticky > div.Layout-sc-nxg1ff-0.Bza-dv > div > div > ul > li:nth-child(5) > a > div > div.ScTextWrapper-sc-18v7095-1.eFGtCR > div"
        ),
      ]);
      stdout.write('[ACTION] Clicked "Chat" button\n');
    } catch (err) {}
  };
  await checkIfCorrect();

  stdout.write("[ACTION] Checking if streamer is live\n");
  if ((await checkIfLive()) == false) {
    stdout.write("[INFO] Streamer is not live\n");
  }

  const checkContinueWithRerun = async () => {
    if (rerunEnable == false && (await checkIfRerun()) == true) {
      return false;
    } else {
      return true;
    }
  };

  const checkCategory = async () => {
    if (category == "undefined") {
      return true;
    }
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

  const checkFileSize = async () => {
    try {
      var stats = fs.statSync(`videos/${user}-${filename}.webm`);
      var fileSizeInBytes = stats.size;
      var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
      var fileSizeInGigabytes = fileSizeInMegabytes * 0.001;
      return fileSizeInGigabytes.toString().substring(0, 6);
    } catch (err) {}
  };

  const printProgress = async (status) => {
    console.clear();
    if (status == "recording") {
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
          .left(`Filesize: ${await checkFileSize()} GB`)
          .left(`Running for: ${timer.format("D:%d H:%h M:%m S:%s")}`)
          .left(`Recording: ${recording_timer.format("D:%d H:%h M:%m S:%s")}`)
          .left(`Rerun: ${await checkIfRerun()}`)
          .render()
      );
    } else if (status == "encoding") {
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
          .left(`Final filesize: ${await checkFileSize()} GB`)
          .left(
            `Final recording time: ${recording_timer.format(
              "D:%d H:%h M:%m S:%s"
            )}`
          )
          .emptyLine()
          .center(`Encoding has started this can take a while`)
          .left(`Threads: ${threads}`)
          .render()
      );
    } else if (status == "slicing") {
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
          .left(`Final filesize: ${await checkFileSize()} GB`)
          .left(
            `Final recording time: ${recording_timer.format(
              "D:%d H:%h M:%m S:%s"
            )}`
          )
          .emptyLine()
          .center(`Slicing has started this can take a while`)
          .render()
      );
    }
  };
  await checkIfCorrect();
  while (
    (await checkIfLive()) == false ||
    (await checkContinueWithRerun()) == false ||
    (await checkCategory()) == false
  ) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  stdout.write("[ACTION] Checking if stream is a rerun\n");
  if ((await checkIfRerun()) == true) {
    stdout.write("[INFO] This stream is a rerun\n");
    rerunStream = true;
  } else {
    rerunStream = false;
  }

  stdout.write("[ACTION] Checking if stream is agerestricted\n");
  try {
    await Promise.all([
      await page.click(
        `#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.InjectLayout-sc-588ddc-0.persistent-player > div > div.Layout-sc-nxg1ff-0.video-player > div > div > div > div > div.Layout-sc-nxg1ff-0.krOuYh.player-overlay-background.player-overlay-background--darkness-0.content-overlay-gate > div > div.Layout-sc-nxg1ff-0.bzQnIQ.content-overlay-gate__allow-pointers > button`
      ),
    ]);
    stdout.write(
      '[INFO] Stream is agerestricted\n[ACTION]Clicked "Start Watching" button\n[ACTION] Reloading webpage\n'
    );
  } catch (err) {
    stdout.write("[INFO] Stream is not agerestricted\n");
  }

  stdout.write("[ACTION] Changing resolution\n");
  await page.click(
    ".Layout-sc-nxg1ff-0:nth-child(2) > .Layout-sc-nxg1ff-0:nth-child(1) > .ScCoreButton-sc-1qn4ixc-0 > .ScButtonIconFigure-sc-o7ndmn-1 > .ScIconLayout-sc-1bgeryd-0 > .ScAspectRatio-sc-1sw3lwy-1 > .ScIconSVG-sc-1bgeryd-1"
  );
  await new Promise((resolve) => setTimeout(resolve, 250));
  await page.click(
    ".Layout-sc-nxg1ff-0 > .Layout-sc-nxg1ff-0:nth-child(3) > .ScIconLayout-sc-1bgeryd-0 > .ScAspectRatio-sc-1sw3lwy-1 > .ScIconSVG-sc-1bgeryd-1"
  );
  await new Promise((resolve) => setTimeout(resolve, 250));
  await page.keyboard.press("Tab");
  await new Promise((resolve) => setTimeout(resolve, 250));
  await page.keyboard.press("Tab");
  await new Promise((resolve) => setTimeout(resolve, 250));
  await page.keyboard.press("ArrowDown");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  stdout.write("[ACTION] Reloading webpage to make sure resolution changes\n");
  await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  stdout.write("[ACTION] Fullscreening stream\n");
  await page.keyboard.press("f");
  const file = fs.createWriteStream(`./videos/${user}-${filename}.webm`);

  if (skipAd == true) {
    stdout.write("[INFO] Waiting for 1 minute to avoid ads\n");
    await new Promise((resolve) => setTimeout(resolve, 60000));
  }
  const stream = await getStream(page, {
    audio: recordAudio,
    video: recordVideo,
  });
  recording_timer.start();
  stdout.write("[ACTION] Now recording\n");
  getTime();
  stdout.write(
    "[INFO] Recording until:\nStreamer goes offline / Streamer raids different stream / Streamer starts a rerun\n"
  );

  stream.pipe(file);

  while ((await checkIfLive()) == true) {
    if (originalUrl != page.url()) {
      stdout.write(
        "[INFO] Stopping recording because streamer raided someone else\n"
      );
      break;
    }
    if ((await checkIfRerun()) == true && rerunStream == false) {
      stdout.write("[INFO] Stream is a rerun\n");
      break;
    }
    if ((await checkCategory()) != true) {
      stdout.write("[INFO] Category was changed\n");
      break;
    }
    if (maxSize != undefined && (await checkFileSize()) >= maxSize) {
      stdout.write("[INFO] File size reached max size\n");
      break;
    }
    printProgress("recording");
    await new Promise((resolve) => setTimeout(resolve, 2500));
  }

  await stream.destroy();
  recording_timer.stop();
  stdout.write("[ACTION] Closing browser\n");
  await browser.close();
  await new Promise((resolve) => setTimeout(resolve, 2500));
  stdout.write(
    `[ACTION] FFmpeg encoding starting now.\nFps set to ${fps}\nEncoding using ${threads} threads\n`
  );
  encoding_timer.start();
  printProgress("encoding");
  if (experimental == true) {
    if (windows == true) {
      await nrc.run(
        `ffmpeg.exe -i videos/${user}-${filename}.webm -c:v copy -c:a aac -strict experimental videos/${user}-${filename}${fileExtenstion}`
      );
    } else {
      await nrc.run(
        `ffmpeg.exe -i videos/${user}-${filename}.webm -c:v copy -c:a aac -strict experimental videos/${user}-${filename}${fileExtenstion}`
      );
    }
  } else {
    if (windows == true) {
      await nrc.run(
        `ffmpeg.exe -i videos/${user}-${filename}.webm -threads ${threads} -r ${fps} -c:v libx264 -crf 20 -preset fast videos/${user}-${filename}${fileExtenstion}`
      );
    } else {
      await nrc.run(
        `ffmpeg -i videos/${user}-${filename}.webm -threads ${threads} -r ${fps} -c:v libx264 -crf 20 -preset fast videos/${user}-${filename}${fileExtenstion}`
      );
    }
  }
  encoding_timer.stop();
  if (tempDelete == true) {
    stdout.write(
      "[INFO] Encoding has finished.\n[ACTION] Deleting temporary stream file\n"
    );
    await fs.unlinkSync(`./videos/${user}-${filename}.webm`);
  }
  const removeSilence = async () => {
    stdout.write("[ACTION] Listing all silence in video\n");
    const getList = await exec(
      `ffmpeg -i videos/${user}-${filename}${fileExtenstion} -af silencedetect=noise=0.0001 -f null - 2> silence.txt`
    );
    await new Promise((resolve) => {
      getList.on("close", async function () {
        printProgress("slicing");
        const readline = require("readline");

        const readInterface = readline.createInterface({
          input: fs.createReadStream("silence.txt"),
          console: false,
        });

        let i = 0;
        let o = 1;
        let start = [];
        let end = [];
        end[0] = 0;
        let endtime;
        for await (var line of readInterface) {
          if (line.includes("silencedetect")) {
            if (line.includes("start")) {
              line = line.substring(line.indexOf(":") + 1).replace(" ", "");
              line = line.split("|")[0];
              start[i] = line;
              i++;
            } else {
              line = line.substring(line.indexOf(":") + 1).replace(" ", "");
              line = line.split("|")[0];
              end[o] = line;
              o++;
            }
          } else if (line.includes("Duration:")) {
            line = line.substring(line.indexOf(":") + 1).replace(" ", "");
            line = line.split(",")[0];
            endtime = line;
          }
        }
        var logger = fs.createWriteStream("pieces.txt", {
          flags: "a", // 'a' means appending (old data will be preserved)
        });

        start.push(endtime);
        let d;
        let rounds;
        for (let k = 0; k < end.length; k++) {
          rounds = k;
        }
        stdout.write("[INFO] Cuts: " + rounds + "\n");
        if (rounds != 0) {
          for (d = 0; d < end.length; d++) {
            var continueCutting = false;
            stdout.write(`[ACTION] Cutting ${end[d]} - ${start[d]}\n`);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            let cut;
            if (experimental == true) {
              if (start[d] == 0) {
                cut = await exec(
                  `ffmpeg -t 1 -i videos/${user}-${filename}${fileExtenstion} -r ${fps}  -c:v copy -ss ${end[d]} pieces/piece${d}.mp4`
                );
              } else {
                cut = await exec(
                  `ffmpeg -t ${start[d]} -i videos/${user}-${filename}${fileExtenstion}  -c:v copy -r ${fps} -ss ${end[d]} pieces/piece${d}.mp4`
                );
              }
            } else {
              if (start[d] == 0) {
                cut = await exec(
                  `ffmpeg -t 1 -i videos/${user}-${filename}${fileExtenstion} -r ${fps} -ss ${end[d]} pieces/piece${d}.mp4`
                );
              } else {
                cut = await exec(
                  `ffmpeg -t ${start[d]} -i videos/${user}-${filename}${fileExtenstion} -r ${fps} -ss ${end[d]} pieces/piece${d}.mp4`
                );
              }
            }
            cut.on("close", async function () {
              continueCutting = true;
            });
            while (continueCutting == false) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            logger.write(`file pieces/piece${d}.mp4\n`);
          }
          await new Promise((resolve) => setTimeout(resolve, 2000));
          stdout.write("[ACTION] Piecing video together\n");
          const final = await exec(
            `ffmpeg -f concat -safe 0 -i pieces.txt -c copy videos/${user}-${filename}-cut${fileExtenstion}`
          );
          final.on("close", async function () {
            stdout.write("[ACTION] Deleting cut up and temporary files\n");
            for (let d = 0; d < end.length; d++) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              await fs.unlinkSync(`pieces/piece${d}.mp4`);
            }
            await fs.unlinkSync(`pieces.txt`);
            await fs.unlinkSync(`silence.txt`);
            if (tempDelete == true) {
              await fs.unlinkSync(
                `./videos/${user}-${filename}${fileExtenstion}`
              );
            }
            cutVideo = true;
            resolve(``);
          });
        } else {
          stdout.write(
            "[INFO] Skipping all cuts since video has little to no silence\n"
          );
          skipCutting = true;
          await new Promise((resolve) => setTimeout(resolve, 5000));
          try {
            await fs.unlinkSync(`pieces.txt`);
            await fs.unlinkSync(`silence.txt`);
          } catch (err) {}
          resolve(``);
        }
      });
    });
  };

  const organize = async () => {
    if (!(await fs.existsSync(`./videos/${user}`))) {
      await fs.mkdirSync(`./videos/${user}`);
    }
    let outputName;
    if (silence == true && skipCutting != true) {
      outputName = `${user}-${filename}-cut${fileExtenstion}`;
    } else {
      outputName = `${user}-${filename}${fileExtenstion}`;
    }

    fs.rename(
      `./videos/${outputName}`,
      `./videos/${user}/${outputName}`,
      function (err) {
        if (err) {
          throw err;
        } else {
        }
      }
    );
  };

  if (silence == true) {
    await removeSilence();
  }
  if (organizeFiles == true) {
    await organize();
  }

  await new Promise((resolve) => setTimeout(resolve, 2500));
  console.clear();
  await printLogo();
  if (cutVideo == true) {
    stdout.write(`\n\nYour file is ready. File:${user}-${filename}-cut.mp4\n`);
  } else {
    stdout.write(`\n\nYour file is ready. File:${user}-${filename}.mp4\n`);
  }
  timer.stop();
  stdout.write(
    timer.format("[INFO] Entire process took D:%d H:%h M:%m S:%s\n")
  );
  stdout.write(
    recording_timer.format("[INFO] Recorded for D:%d H:%h M:%m S:%s\n")
  );
  stdout.write(
    encoding_timer.format("[INFO] Encoded for D:%d H:%h M:%m S:%s\n")
  );
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
