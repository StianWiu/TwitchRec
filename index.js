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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
        .right("V1.6.0")
        .emptyLine()
        .center('Twitch recording software. Developed by Pignuuu. "--help" for options')
        .render());
};
printLogo();
var exec = require("child_process").exec;
var commander_1 = require("commander");
var timer_node_1 = require("timer-node");
var program = new commander_1.Command();
var randomstring = require("randomstring");
var nrc = require("node-run-cmd");
var _a = require("puppeteer-stream"), launch = _a.launch, getStream = _a.getStream;
var fs = require("fs");
var Spinner = require("cli-spinner").Spinner;
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
program.option("-w, --windows <boolean>", "Using Windows true or false [Required]");
program.option("-f, --frames <num>", "How many fps to export to [Optional]");
program.option("-t, --threads <num>", "How many threads to use when encoding [Optional]");
program.option("-r, --rerun <boolean>", "Record reruns [Optional]");
program.option("-d, --delete <boolean>", "Delete temp file [Optional]");
program.option("-l, --loop <boolean>", "Automatically wait for next stream [Optional]");
program.option("-a, --audio <boolean>", "Record audio [Optional]");
program.option("-v, --video <boolean>", "Record video [Optional]");
program.option("-c, --category <string>", "Only record certain category [Optional]");
program.option("-s, --silence <string>", "Cut out silence from final recording [Optional]");
program.parse(process.argv);
var options = program.opts();
var windows;
var fps;
var threads;
var rerunStream;
var rerunEnable;
var tempDelete;
var loopRecording;
var recordAudio;
var recordVideo;
var fileExtenstion = ".mp4";
var category;
var silence;
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
            if (options.silence == "true") {
                silence = true;
            }
            else {
                silence = false;
            }
            if (options.category) {
                category = options.category.toLowerCase();
            }
            else {
                category = "undefined";
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
        var filename, timer, recording_timer, encoding_timer, spinner, browser, page, originalUrl, checkIfCorrect, checkIfLive, checkIfRerun, checkContinueWithRerun, checkCategory, _a, _b, err_1, page_1, _c, _d, err_2, file, stream, removeSilence;
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
                    console.log("Record Video: " + recordVideo);
                    console.log("Category: " + category);
                    console.log("Cut silence: " + silence + "\n");
                    filename = randomstring.generate({
                        length: 10,
                        charset: "hex"
                    });
                    timer = new timer_node_1.Timer({ label: "main-timer" });
                    recording_timer = new timer_node_1.Timer({ label: "recording-timer" });
                    encoding_timer = new timer_node_1.Timer({ label: "encoding-timer" });
                    timer.start();
                    spinner = new Spinner("%s ");
                    spinner.setSpinnerString("|/-\\");
                    spinner.setSpinnerDelay(400);
                    browser = undefined;
                    if (!(windows == true)) return [3 /*break*/, 2];
                    return [4 /*yield*/, launch({
                            executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe ",
                            defaultViewport: {
                                width: 1920,
                                height: 1080
                            },
                            ignoreDefaultArgs: ["--enable-automation"],
                            args: ["--start-fullscreen", "--disable-infobars"]
                        })];
                case 1:
                    browser = _e.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, launch({
                        executablePath: "/usr/bin/google-chrome-stable",
                        defaultViewport: {
                            width: 1024,
                            height: 768
                        },
                        ignoreDefaultArgs: ["--enable-automation"],
                        args: ["--start-fullscreen", "--disable-infobars"]
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
                        var _a, _b, err_3;
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
                                    err_3 = _c.sent();
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
                        var value1, value2, element1, err_4, element2, err_5;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (category == "undefined") {
                                        return [2 /*return*/, true];
                                    }
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
                                    err_4 = _a.sent();
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
                                    err_5 = _a.sent();
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
                    if (!_a) return [3 /*break*/, 27];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 60000); })];
                case 17:
                    _e.sent();
                    _e.label = 18;
                case 18:
                    _e.trys.push([18, 20, , 25]);
                    return [4 /*yield*/, page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })];
                case 19:
                    _e.sent();
                    return [3 /*break*/, 25];
                case 20:
                    err_1 = _e.sent();
                    console.log("Timedout reopening browser");
                    browser.close();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 21:
                    _e.sent();
                    console.log("Opening browser.");
                    return [4 /*yield*/, browser.newPage()];
                case 22:
                    page_1 = _e.sent();
                    console.log("Opening twitch stream");
                    return [4 /*yield*/, page_1.goto("https://www.twitch.tv/" + options.user)];
                case 23:
                    _e.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 24:
                    _e.sent();
                    return [3 /*break*/, 25];
                case 25: return [4 /*yield*/, checkIfCorrect()];
                case 26:
                    _e.sent();
                    return [3 /*break*/, 11];
                case 27:
                    console.log("Checking if stream is a rerun");
                    return [4 /*yield*/, checkIfRerun()];
                case 28:
                    if ((_e.sent()) == true) {
                        console.log("This stream is a rerun");
                        rerunStream = true;
                    }
                    else {
                        rerunStream = false;
                    }
                    console.log("Reloading webpage");
                    return [4 /*yield*/, page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })];
                case 29:
                    _e.sent();
                    console.log("Checking if stream is agerestricted");
                    _e.label = 30;
                case 30:
                    _e.trys.push([30, 34, , 35]);
                    _d = (_c = Promise).all;
                    return [4 /*yield*/, page.click("#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.InjectLayout-sc-588ddc-0.persistent-player > div > div.Layout-sc-nxg1ff-0.video-player > div > div > div > div > div.Layout-sc-nxg1ff-0.krOuYh.player-overlay-background.player-overlay-background--darkness-0.content-overlay-gate > div > div.Layout-sc-nxg1ff-0.bzQnIQ.content-overlay-gate__allow-pointers > button")];
                case 31: return [4 /*yield*/, _d.apply(_c, [[
                            _e.sent()
                        ]])];
                case 32:
                    _e.sent();
                    return [4 /*yield*/, page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })];
                case 33:
                    _e.sent();
                    console.log('Stream is agerestricted\nClicked "Start Watching" button\nReloading webpage');
                    return [3 /*break*/, 35];
                case 34:
                    err_2 = _e.sent();
                    console.log("Stream is not agerestricted");
                    return [3 /*break*/, 35];
                case 35:
                    console.log("Changing resolution");
                    return [4 /*yield*/, page.click(".Layout-sc-nxg1ff-0:nth-child(2) > .Layout-sc-nxg1ff-0:nth-child(1) > .ScCoreButton-sc-1qn4ixc-0 > .ScButtonIconFigure-sc-o7ndmn-1 > .ScIconLayout-sc-1bgeryd-0 > .ScAspectRatio-sc-1sw3lwy-1 > .ScIconSVG-sc-1bgeryd-1")];
                case 36:
                    _e.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 250); })];
                case 37:
                    _e.sent();
                    return [4 /*yield*/, page.click(".Layout-sc-nxg1ff-0 > .Layout-sc-nxg1ff-0:nth-child(3) > .ScIconLayout-sc-1bgeryd-0 > .ScAspectRatio-sc-1sw3lwy-1 > .ScIconSVG-sc-1bgeryd-1")];
                case 38:
                    _e.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 250); })];
                case 39:
                    _e.sent();
                    return [4 /*yield*/, page.keyboard.press("Tab")];
                case 40:
                    _e.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 250); })];
                case 41:
                    _e.sent();
                    return [4 /*yield*/, page.keyboard.press("Tab")];
                case 42:
                    _e.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 250); })];
                case 43:
                    _e.sent();
                    return [4 /*yield*/, page.keyboard.press("ArrowDown")];
                case 44:
                    _e.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 45:
                    _e.sent();
                    console.log("Reloading webpage to make sure resolution changes");
                    return [4 /*yield*/, page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })];
                case 46:
                    _e.sent();
                    console.log("Fullscreening stream");
                    return [4 /*yield*/, page.keyboard.press("f")];
                case 47:
                    _e.sent();
                    file = fs.createWriteStream("./videos/" + options.user + "-" + filename + ".webm");
                    return [4 /*yield*/, getStream(page, {
                            audio: recordAudio,
                            video: recordVideo
                        })];
                case 48:
                    stream = _e.sent();
                    recording_timer.start();
                    console.log("Now recording");
                    getTime();
                    console.log("Recording until:\nStreamer goes offline / Streamer raids different stream / Streamer starts a rerun");
                    spinner.start();
                    stream.pipe(file);
                    _e.label = 49;
                case 49: return [4 /*yield*/, checkIfLive()];
                case 50:
                    if (!((_e.sent()) == true)) return [3 /*break*/, 54];
                    if (originalUrl != page.url()) {
                        console.log("Stopping recording because streamer raided someone else");
                        return [3 /*break*/, 54];
                    }
                    return [4 /*yield*/, checkIfRerun()];
                case 51:
                    if ((_e.sent()) == true && rerunStream == false) {
                        console.log("Stream is a rerun");
                        return [3 /*break*/, 54];
                    }
                    return [4 /*yield*/, checkCategory()];
                case 52:
                    if ((_e.sent()) != true) {
                        console.log("Category was changed");
                        return [3 /*break*/, 54];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2500); })];
                case 53:
                    _e.sent();
                    return [3 /*break*/, 49];
                case 54:
                    spinner.stop();
                    return [4 /*yield*/, stream.destroy()];
                case 55:
                    _e.sent();
                    recording_timer.stop();
                    console.log("Closing browser");
                    return [4 /*yield*/, browser.close()];
                case 56:
                    _e.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2500); })];
                case 57:
                    _e.sent();
                    console.log("FFmpeg encoding starting now.\nFps set to " + fps + "\nEncoding using " + threads + " threads\n");
                    encoding_timer.start();
                    spinner.start();
                    if (!(windows == true)) return [3 /*break*/, 59];
                    return [4 /*yield*/, nrc.run("ffmpeg.exe -i videos/" + options.user + "-" + filename + ".webm -threads " + threads + " -r " + fps + " -c:v libx264 -crf 20 -preset fast videos/" + options.user + "-" + filename + fileExtenstion)];
                case 58:
                    _e.sent();
                    return [3 /*break*/, 61];
                case 59: return [4 /*yield*/, nrc.run("ffmpeg -i videos/" + options.user + "-" + filename + ".webm -threads " + threads + " -r " + fps + " -c:v libx264 -crf 20 -preset fast videos/" + options.user + "-" + filename + fileExtenstion)];
                case 60:
                    _e.sent();
                    _e.label = 61;
                case 61:
                    encoding_timer.stop();
                    spinner.stop();
                    if (!(tempDelete == true)) return [3 /*break*/, 63];
                    console.log("Encoding has finished.\nDeleting temporary stream file.");
                    return [4 /*yield*/, fs.unlinkSync("./videos/" + options.user + "-" + filename + ".webm")];
                case 62:
                    _e.sent();
                    _e.label = 63;
                case 63:
                    removeSilence = function () { return __awaiter(_this, void 0, void 0, function () {
                        var getList;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("Listing all silence in video");
                                    return [4 /*yield*/, exec("ffmpeg -i videos/" + options.user + "-" + filename + fileExtenstion + " -af silencedetect=noise=0.0001 -f null - 2> silence.txt")];
                                case 1:
                                    getList = _a.sent();
                                    return [4 /*yield*/, new Promise(function (resolve) {
                                            getList.on("close", function () {
                                                var e_1, _a;
                                                return __awaiter(this, void 0, void 0, function () {
                                                    var readline, readInterface, i, o, start, end, endtime, readInterface_1, readInterface_1_1, line, e_1_1, logger, d, rounds, k, continueCutting, cut, final;
                                                    return __generator(this, function (_b) {
                                                        switch (_b.label) {
                                                            case 0:
                                                                readline = require("readline");
                                                                readInterface = readline.createInterface({
                                                                    input: fs.createReadStream("silence.txt"),
                                                                    console: false
                                                                });
                                                                i = 0;
                                                                o = 1;
                                                                start = [];
                                                                end = [];
                                                                end[0] = 0;
                                                                _b.label = 1;
                                                            case 1:
                                                                _b.trys.push([1, 6, 7, 12]);
                                                                readInterface_1 = __asyncValues(readInterface);
                                                                _b.label = 2;
                                                            case 2: return [4 /*yield*/, readInterface_1.next()];
                                                            case 3:
                                                                if (!(readInterface_1_1 = _b.sent(), !readInterface_1_1.done)) return [3 /*break*/, 5];
                                                                line = readInterface_1_1.value;
                                                                if (line.includes("silencedetect")) {
                                                                    if (line.includes("start")) {
                                                                        line = line.substring(line.indexOf(":") + 1).replace(" ", "");
                                                                        line = line.split("|")[0];
                                                                        start[i] = line;
                                                                        i++;
                                                                    }
                                                                    else {
                                                                        line = line.substring(line.indexOf(":") + 1).replace(" ", "");
                                                                        line = line.split("|")[0];
                                                                        end[o] = line;
                                                                        o++;
                                                                    }
                                                                }
                                                                else if (line.includes("Duration:")) {
                                                                    line = line.substring(line.indexOf(":") + 1).replace(" ", "");
                                                                    line = line.split(",")[0];
                                                                    endtime = line;
                                                                }
                                                                _b.label = 4;
                                                            case 4: return [3 /*break*/, 2];
                                                            case 5: return [3 /*break*/, 12];
                                                            case 6:
                                                                e_1_1 = _b.sent();
                                                                e_1 = { error: e_1_1 };
                                                                return [3 /*break*/, 12];
                                                            case 7:
                                                                _b.trys.push([7, , 10, 11]);
                                                                if (!(readInterface_1_1 && !readInterface_1_1.done && (_a = readInterface_1["return"]))) return [3 /*break*/, 9];
                                                                return [4 /*yield*/, _a.call(readInterface_1)];
                                                            case 8:
                                                                _b.sent();
                                                                _b.label = 9;
                                                            case 9: return [3 /*break*/, 11];
                                                            case 10:
                                                                if (e_1) throw e_1.error;
                                                                return [7 /*endfinally*/];
                                                            case 11: return [7 /*endfinally*/];
                                                            case 12:
                                                                logger = fs.createWriteStream("pieces.txt", {
                                                                    flags: "a"
                                                                });
                                                                start.push(endtime);
                                                                for (k = 0; k < end.length; k++) {
                                                                    rounds = k;
                                                                }
                                                                console.log("Cuts: " + rounds);
                                                                if (!(rounds > 1)) return [3 /*break*/, 26];
                                                                d = 0;
                                                                _b.label = 13;
                                                            case 13:
                                                                if (!(d < end.length)) return [3 /*break*/, 23];
                                                                continueCutting = false;
                                                                console.log("Cutting " + end[d] + " - " + start[d]);
                                                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                                            case 14:
                                                                _b.sent();
                                                                cut = void 0;
                                                                if (!(start[d] == 0)) return [3 /*break*/, 16];
                                                                return [4 /*yield*/, exec("ffmpeg -t 1 -i videos/" + options.user + "-" + filename + fileExtenstion + " -r " + fps + " -ss " + end[d] + " pieces/piece" + d + ".mp4")];
                                                            case 15:
                                                                cut = _b.sent();
                                                                return [3 /*break*/, 18];
                                                            case 16: return [4 /*yield*/, exec("ffmpeg -t " + start[d] + " -i videos/" + options.user + "-" + filename + fileExtenstion + " -r " + fps + " -ss " + end[d] + " pieces/piece" + d + ".mp4")];
                                                            case 17:
                                                                cut = _b.sent();
                                                                _b.label = 18;
                                                            case 18:
                                                                cut.on("close", function () {
                                                                    return __awaiter(this, void 0, void 0, function () {
                                                                        return __generator(this, function (_a) {
                                                                            continueCutting = true;
                                                                            return [2 /*return*/];
                                                                        });
                                                                    });
                                                                });
                                                                _b.label = 19;
                                                            case 19:
                                                                if (!(continueCutting == false)) return [3 /*break*/, 21];
                                                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                                            case 20:
                                                                _b.sent();
                                                                return [3 /*break*/, 19];
                                                            case 21:
                                                                logger.write("file pieces/piece" + d + ".mp4\n");
                                                                _b.label = 22;
                                                            case 22:
                                                                d++;
                                                                return [3 /*break*/, 13];
                                                            case 23: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                                                            case 24:
                                                                _b.sent();
                                                                console.log("Piecing video together");
                                                                return [4 /*yield*/, exec("ffmpeg -f concat -safe 0 -i pieces.txt -c copy videos/" + options.user + "-" + filename + "-cut" + fileExtenstion)];
                                                            case 25:
                                                                final = _b.sent();
                                                                final.on("close", function () {
                                                                    return __awaiter(this, void 0, void 0, function () {
                                                                        var d_1;
                                                                        return __generator(this, function (_a) {
                                                                            switch (_a.label) {
                                                                                case 0:
                                                                                    console.log("Deleting cut up and temporary files");
                                                                                    d_1 = 0;
                                                                                    _a.label = 1;
                                                                                case 1:
                                                                                    if (!(d_1 < end.length)) return [3 /*break*/, 5];
                                                                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                                                                case 2:
                                                                                    _a.sent();
                                                                                    return [4 /*yield*/, fs.unlinkSync("pieces/piece" + d_1 + ".mp4")];
                                                                                case 3:
                                                                                    _a.sent();
                                                                                    _a.label = 4;
                                                                                case 4:
                                                                                    d_1++;
                                                                                    return [3 /*break*/, 1];
                                                                                case 5: return [4 /*yield*/, fs.unlinkSync("pieces.txt")];
                                                                                case 6:
                                                                                    _a.sent();
                                                                                    return [4 /*yield*/, fs.unlinkSync("silence.txt")];
                                                                                case 7:
                                                                                    _a.sent();
                                                                                    if (!(tempDelete == true)) return [3 /*break*/, 9];
                                                                                    return [4 /*yield*/, fs.unlinkSync("./videos/" + options.user + "-" + filename + fileExtenstion)];
                                                                                case 8:
                                                                                    _a.sent();
                                                                                    _a.label = 9;
                                                                                case 9:
                                                                                    resolve("");
                                                                                    return [2 /*return*/];
                                                                            }
                                                                        });
                                                                    });
                                                                });
                                                                return [3 /*break*/, 27];
                                                            case 26:
                                                                console.log("Skipping all cuts since video has little to no silence");
                                                                resolve("");
                                                                _b.label = 27;
                                                            case 27: return [2 /*return*/];
                                                        }
                                                    });
                                                });
                                            });
                                        })];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    if (!(silence == true)) return [3 /*break*/, 65];
                    return [4 /*yield*/, removeSilence()];
                case 64:
                    _e.sent();
                    _e.label = 65;
                case 65: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2500); })];
                case 66:
                    _e.sent();
                    console.clear();
                    return [4 /*yield*/, printLogo()];
                case 67:
                    _e.sent();
                    console.log("\n\nYour file is ready. File:" + options.user + "-" + filename + ".mp4\n ");
                    timer.stop();
                    console.log(timer.format("Entire process took D:%d H:%h M:%m S:%s"));
                    console.log(recording_timer.format("Recorded for D:%d H:%h M:%m S:%s"));
                    console.log(encoding_timer.format("Encoded for D:%d H:%h M:%m S:%s"));
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
