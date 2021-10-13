"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var logo = require("asciiart-logo");
var printLogo = function () {
    console.log(logo({
        name: "Pignuuu",
        font: "Chunky",
        lineChars: 10,
        padding: 2,
        margin: 3
    })
        .emptyLine()
        .right("V1.0.0")
        .emptyLine()
        .center('Twitch recording software. Developed by Pignuuu. "--help" for options')
        .render());
};
printLogo();
var commander_1 = require("commander");
var timer_node_1 = require("timer-node");
var program = new commander_1.Command();
var randomstring = require("randomstring");
var nrc = require("node-run-cmd");
var _a = require("puppeteer-stream"), launch = _a.launch, getStream = _a.getStream;
var fs = require("fs");
// Add options for command
var noUserSpecified = function () {
    console.log("Missing argument -u or --user");
    process.exit();
};
var noOsSpecified = function () {
    console.log("Missing argument -w or --windows");
    process.exit();
};
program.option("-u, --user <username>", "Twitch user to record [Required]");
program.option("-w, --windows <boolean>", "Using windows true or false [Required]");
program.option("-f, --frames <num>", "How many fps to export to [Optinal]");
program.option("-t, --threads <num>", "How many threads to use when encoding [Optinal]");
program.parse(process.argv);
var options = program.opts();
var windows = undefined;
var fps = undefined;
var threads = undefined;
var rerunStream = undefined;
var checkConfiguration = function () {
    if (options.user) {
        if (options.windows == "true" || options.windows == "false") {
            if (options.windows == "true") {
                windows = true;
            }
            else {
                windows = false;
            }
            if (options.frames) {
                fps = options.frames;
            }
            else {
                fps = 24;
            }
            if (options.threads) {
                threads = options.threads;
            }
            else {
                threads = 1;
            }
        }
        else
            noOsSpecified();
    }
    else
        noUserSpecified();
};
checkConfiguration();
var filename = randomstring.generate({
    length: 10,
    charset: "hex"
});
function startRecording() {
    return __awaiter(this, void 0, void 0, function () {
        var timer, recording_timer, browser, page, originalUrl, checkIfLive, checkIfRerun, _a, _b, err_1, file, stream;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    timer = new timer_node_1.Timer({ label: "main-timer" });
                    recording_timer = new timer_node_1.Timer({ label: "recording-timer" });
                    timer.start();
                    browser = undefined;
                    if (!(windows == true)) return [3 /*break*/, 2];
                    return [4 /*yield*/, launch({
                            executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe ",
                            defaultViewport: {
                                width: 1920,
                                height: 1080
                            }
                        })];
                case 1:
                    browser = _c.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, launch({
                        executablePath: "/usr/bin/google-chrome-stable",
                        defaultViewport: {
                            width: 1024,
                            height: 768
                        }
                    })];
                case 3:
                    browser = _c.sent();
                    _c.label = 4;
                case 4:
                    console.log("Opening browser.");
                    return [4 /*yield*/, browser.newPage()];
                case 5:
                    page = _c.sent();
                    console.log("Opening twitch stream");
                    return [4 /*yield*/, page.goto("https://www.twitch.tv/" + options.user)];
                case 6:
                    _c.sent();
                    originalUrl = page.url();
                    checkIfLive = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, page.$("#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--watch-chat.channel-root--live.channel-root--watch.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP.channel-root__main--with-chat > div.channel-root__info.channel-root__info--with-chat > div > div.Layout-sc-nxg1ff-0.jLilpG > div > div > div > div.Layout-sc-nxg1ff-0.iMHulU > div > div > div > a > div.Layout-sc-nxg1ff-0.ScHaloIndicator-sc-1l14b0i-1.dKzslu.tw-halo__indicator > div > div > div")];
                                case 1:
                                    if ((_a.sent()) !== null)
                                        return [2 /*return*/, true];
                                    else
                                        return [2 /*return*/, false];
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    checkIfRerun = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, page.$("#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--watch-chat.channel-root--live.channel-root--watch.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP.channel-root__main--with-chat > div.channel-root__info.channel-root__info--with-chat > div > div.Layout-sc-nxg1ff-0.jLilpG > div > div > div > div.Layout-sc-nxg1ff-0.iMexhI > div.Layout-sc-nxg1ff-0.dglwHV > div.Layout-sc-nxg1ff-0.kBOtQI > div > div:nth-child(2) > div > div > div.Layout-sc-nxg1ff-0.ftYIWt > a > span")];
                                case 1:
                                    if ((_a.sent()) !== null)
                                        return [2 /*return*/, true];
                                    else
                                        return [2 /*return*/, false];
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    console.log("Waiting for page to load");
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 7:
                    _c.sent();
                    console.log("Checking if streamer is live");
                    _c.label = 8;
                case 8: return [4 /*yield*/, checkIfLive()];
                case 9:
                    if (!((_c.sent()) == false)) return [3 /*break*/, 12];
                    console.log("Streamer is not live");
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 60000); })];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })];
                case 11:
                    _c.sent();
                    return [3 /*break*/, 8];
                case 12:
                    console.log("Checking if stream is a rerun");
                    return [4 /*yield*/, checkIfRerun()];
                case 13:
                    if ((_c.sent()) == false) {
                        console.log("This stream is a rerun \nContinuing to record anyways");
                        rerunStream = true;
                    }
                    else {
                        rerunStream = false;
                    }
                    console.log("Reloading webpage");
                    return [4 /*yield*/, page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })];
                case 14:
                    _c.sent();
                    console.log("Fullscreening stream");
                    return [4 /*yield*/, page.keyboard.press("f")];
                case 15:
                    _c.sent();
                    console.log("Checking if stream is agerestricted");
                    _c.label = 16;
                case 16:
                    _c.trys.push([16, 19, , 20]);
                    _b = (_a = Promise).all;
                    return [4 /*yield*/, page.click("#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.InjectLayout-sc-588ddc-0.persistent-player > div > div.Layout-sc-nxg1ff-0.video-player > div > div > div > div > div.Layout-sc-nxg1ff-0.krOuYh.player-overlay-background.player-overlay-background--darkness-0.content-overlay-gate > div > div.Layout-sc-nxg1ff-0.bzQnIQ.content-overlay-gate__allow-pointers > button")];
                case 17: return [4 /*yield*/, _b.apply(_a, [[
                            _c.sent()
                        ]])];
                case 18:
                    _c.sent();
                    console.log('Stream is agerestricted\nClicked "Start Watching" button');
                    return [3 /*break*/, 20];
                case 19:
                    err_1 = _c.sent();
                    console.log("Stream is not agerestricted");
                    return [3 /*break*/, 20];
                case 20:
                    file = fs.createWriteStream("./videos/" + options.user + "-" + filename + ".webm");
                    return [4 /*yield*/, getStream(page, { audio: true, video: true })];
                case 21:
                    stream = _c.sent();
                    recording_timer.start();
                    console.log("Now recording");
                    console.log("Recording will stop when:\nStreamer goes offline / Streamer raids different stream / Streamer starts a rerun");
                    stream.pipe(file);
                    _c.label = 22;
                case 22: return [4 /*yield*/, checkIfLive()];
                case 23:
                    if (!((_c.sent()) == true)) return [3 /*break*/, 26];
                    if (originalUrl != page.url()) {
                        console.log("Stopping recording because streamer raided someone else");
                        return [3 /*break*/, 26];
                    }
                    return [4 /*yield*/, checkIfRerun()];
                case 24:
                    if ((_c.sent()) == false && rerunStream == false) {
                        console.log("Stream is a rerun");
                        return [3 /*break*/, 26];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 15000); })];
                case 25:
                    _c.sent();
                    return [3 /*break*/, 22];
                case 26: return [4 /*yield*/, stream.destroy()];
                case 27:
                    _c.sent();
                    stream.on("end", function () { });
                    recording_timer.stop();
                    console.log("Closing browser");
                    return [4 /*yield*/, browser.close()];
                case 28:
                    _c.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2500); })];
                case 29:
                    _c.sent();
                    console.log("FFmpeg encoding starting now.\nFps set to " + fps + "\nEncoding using " + threads + " threads\n");
                    if (!(windows == true)) return [3 /*break*/, 31];
                    return [4 /*yield*/, nrc.run("ffmpeg.exe -i videos/" + options.user + "-" + filename + ".webm -threads " + threads + " -r " + fps + " -c:v libx264 -crf 20 -preset fast videos/" + options.user + "-" + filename + ".mp4")];
                case 30:
                    _c.sent();
                    return [3 /*break*/, 33];
                case 31: return [4 /*yield*/, nrc.run("ffmpeg -i videos/" + options.user + "-" + filename + ".webm -threads " + threads + " -r " + fps + " -c:v libx264 -crf 20 -preset fast videos/" + options.user + "-" + filename + ".mp4")];
                case 32:
                    _c.sent();
                    _c.label = 33;
                case 33:
                    console.log("Encoding has finished.\nDeleting temporary stream file.");
                    return [4 /*yield*/, fs.unlinkSync("./videos/" + options.user + "-" + filename + ".webm")];
                case 34:
                    _c.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2500); })];
                case 35:
                    _c.sent();
                    console.clear();
                    return [4 /*yield*/, printLogo()];
                case 36:
                    _c.sent();
                    console.log("\n\nYour file is ready. File:" + options.user + "-" + filename + ".mp4\n ");
                    timer.stop();
                    console.log(timer.format("Entire process took D:%d H:%h M:%m S:%s"));
                    console.log(recording_timer.format("Recorded for D:%d H:%h M:%m S:%s"));
                    process.exit();
                    return [2 /*return*/];
            }
        });
    });
}
startRecording();
