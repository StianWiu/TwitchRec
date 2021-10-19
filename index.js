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
console.clear();
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
        .right("V1.5.1")
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
var noRecordingSelected = function () {
    console.log("Both audio and video can't be disabled");
    process.exit();
};
program.option("-u, --user <string>", "Twitch user to record [Required]");
program.option("-w, --windows <boolean>", "Using windows true or false [Required]");
program.option("-f, --frames <num>", "How many fps to export to [Optinal]");
program.option("-t, --threads <num>", "How many threads to use when encoding [Optinal]");
program.option("-r, --rerun <boolean>", "Record reruns [Optinal]");
program.option("-d, --delete <boolean>", "Delete temp file [Optinal]");
program.option("-l, --loop <boolean>", "Automatically wait for next stream [Optinal]");
program.option("-a, --audio <boolean>", "Record audio [Optinal]");
program.option("-v, --video <boolean>", "Record video [Optinal]");
program.option("-c, --category <string>", "Only record certain category [Optinal]");
program.parse(process.argv);
var options = program.opts();
var windows = undefined;
var fps = undefined;
var threads = undefined;
var rerunStream = undefined;
var rerunEnable = undefined;
var tempDelete = undefined;
var loopRecording = undefined;
var recordAudio = undefined;
var recordVideo = undefined;
var fileExtenstion = ".mp4";
var category = undefined;
var getTime = function () {
    var date_ob = new Date();
    var date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    var year = date_ob.getFullYear();
    // current hours
    var hours = date_ob.getHours();
    // current minutes
    var minutes = date_ob.getMinutes();
    // current seconds
    var seconds = date_ob.getSeconds();
    console.log(year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds);
};
var checkConfiguration = function () {
    if (options.user) {
        if (options.windows == "true" || options.windows == "false") {
            if (options.windows == "true") {
                windows = true;
            }
            else {
                windows = false;
            }
            if (options.rerun == "false") {
                rerunEnable = false;
            }
            else {
                rerunEnable = true;
            }
            if (options["delete"] == "false") {
                tempDelete = false;
            }
            else {
                tempDelete = true;
            }
            if (options.loop == "true") {
                loopRecording = true;
            }
            else {
                loopRecording = false;
            }
            if (options.category) {
                category = options.category.toLowerCase();
            }
            if (options.audio == options.video && options.audio == "false") {
                noRecordingSelected();
            }
            else {
                if (options.audio == "false") {
                    recordAudio = false;
                }
                else {
                    recordAudio = true;
                }
                if (options.video == "false") {
                    recordVideo = false;
                    fileExtenstion = ".mp3";
                }
                else {
                    recordVideo = true;
                }
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
function startRecording() {
    return __awaiter(this, void 0, void 0, function () {
        var filename, timer, recording_timer, browser, page, originalUrl, checkIfCorrect, checkIfLive, checkIfRerun, checkContinueWithRerun, checkCategory, _a, _b, _c, _d, err_1, file, stream;
        var _this = this;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    console.log("Twitch Streamer: " + options.user);
                    console.log("Using windows: " + windows);
                    console.log("Frames Per Second: " + fps);
                    console.log("Threads: " + threads);
                    console.log("Record reruns: " + rerunEnable);
                    console.log("Delete temp file : " + tempDelete);
                    console.log("Wait for next stream: " + loopRecording);
                    console.log("Record audio: " + recordAudio);
                    console.log("Record Video: " + recordVideo + "\n");
                    filename = randomstring.generate({
                        length: 10,
                        charset: "hex"
                    });
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
                    browser = _e.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, launch({
                        executablePath: "/usr/bin/google-chrome-stable",
                        defaultViewport: {
                            width: 1024,
                            height: 768
                        }
                    })];
                case 3:
                    browser = _e.sent();
                    _e.label = 4;
                case 4:
                    console.log("Opening browser.");
                    return [4 /*yield*/, browser.newPage()];
                case 5:
                    page = _e.sent();
                    console.log("Opening twitch stream");
                    return [4 /*yield*/, page.goto("https://www.twitch.tv/" + options.user)];
                case 6:
                    _e.sent();
                    originalUrl = page.url();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 7:
                    _e.sent();
                    checkIfCorrect = function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b, err_2;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 3, , 4]);
                                    _b = (_a = Promise).all;
                                    return [4 /*yield*/, page.click("#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--hold-chat.channel-root--live.channel-root--home.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP > div.channel-root__info.channel-root__info--home > div > div.Layout-sc-nxg1ff-0.bPMozh.home-header-sticky > div.Layout-sc-nxg1ff-0.Bza-dv > div > div > ul > li:nth-child(5) > a > div > div.ScTextWrapper-sc-18v7095-1.eFGtCR")];
                                case 1: return [4 /*yield*/, _b.apply(_a, [[
                                            _c.sent()
                                        ]])];
                                case 2:
                                    _c.sent();
                                    console.log('Clicked "Chat" button');
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_2 = _c.sent();
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, checkIfCorrect()];
                case 8:
                    _e.sent();
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
                                        return [2 /*return*/, false];
                                    else
                                        return [2 /*return*/, true];
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    console.log("Waiting for page to load");
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 9:
                    _e.sent();
                    console.log("Checking if streamer is live");
                    return [4 /*yield*/, checkIfLive()];
                case 10:
                    if ((_e.sent()) == false) {
                        console.log("Streamer is not live");
                    }
                    checkContinueWithRerun = function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = rerunEnable == false;
                                    if (!_a) return [3 /*break*/, 2];
                                    return [4 /*yield*/, checkIfRerun()];
                                case 1:
                                    _a = (_b.sent()) == true;
                                    _b.label = 2;
                                case 2:
                                    if (_a) {
                                        return [2 /*return*/, false];
                                    }
                                    else {
                                        return [2 /*return*/, true];
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    checkCategory = function () { return __awaiter(_this, void 0, void 0, function () {
                        var value1, value2, element1, err_3, element2, err_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    value1 = undefined;
                                    value2 = undefined;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 4, , 5]);
                                    return [4 /*yield*/, page.$("#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--watch-chat.channel-root--live.channel-root--watch.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP.channel-root__main--with-chat > div.channel-root__info.channel-root__info--with-chat > div > div.Layout-sc-nxg1ff-0.jLilpG > div > div > div > div.Layout-sc-nxg1ff-0.iMexhI > div.Layout-sc-nxg1ff-0.dglwHV > div.Layout-sc-nxg1ff-0.kBOtQI > div > div:nth-child(2) > div > div > div.Layout-sc-nxg1ff-0.ftYIWt > a > span")];
                                case 2:
                                    element1 = _a.sent();
                                    return [4 /*yield*/, page.evaluate(function (el) { return el.textContent; }, element1)];
                                case 3:
                                    value1 = _a.sent();
                                    value1 = value1.toLowerCase();
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_3 = _a.sent();
                                    return [3 /*break*/, 5];
                                case 5:
                                    if (value1 == category) {
                                        return [2 /*return*/, true];
                                    }
                                    _a.label = 6;
                                case 6:
                                    _a.trys.push([6, 9, , 10]);
                                    return [4 /*yield*/, page.$("#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--watch-chat.channel-root--live.channel-root--watch.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP.channel-root__main--with-chat > div.channel-root__info.channel-root__info--with-chat > div > div.Layout-sc-nxg1ff-0.jLilpG > div > div.Layout-sc-nxg1ff-0.hMFNaU.metadata-layout__split-top > div.Layout-sc-nxg1ff-0 > div > div > div > div > div > a > span")];
                                case 7:
                                    element2 = _a.sent();
                                    return [4 /*yield*/, page.evaluate(function (el) { return el.textContent; }, element2)];
                                case 8:
                                    value2 = _a.sent();
                                    value2 = value2.toLowerCase();
                                    return [3 /*break*/, 10];
                                case 9:
                                    err_4 = _a.sent();
                                    return [3 /*break*/, 10];
                                case 10:
                                    if (value2 == category) {
                                        return [2 /*return*/, true];
                                    }
                                    else {
                                        return [2 /*return*/, false];
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    _e.label = 11;
                case 11: return [4 /*yield*/, checkIfLive()];
                case 12:
                    _b = (_e.sent()) == false;
                    if (_b) return [3 /*break*/, 14];
                    return [4 /*yield*/, checkContinueWithRerun()];
                case 13:
                    _b = (_e.sent()) == false;
                    _e.label = 14;
                case 14:
                    _a = _b;
                    if (_a) return [3 /*break*/, 16];
                    return [4 /*yield*/, checkCategory()];
                case 15:
                    _a = (_e.sent()) == false;
                    _e.label = 16;
                case 16:
                    if (!_a) return [3 /*break*/, 20];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 17:
                    _e.sent();
                    return [4 /*yield*/, page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })];
                case 18:
                    _e.sent();
                    return [4 /*yield*/, checkIfCorrect()];
                case 19:
                    _e.sent();
                    return [3 /*break*/, 11];
                case 20:
                    console.log("Checking if stream is a rerun");
                    return [4 /*yield*/, checkIfRerun()];
                case 21:
                    if ((_e.sent()) == true) {
                        console.log("This stream is a rerun");
                        rerunStream = true;
                    }
                    else {
                        rerunStream = false;
                    }
                    console.log("Reloading webpage");
                    return [4 /*yield*/, page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })];
                case 22:
                    _e.sent();
                    console.log("Fullscreening stream");
                    return [4 /*yield*/, page.keyboard.press("f")];
                case 23:
                    _e.sent();
                    console.log("Checking if stream is agerestricted");
                    _e.label = 24;
                case 24:
                    _e.trys.push([24, 28, , 29]);
                    _d = (_c = Promise).all;
                    return [4 /*yield*/, page.click("#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.InjectLayout-sc-588ddc-0.persistent-player > div > div.Layout-sc-nxg1ff-0.video-player > div > div > div > div > div.Layout-sc-nxg1ff-0.krOuYh.player-overlay-background.player-overlay-background--darkness-0.content-overlay-gate > div > div.Layout-sc-nxg1ff-0.bzQnIQ.content-overlay-gate__allow-pointers > button")];
                case 25: return [4 /*yield*/, _d.apply(_c, [[
                            _e.sent()
                        ]])];
                case 26:
                    _e.sent();
                    console.log('Stream is agerestricted\nClicked "Start Watching" button\nReloading webpage');
                    return [4 /*yield*/, page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })];
                case 27:
                    _e.sent();
                    return [3 /*break*/, 29];
                case 28:
                    err_1 = _e.sent();
                    console.log("Stream is not agerestricted");
                    return [3 /*break*/, 29];
                case 29:
                    file = fs.createWriteStream("./videos/" + options.user + "-" + filename + ".webm");
                    return [4 /*yield*/, getStream(page, {
                            audio: recordAudio,
                            video: recordVideo
                        })];
                case 30:
                    stream = _e.sent();
                    recording_timer.start();
                    console.log("Now recording");
                    getTime();
                    console.log("Recording will stop when:\nStreamer goes offline / Streamer raids different stream / Streamer starts a rerun");
                    stream.pipe(file);
                    _e.label = 31;
                case 31: return [4 /*yield*/, checkIfLive()];
                case 32:
                    if (!((_e.sent()) == true)) return [3 /*break*/, 35];
                    if (originalUrl != page.url()) {
                        console.log("Stopping recording because streamer raided someone else");
                        return [3 /*break*/, 35];
                    }
                    return [4 /*yield*/, checkIfRerun()];
                case 33:
                    if ((_e.sent()) == true && rerunStream == false) {
                        console.log("Stream is a rerun");
                        return [3 /*break*/, 35];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 15000); })];
                case 34:
                    _e.sent();
                    return [3 /*break*/, 31];
                case 35: return [4 /*yield*/, stream.destroy()];
                case 36:
                    _e.sent();
                    stream.on("end", function () { });
                    recording_timer.stop();
                    console.log("Closing browser");
                    return [4 /*yield*/, browser.close()];
                case 37:
                    _e.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2500); })];
                case 38:
                    _e.sent();
                    console.log("FFmpeg encoding starting now.\nFps set to " + fps + "\nEncoding using " + threads + " threads\n");
                    if (!(windows == true)) return [3 /*break*/, 40];
                    return [4 /*yield*/, nrc.run("ffmpeg.exe -i videos/" + options.user + "-" + filename + ".webm -threads " + threads + " -r " + fps + " -c:v libx264 -crf 20 -preset fast videos/" + options.user + "-" + filename + fileExtenstion)];
                case 39:
                    _e.sent();
                    return [3 /*break*/, 42];
                case 40: return [4 /*yield*/, nrc.run("ffmpeg -i videos/" + options.user + "-" + filename + ".webm -threads " + threads + " -r " + fps + " -c:v libx264 -crf 20 -preset fast videos/" + options.user + "-" + filename + fileExtenstion)];
                case 41:
                    _e.sent();
                    _e.label = 42;
                case 42:
                    if (!(tempDelete == true)) return [3 /*break*/, 44];
                    console.log("Encoding has finished.\nDeleting temporary stream file.");
                    return [4 /*yield*/, fs.unlinkSync("./videos/" + options.user + "-" + filename + ".webm")];
                case 43:
                    _e.sent();
                    _e.label = 44;
                case 44: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2500); })];
                case 45:
                    _e.sent();
                    console.clear();
                    return [4 /*yield*/, printLogo()];
                case 46:
                    _e.sent();
                    console.log("\n\nYour file is ready. File:" + options.user + "-" + filename + ".mp4\n ");
                    timer.stop();
                    console.log(timer.format("Entire process took D:%d H:%h M:%m S:%s"));
                    console.log(recording_timer.format("Recorded for D:%d H:%h M:%m S:%s"));
                    if (loopRecording == false) {
                        process.exit();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
var checkIfLoop = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(loopRecording == true)) return [3 /*break*/, 3];
                return [4 /*yield*/, startRecording()];
            case 1:
                _a.sent();
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 7000); })];
            case 2:
                _a.sent();
                return [2 /*return*/, checkIfLoop()];
            case 3:
                startRecording();
                return [2 /*return*/];
        }
    });
}); };
checkIfLoop();
