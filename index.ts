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
      .right("V1.8.2")
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
import { Timer } from "timer-node";
const program = new Command();
var nrc = require("node-run-cmd");
const randomstring = require("randomstring");
const { launch, getStream } = require("puppeteer-stream");
const fs = require("fs");

// Add options for command

program.option("-u, --user <string>", "Twitch user to record [Required]");
program.option(
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
  if (!options.user) {
    console.log("Missing argument -u or --user");
    process.exit();
  } else {
    user = options.user.toLowerCase();
  }
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
      console.log("Both audio and video can't be disabled");
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
  } else {
    console.log("Missing argument -w or --windows");
    process.exit();
  }
};

checkConfiguration();

async function startRecording() {
  console.log(`Twitch Streamer: ${user}`);
  console.log(`Using windows: ${windows}`);
  console.log(`Frames Per Second: ${fps}`);
  console.log(`Threads: ${threads}`);
  console.log(`Record reruns: ${rerunEnable}`);
  console.log(`Delete temp file : ${tempDelete}`);
  console.log(`Wait for next stream: ${loopRecording}`);
  console.log(`Record audio: ${recordAudio}`);
  console.log(`Record Video: ${recordVideo}`);
  console.log(`Category: ${category}`);
  console.log(`Cut silence: ${silence}`);
  console.log(`Organize: ${organizeFiles}`);
  console.log(`Skip ad: ${skipAd}`);
  console.log(`Experimental encoding: ${experimental}`);
  console.log(`Max filesize: ${maxSize} \n`);

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
      args: ["--start-fullscreen", "--disable-infobars"],
    });
  } else {
    browser = await launch({
      executablePath: "/usr/bin/google-chrome-stable",
      defaultViewport: {
        width: 1024,
        height: 768,
      },
      ignoreDefaultArgs: ["--enable-automation"],
      args: ["--start-fullscreen", "--disable-infobars"],
    });
  }
  console.log("Opening browser.");
  const page = await browser.newPage();
  console.log("Opening twitch stream");
  await page.goto(`https://www.twitch.tv/${user}`);
  const originalUrl = page.url();
  await new Promise((resolve) => setTimeout(resolve, 2000));

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

  const checkIfCorrect = async () => {
    try {
      await Promise.all([
        await page.click(
          "#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--home.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP > div.channel-root__info.channel-root__info--offline.channel-root__info--home > div > div.Layout-sc-nxg1ff-0.bPMozh.home-header-sticky > div.Layout-sc-nxg1ff-0.Bza-dv > div > div > ul > li:nth-child(5) > a > div > div.ScTextWrapper-sc-18v7095-1.eFGtCR > div"
        ),
      ]);
      console.log('Clicked "Chat" button');
    } catch (err) {}
  };
  await checkIfCorrect();

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
  console.log("Checking if stream is a rerun");
  if ((await checkIfRerun()) == true) {
    console.log("This stream is a rerun");
    rerunStream = true;
  } else {
    rerunStream = false;
  }

  console.log("Checking if stream is agerestricted");
  try {
    await Promise.all([
      await page.click(
        `#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.InjectLayout-sc-588ddc-0.persistent-player > div > div.Layout-sc-nxg1ff-0.video-player > div > div > div > div > div.Layout-sc-nxg1ff-0.krOuYh.player-overlay-background.player-overlay-background--darkness-0.content-overlay-gate > div > div.Layout-sc-nxg1ff-0.bzQnIQ.content-overlay-gate__allow-pointers > button`
      ),
    ]);
    console.log(
      'Stream is agerestricted\nClicked "Start Watching" button\nReloading webpage'
    );
  } catch (err) {
    console.log("Stream is not agerestricted");
  }

  console.log("Changing resolution");
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
  console.log("Reloading webpage to make sure resolution changes");
  await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  console.log("Fullscreening stream");
  await page.keyboard.press("f");
  const file = fs.createWriteStream(`./videos/${user}-${filename}.webm`);

  if (skipAd == true) {
    console.log("Waiting for 1 minute to avoid ads");
    await new Promise((resolve) => setTimeout(resolve, 60000));
  }
  const stream = await getStream(page, {
    audio: recordAudio,
    video: recordVideo,
  });
  recording_timer.start();
  console.log("Now recording");
  getTime();
  console.log(
    "Recording until:\nStreamer goes offline / Streamer raids different stream / Streamer starts a rerun"
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
    if ((await checkCategory()) != true) {
      console.log("Category was changed");
      break;
    }
    if (maxSize != undefined && (await checkFileSize()) >= maxSize) {
      console.log("File size reached max size");
      break;
    }
    printProgress("recording");
    await new Promise((resolve) => setTimeout(resolve, 2500));
  }

  await stream.destroy();
  recording_timer.stop();
  console.log("Closing browser");
  await browser.close();
  await new Promise((resolve) => setTimeout(resolve, 2500));
  console.log(
    `FFmpeg encoding starting now.\nFps set to ${fps}\nEncoding using ${threads} threads\n`
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
    console.log("Encoding has finished.\nDeleting temporary stream file.");
    await fs.unlinkSync(`./videos/${user}-${filename}.webm`);
  }
  const removeSilence = async () => {
    console.log("Listing all silence in video");
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
        console.log("Cuts: " + rounds);
        if (rounds != 0) {
          for (d = 0; d < end.length; d++) {
            var continueCutting = false;
            console.log(`Cutting ${end[d]} - ${start[d]}`);
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
          console.log("Piecing video together");
          const final = await exec(
            `ffmpeg -f concat -safe 0 -i pieces.txt -c copy videos/${user}-${filename}-cut${fileExtenstion}`
          );
          final.on("close", async function () {
            console.log("Deleting cut up and temporary files");
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
          console.log("Skipping all cuts since video has little to no silence");
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
    console.log(`\n\nYour file is ready. File:${user}-${filename}-cut.mp4\n`);
  } else {
    console.log(`\n\nYour file is ready. File:${user}-${filename}.mp4\n`);
  }
  timer.stop();
  console.log(timer.format("Entire process took D:%d H:%h M:%m S:%s"));
  console.log(recording_timer.format("Recorded for D:%d H:%h M:%m S:%s"));
  console.log(encoding_timer.format("Encoded for D:%d H:%h M:%m S:%s"));
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
