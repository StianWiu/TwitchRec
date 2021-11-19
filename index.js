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
        .right("V1.8.6")
        .emptyLine()
        .center('Twitch recording software. Developed by Pignuuu. "--help" for options')
        .render());
};
printLogo();
var exec = require("child_process").exec;
var commander_1 = require("commander");
var process_1 = require("process");
var timer_node_1 = require("timer-node");
var program = new commander_1.Command();
var nrc = require("node-run-cmd");
var randomstring = require("randomstring");
var _a = require("puppeteer-stream"), launch = _a.launch, getStream = _a.getStream;
var fs = require("fs");
// Add options for command
program.requiredOption("-u, --user <string>", "Twitch user to record [Required]");
program.requiredOption("-w, --windows <boolean>", "Using Windows true or false [Required]");
program.option("-f, --frames <num>", "How many fps to export to [Optional]");
program.option("-t, --threads <num>", "How many threads to use when encoding [Optional]");
program.option("-r, --rerun <boolean>", "Record reruns [Optional]");
program.option("-d, --delete <boolean>", "Delete temp file [Optional]");
program.option("-l, --loop <boolean>", "Automatically wait for next stream [Optional]");
program.option("-a, --audio <boolean>", "Record audio [Optional]");
program.option("-v, --video <boolean>", "Record video [Optional]");
program.option("-c, --category <string>", "Only record certain category [Optional]");
program.option("-s, --silence <string>", "Cut out silence from final recording [Optional]");
program.option("-m, --max <num>", "Choose what the maximum filesize can be specify in GB [Optional]");
program.option("-o, --organize <boolean>", "Choose if file should be automatically sorted into folders [Optional]");
program.option("-ad, --skipAd <boolean>", "If program should wait 1 minute to avoid recording ads [Optional]");
program.option("-x, --experimental <boolean>", "If program should use fast method for encoding. NOT RECCOMENDED possible loss in quality and desync between audio and video [Optional]");
program.parse(process.argv);
var options = program.opts();
var user;
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
var maxSize;
var cutVideo;
var organizeFiles;
var skipAd;
var experimental;
var skipCutting;
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
    process_1.stdout.write("[INFO] " +
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
        "\n");
};
var checkConfiguration = function () {
    user = options.user.toLowerCase();
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
        process_1.stdout.write("[ERROR] Both audio and video can't be disabled\n");
        process.exit();
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
    if (options.max) {
        maxSize = options.max;
    }
    else {
        maxSize = undefined;
    }
    if (options.organize == "false") {
        organizeFiles = false;
    }
    else {
        organizeFiles = true;
    }
    if (options.skipAd == "false") {
        skipAd = false;
    }
    else {
        skipAd = true;
    }
    if (options.experimental == "true") {
        experimental = true;
    }
    else {
        experimental = false;
    }
};
checkConfiguration();
function startRecording() {
    return __awaiter(this, void 0, void 0, function () {
        var filename, timer, recording_timer, encoding_timer, browser, page, originalUrl, checkIfUserExists, checkIfLive, checkIfRerun, checkIfCorrect, checkContinueWithRerun, checkCategory, checkFileSize, printProgress, _a, _b, _c, _d, err_1, file, stream, _e, removeSilence, organize;
        var _this = this;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    process_1.stdout.write("[SETTING] Twitch Streamer: " + user + "\n");
                    process_1.stdout.write("[SETTING] Using windows: " + windows + "\n");
                    process_1.stdout.write("[SETTING] Frames Per Second: " + fps + "\n");
                    process_1.stdout.write("[SETTING] Threads: " + threads + "\n");
                    process_1.stdout.write("[SETTING] Record reruns: " + rerunEnable + "\n");
                    process_1.stdout.write("[SETTING] Delete temp file : " + tempDelete + "\n");
                    process_1.stdout.write("[SETTING] Wait for next stream: " + loopRecording + "\n");
                    process_1.stdout.write("[SETTING] Record audio: " + recordAudio + "\n");
                    process_1.stdout.write("[SETTING] Record Video: " + recordVideo + "\n");
                    process_1.stdout.write("[SETTING] Category: " + category + "\n");
                    process_1.stdout.write("[SETTING] Cut silence: " + silence + "\n");
                    process_1.stdout.write("[SETTING] Organize: " + organizeFiles + "\n");
                    process_1.stdout.write("[SETTING] Skip ad: " + skipAd + "\n");
                    process_1.stdout.write("[SETTING] Experimental encoding: " + experimental + "\n");
                    process_1.stdout.write("[SETTING] Max filesize: " + maxSize + "\n\n");
                    filename = randomstring.generate({
                        length: 10,
                        charset: "hex"
                    });
                    timer = new timer_node_1.Timer({ label: "main-timer" });
                    recording_timer = new timer_node_1.Timer({ label: "recording-timer" });
                    encoding_timer = new timer_node_1.Timer({ label: "encoding-timer" });
                    timer.start();
                    browser = undefined;
                    if (!(windows == true)) return [3 /*break*/, 2];
                    return [4 /*yield*/, launch({
                            executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe ",
                            defaultViewport: {
                                width: 1920,
                                height: 1080
                            },
                            ignoreDefaultArgs: ["--enable-automation"],
                            args: [" --start-fullscreen", "--disable-infobars", "--no-sandbox"]
                        })];
                case 1:
                    browser = _f.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, launch({
                        executablePath: "/usr/bin/google-chrome-stable",
                        defaultViewport: {
                            width: 1920,
                            height: 1080
                        },
                        ignoreDefaultArgs: ["--enable-automation"],
                        args: ["--start-fullscreen", "--disable-infobars", "--no-sandbox"]
                    })];
                case 3:
                    browser = _f.sent();
                    _f.label = 4;
                case 4:
                    process_1.stdout.write("[ACTION] Opening browser\n");
                    return [4 /*yield*/, browser.newPage()];
                case 5:
                    page = _f.sent();
                    process_1.stdout.write("[ACTION] Opening twitch stream\n");
                    return [4 /*yield*/, page.goto("https://www.twitch.tv/" + user)];
                case 6:
                    _f.sent();
                    originalUrl = page.url();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 7:
                    _f.sent();
                    checkIfUserExists = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, page.$("#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div.Layout-sc-nxg1ff-0.bDMqsP.core-error__message-container > p")];
                                case 1:
                                    if ((_a.sent()) !== null)
                                        return [2 /*return*/, true];
                                    else
                                        return [2 /*return*/, false];
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, checkIfUserExists()];
                case 8:
                    if (_f.sent()) {
                        process_1.stdout.write("[ERROR] User does not exist\n");
                        process.exit();
                    }
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
                    process_1.stdout.write("[INFO] Waiting for page to load\n");
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 9:
                    _f.sent();
                    checkIfCorrect = function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b, err_2;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 3, , 4]);
                                    _b = (_a = Promise).all;
                                    return [4 /*yield*/, page.click("#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--home.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP > div.channel-root__info.channel-root__info--offline.channel-root__info--home > div > div.Layout-sc-nxg1ff-0.bPMozh.home-header-sticky > div.Layout-sc-nxg1ff-0.Bza-dv > div > div > ul > li:nth-child(5) > a > div > div.ScTextWrapper-sc-18v7095-1.eFGtCR > div")];
                                case 1: return [4 /*yield*/, _b.apply(_a, [[
                                            _c.sent()
                                        ]])];
                                case 2:
                                    _c.sent();
                                    process_1.stdout.write('[ACTION] Clicked "Chat" button\n');
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_2 = _c.sent();
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, checkIfCorrect()];
                case 10:
                    _f.sent();
                    process_1.stdout.write("[ACTION] Checking if streamer is live\n");
                    return [4 /*yield*/, checkIfLive()];
                case 11:
                    if ((_f.sent()) == false) {
                        process_1.stdout.write("[INFO] Streamer is not live\n");
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
                    checkFileSize = function () { return __awaiter(_this, void 0, void 0, function () {
                        var stats, fileSizeInBytes, fileSizeInMegabytes, fileSizeInGigabytes;
                        return __generator(this, function (_a) {
                            try {
                                stats = fs.statSync("videos/" + user + "-" + filename + ".webm");
                                fileSizeInBytes = stats.size;
                                fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
                                fileSizeInGigabytes = fileSizeInMegabytes * 0.001;
                                return [2 /*return*/, fileSizeInGigabytes.toString().substring(0, 6)];
                            }
                            catch (err) { }
                            return [2 /*return*/];
                        });
                    }); };
                    printProgress = function (status) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
                        return __generator(this, function (_u) {
                            switch (_u.label) {
                                case 0:
                                    console.clear();
                                    if (!(status == "recording")) return [3 /*break*/, 3];
                                    _b = (_a = console).log;
                                    _e = (_d = logo({
                                        name: "Pignuuu",
                                        font: "Chunky",
                                        lineChars: 10,
                                        padding: 2,
                                        margin: 3
                                    })
                                        .emptyLine()
                                        .left("User: " + user)
                                        .emptyLine())
                                        .left;
                                    _f = "Filesize: ";
                                    return [4 /*yield*/, checkFileSize()];
                                case 1:
                                    _g = (_c = _e.apply(_d, [_f + (_u.sent()) + " GB"])
                                        .left("Running for: " + timer.format("D:%d H:%h M:%m S:%s"))
                                        .left("Recording: " + recording_timer.format("D:%d H:%h M:%m S:%s")))
                                        .left;
                                    _h = "Rerun: ";
                                    return [4 /*yield*/, checkIfRerun()];
                                case 2:
                                    _b.apply(_a, [_g.apply(_c, [_h + (_u.sent())])
                                            .render()]);
                                    return [3 /*break*/, 7];
                                case 3:
                                    if (!(status == "encoding")) return [3 /*break*/, 5];
                                    _k = (_j = console).log;
                                    _m = (_l = logo({
                                        name: "Pignuuu",
                                        font: "Chunky",
                                        lineChars: 10,
                                        padding: 2,
                                        margin: 3
                                    })
                                        .emptyLine()
                                        .left("User: " + user)
                                        .emptyLine())
                                        .left;
                                    _o = "Final filesize: ";
                                    return [4 /*yield*/, checkFileSize()];
                                case 4:
                                    _k.apply(_j, [_m.apply(_l, [_o + (_u.sent()) + " GB"])
                                            .left("Final recording time: " + recording_timer.format("D:%d H:%h M:%m S:%s"))
                                            .emptyLine()
                                            .center("Encoding has started this can take a while")
                                            .left("Threads: " + threads)
                                            .render()]);
                                    return [3 /*break*/, 7];
                                case 5:
                                    if (!(status == "slicing")) return [3 /*break*/, 7];
                                    _q = (_p = console).log;
                                    _s = (_r = logo({
                                        name: "Pignuuu",
                                        font: "Chunky",
                                        lineChars: 10,
                                        padding: 2,
                                        margin: 3
                                    })
                                        .emptyLine()
                                        .left("User: " + user)
                                        .emptyLine())
                                        .left;
                                    _t = "Final filesize: ";
                                    return [4 /*yield*/, checkFileSize()];
                                case 6:
                                    _q.apply(_p, [_s.apply(_r, [_t + (_u.sent()) + " GB"])
                                            .left("Final recording time: " + recording_timer.format("D:%d H:%h M:%m S:%s"))
                                            .emptyLine()
                                            .center("Slicing has started this can take a while")
                                            .render()]);
                                    _u.label = 7;
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, checkIfCorrect()];
                case 12:
                    _f.sent();
                    _f.label = 13;
                case 13: return [4 /*yield*/, checkIfLive()];
                case 14:
                    _b = (_f.sent()) == false;
                    if (_b) return [3 /*break*/, 16];
                    return [4 /*yield*/, checkContinueWithRerun()];
                case 15:
                    _b = (_f.sent()) == false;
                    _f.label = 16;
                case 16:
                    _a = _b;
                    if (_a) return [3 /*break*/, 18];
                    return [4 /*yield*/, checkCategory()];
                case 17:
                    _a = (_f.sent()) == false;
                    _f.label = 18;
                case 18:
                    if (!_a) return [3 /*break*/, 20];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 19:
                    _f.sent();
                    return [3 /*break*/, 13];
                case 20:
                    process_1.stdout.write("[ACTION] Checking if stream is a rerun\n");
                    return [4 /*yield*/, checkIfRerun()];
                case 21:
                    if ((_f.sent()) == true) {
                        process_1.stdout.write("[INFO] This stream is a rerun\n");
                        rerunStream = true;
                    }
                    else {
                        rerunStream = false;
                    }
                    process_1.stdout.write("[ACTION] Checking if stream is agerestricted\n");
                    _f.label = 22;
                case 22:
                    _f.trys.push([22, 25, , 26]);
                    _d = (_c = Promise).all;
                    return [4 /*yield*/, page.click("#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.InjectLayout-sc-588ddc-0.persistent-player > div > div.Layout-sc-nxg1ff-0.video-player > div > div > div > div > div.Layout-sc-nxg1ff-0.krOuYh.player-overlay-background.player-overlay-background--darkness-0.content-overlay-gate > div > div.Layout-sc-nxg1ff-0.bzQnIQ.content-overlay-gate__allow-pointers > button")];
                case 23: return [4 /*yield*/, _d.apply(_c, [[
                            _f.sent()
                        ]])];
                case 24:
                    _f.sent();
                    process_1.stdout.write('[INFO] Stream is agerestricted\n[ACTION]Clicked "Start Watching" button\n[ACTION] Reloading webpage\n');
                    return [3 /*break*/, 26];
                case 25:
                    err_1 = _f.sent();
                    process_1.stdout.write("[INFO] Stream is not agerestricted\n");
                    return [3 /*break*/, 26];
                case 26:
                    process_1.stdout.write("[ACTION] Changing resolution\n");
                    return [4 /*yield*/, page.click(".Layout-sc-nxg1ff-0:nth-child(2) > .Layout-sc-nxg1ff-0:nth-child(1) > .ScCoreButton-sc-1qn4ixc-0 > .ScButtonIconFigure-sc-o7ndmn-1 > .ScIconLayout-sc-1bgeryd-0 > .ScAspectRatio-sc-1sw3lwy-1 > .ScIconSVG-sc-1bgeryd-1")];
                case 27:
                    _f.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 250); })];
                case 28:
                    _f.sent();
                    return [4 /*yield*/, page.click(".Layout-sc-nxg1ff-0 > .Layout-sc-nxg1ff-0:nth-child(3) > .ScIconLayout-sc-1bgeryd-0 > .ScAspectRatio-sc-1sw3lwy-1 > .ScIconSVG-sc-1bgeryd-1")];
                case 29:
                    _f.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 250); })];
                case 30:
                    _f.sent();
                    return [4 /*yield*/, page.keyboard.press("Tab")];
                case 31:
                    _f.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 250); })];
                case 32:
                    _f.sent();
                    return [4 /*yield*/, page.keyboard.press("Tab")];
                case 33:
                    _f.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 250); })];
                case 34:
                    _f.sent();
                    return [4 /*yield*/, page.keyboard.press("ArrowDown")];
                case 35:
                    _f.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 36:
                    _f.sent();
                    process_1.stdout.write("[ACTION] Reloading webpage to make sure resolution changes\n");
                    return [4 /*yield*/, page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })];
                case 37:
                    _f.sent();
                    process_1.stdout.write("[ACTION] Fullscreening stream\n");
                    return [4 /*yield*/, page.keyboard.press("f")];
                case 38:
                    _f.sent();
                    file = fs.createWriteStream("./videos/" + user + "-" + filename + ".webm");
                    if (!(skipAd == true)) return [3 /*break*/, 40];
                    process_1.stdout.write("[INFO] Waiting for 1 minute to avoid ads\n");
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 60000); })];
                case 39:
                    _f.sent();
                    _f.label = 40;
                case 40: return [4 /*yield*/, getStream(page, {
                        audio: recordAudio,
                        video: recordVideo
                    })];
                case 41:
                    stream = _f.sent();
                    recording_timer.start();
                    process_1.stdout.write("[ACTION] Now recording\n");
                    getTime();
                    process_1.stdout.write("[INFO] Recording until:\nStreamer goes offline / Streamer raids different stream / Streamer starts a rerun\n");
                    stream.pipe(file);
                    _f.label = 42;
                case 42: return [4 /*yield*/, checkIfLive()];
                case 43:
                    if (!((_f.sent()) == true)) return [3 /*break*/, 49];
                    if (originalUrl != page.url()) {
                        process_1.stdout.write("[INFO] Stopping recording because streamer raided someone else\n");
                        return [3 /*break*/, 49];
                    }
                    return [4 /*yield*/, checkIfRerun()];
                case 44:
                    if ((_f.sent()) == true && rerunStream == false) {
                        process_1.stdout.write("[INFO] Stream is a rerun\n");
                        return [3 /*break*/, 49];
                    }
                    return [4 /*yield*/, checkCategory()];
                case 45:
                    if ((_f.sent()) != true) {
                        process_1.stdout.write("[INFO] Category was changed\n");
                        return [3 /*break*/, 49];
                    }
                    _e = maxSize != undefined;
                    if (!_e) return [3 /*break*/, 47];
                    return [4 /*yield*/, checkFileSize()];
                case 46:
                    _e = (_f.sent()) >= maxSize;
                    _f.label = 47;
                case 47:
                    if (_e) {
                        process_1.stdout.write("[INFO] File size reached max size\n");
                        return [3 /*break*/, 49];
                    }
                    printProgress("recording");
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2500); })];
                case 48:
                    _f.sent();
                    return [3 /*break*/, 42];
                case 49: return [4 /*yield*/, stream.destroy()];
                case 50:
                    _f.sent();
                    recording_timer.stop();
                    process_1.stdout.write("[ACTION] Closing browser\n");
                    return [4 /*yield*/, browser.close()];
                case 51:
                    _f.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2500); })];
                case 52:
                    _f.sent();
                    process_1.stdout.write("[ACTION] FFmpeg encoding starting now.\nFps set to " + fps + "\nEncoding using " + threads + " threads\n");
                    encoding_timer.start();
                    printProgress("encoding");
                    if (!(experimental == true)) return [3 /*break*/, 57];
                    if (!(windows == true)) return [3 /*break*/, 54];
                    return [4 /*yield*/, nrc.run("ffmpeg.exe -i videos/" + user + "-" + filename + ".webm -c:v copy -c:a aac -strict experimental videos/" + user + "-" + filename + fileExtenstion)];
                case 53:
                    _f.sent();
                    return [3 /*break*/, 56];
                case 54: return [4 /*yield*/, nrc.run("ffmpeg.exe -i videos/" + user + "-" + filename + ".webm -c:v copy -c:a aac -strict experimental videos/" + user + "-" + filename + fileExtenstion)];
                case 55:
                    _f.sent();
                    _f.label = 56;
                case 56: return [3 /*break*/, 61];
                case 57:
                    if (!(windows == true)) return [3 /*break*/, 59];
                    return [4 /*yield*/, nrc.run("ffmpeg.exe -i videos/" + user + "-" + filename + ".webm -threads " + threads + " -r " + fps + " -c:v libx264 -crf 20 -preset fast videos/" + user + "-" + filename + fileExtenstion)];
                case 58:
                    _f.sent();
                    return [3 /*break*/, 61];
                case 59: return [4 /*yield*/, nrc.run("ffmpeg -i videos/" + user + "-" + filename + ".webm -threads " + threads + " -r " + fps + " -c:v libx264 -crf 20 -preset fast videos/" + user + "-" + filename + fileExtenstion)];
                case 60:
                    _f.sent();
                    _f.label = 61;
                case 61:
                    encoding_timer.stop();
                    if (!(tempDelete == true)) return [3 /*break*/, 63];
                    process_1.stdout.write("[INFO] Encoding has finished.\n[ACTION] Deleting temporary stream file\n");
                    return [4 /*yield*/, fs.unlinkSync("./videos/" + user + "-" + filename + ".webm")];
                case 62:
                    _f.sent();
                    _f.label = 63;
                case 63:
                    removeSilence = function () { return __awaiter(_this, void 0, void 0, function () {
                        var getList;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    process_1.stdout.write("[ACTION] Listing all silence in video\n");
                                    return [4 /*yield*/, exec("ffmpeg -i videos/" + user + "-" + filename + fileExtenstion + " -af silencedetect=noise=0.0001 -f null - 2> silence.txt")];
                                case 1:
                                    getList = _a.sent();
                                    return [4 /*yield*/, new Promise(function (resolve) {
                                            getList.on("close", function () {
                                                var e_1, _a;
                                                return __awaiter(this, void 0, void 0, function () {
                                                    var readline, readInterface, i, o, start, end, endtime, readInterface_1, readInterface_1_1, line, e_1_1, logger, d, rounds, k, continueCutting, cut, final, err_5;
                                                    return __generator(this, function (_b) {
                                                        switch (_b.label) {
                                                            case 0:
                                                                printProgress("slicing");
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
                                                                process_1.stdout.write("[INFO] Cuts: " + rounds + "\n");
                                                                if (!(rounds != 0)) return [3 /*break*/, 31];
                                                                d = 0;
                                                                _b.label = 13;
                                                            case 13:
                                                                if (!(d < end.length)) return [3 /*break*/, 28];
                                                                continueCutting = false;
                                                                process_1.stdout.write("[ACTION] Cutting " + end[d] + " - " + start[d] + "\n");
                                                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                                            case 14:
                                                                _b.sent();
                                                                cut = void 0;
                                                                if (!(experimental == true)) return [3 /*break*/, 19];
                                                                if (!(start[d] == 0)) return [3 /*break*/, 16];
                                                                return [4 /*yield*/, exec("ffmpeg -t 1 -i videos/" + user + "-" + filename + fileExtenstion + " -r " + fps + "  -c:v copy -ss " + end[d] + " pieces/piece" + d + ".mp4")];
                                                            case 15:
                                                                cut = _b.sent();
                                                                return [3 /*break*/, 18];
                                                            case 16: return [4 /*yield*/, exec("ffmpeg -t " + start[d] + " -i videos/" + user + "-" + filename + fileExtenstion + "  -c:v copy -r " + fps + " -ss " + end[d] + " pieces/piece" + d + ".mp4")];
                                                            case 17:
                                                                cut = _b.sent();
                                                                _b.label = 18;
                                                            case 18: return [3 /*break*/, 23];
                                                            case 19:
                                                                if (!(start[d] == 0)) return [3 /*break*/, 21];
                                                                return [4 /*yield*/, exec("ffmpeg -t 1 -i videos/" + user + "-" + filename + fileExtenstion + " -r " + fps + " -ss " + end[d] + " pieces/piece" + d + ".mp4")];
                                                            case 20:
                                                                cut = _b.sent();
                                                                return [3 /*break*/, 23];
                                                            case 21: return [4 /*yield*/, exec("ffmpeg -t " + start[d] + " -i videos/" + user + "-" + filename + fileExtenstion + " -r " + fps + " -ss " + end[d] + " pieces/piece" + d + ".mp4")];
                                                            case 22:
                                                                cut = _b.sent();
                                                                _b.label = 23;
                                                            case 23:
                                                                cut.on("close", function () {
                                                                    return __awaiter(this, void 0, void 0, function () {
                                                                        return __generator(this, function (_a) {
                                                                            continueCutting = true;
                                                                            return [2 /*return*/];
                                                                        });
                                                                    });
                                                                });
                                                                _b.label = 24;
                                                            case 24:
                                                                if (!(continueCutting == false)) return [3 /*break*/, 26];
                                                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                                            case 25:
                                                                _b.sent();
                                                                return [3 /*break*/, 24];
                                                            case 26:
                                                                logger.write("file pieces/piece" + d + ".mp4\n");
                                                                _b.label = 27;
                                                            case 27:
                                                                d++;
                                                                return [3 /*break*/, 13];
                                                            case 28: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                                                            case 29:
                                                                _b.sent();
                                                                process_1.stdout.write("[ACTION] Piecing video together\n");
                                                                return [4 /*yield*/, exec("ffmpeg -f concat -safe 0 -i pieces.txt -c copy videos/" + user + "-" + filename + "-cut" + fileExtenstion)];
                                                            case 30:
                                                                final = _b.sent();
                                                                final.on("close", function () {
                                                                    return __awaiter(this, void 0, void 0, function () {
                                                                        var d_1;
                                                                        return __generator(this, function (_a) {
                                                                            switch (_a.label) {
                                                                                case 0:
                                                                                    process_1.stdout.write("[ACTION] Deleting cut up and temporary files\n");
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
                                                                                    return [4 /*yield*/, fs.unlinkSync("./videos/" + user + "-" + filename + fileExtenstion)];
                                                                                case 8:
                                                                                    _a.sent();
                                                                                    _a.label = 9;
                                                                                case 9:
                                                                                    cutVideo = true;
                                                                                    resolve("");
                                                                                    return [2 /*return*/];
                                                                            }
                                                                        });
                                                                    });
                                                                });
                                                                return [3 /*break*/, 38];
                                                            case 31:
                                                                process_1.stdout.write("[INFO] Skipping all cuts since video has little to no silence\n");
                                                                skipCutting = true;
                                                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                                                            case 32:
                                                                _b.sent();
                                                                _b.label = 33;
                                                            case 33:
                                                                _b.trys.push([33, 36, , 37]);
                                                                return [4 /*yield*/, fs.unlinkSync("pieces.txt")];
                                                            case 34:
                                                                _b.sent();
                                                                return [4 /*yield*/, fs.unlinkSync("silence.txt")];
                                                            case 35:
                                                                _b.sent();
                                                                return [3 /*break*/, 37];
                                                            case 36:
                                                                err_5 = _b.sent();
                                                                return [3 /*break*/, 37];
                                                            case 37:
                                                                resolve("");
                                                                _b.label = 38;
                                                            case 38: return [2 /*return*/];
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
                    organize = function () { return __awaiter(_this, void 0, void 0, function () {
                        var outputName;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fs.existsSync("./videos/" + user)];
                                case 1:
                                    if (!!(_a.sent())) return [3 /*break*/, 3];
                                    return [4 /*yield*/, fs.mkdirSync("./videos/" + user)];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    if (silence == true && skipCutting != true) {
                                        outputName = user + "-" + filename + "-cut" + fileExtenstion;
                                    }
                                    else {
                                        outputName = user + "-" + filename + fileExtenstion;
                                    }
                                    fs.rename("./videos/" + outputName, "./videos/" + user + "/" + outputName, function (err) {
                                        if (err) {
                                            throw err;
                                        }
                                        else {
                                        }
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    if (!(silence == true)) return [3 /*break*/, 65];
                    return [4 /*yield*/, removeSilence()];
                case 64:
                    _f.sent();
                    _f.label = 65;
                case 65:
                    if (!(organizeFiles == true)) return [3 /*break*/, 67];
                    return [4 /*yield*/, organize()];
                case 66:
                    _f.sent();
                    _f.label = 67;
                case 67: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2500); })];
                case 68:
                    _f.sent();
                    console.clear();
                    return [4 /*yield*/, printLogo()];
                case 69:
                    _f.sent();
                    if (cutVideo == true) {
                        process_1.stdout.write("\n\nYour file is ready. File:" + user + "-" + filename + "-cut.mp4\n");
                    }
                    else {
                        process_1.stdout.write("\n\nYour file is ready. File:" + user + "-" + filename + ".mp4\n");
                    }
                    timer.stop();
                    process_1.stdout.write(timer.format("[INFO] Entire process took D:%d H:%h M:%m S:%s\n"));
                    process_1.stdout.write(recording_timer.format("[INFO] Recorded for D:%d H:%h M:%m S:%s\n"));
                    process_1.stdout.write(encoding_timer.format("[INFO] Encoded for D:%d H:%h M:%m S:%s\n"));
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
