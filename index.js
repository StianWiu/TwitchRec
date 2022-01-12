#!/usr/bin/env node
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
try {
    require("asciiart-logo");
    require("axios");
    require("bug-killer");
    require("commander");
    require("enquirer");
    require("m3u8stream");
    require("puppeteer");
    require("randomstring");
    require("timer-node");
    require("fs");
    require("twitch-m3u8");
}
catch (error) {
    console.log("\x1b[31m%s", "\n\nPlease install the required dependencies by running npm install. Exiting...\n\n");
    process.exit(1);
}
var fs = require("fs"), puppeteer = require("puppeteer"), m3u8stream = require("m3u8stream"), randomstring = require("randomstring"), logo = require("asciiart-logo"), Logger = require("bug-killer"), m3u8Info = require("twitch-m3u8"), axios = require("axios"), Confirm = require("enquirer").Confirm;
// Set configuration for Logger(bug-killer) node module
Logger.config = {
    // The error type
    error: {
        color: [192, 57, 43],
        text: "error",
        level: 1
    },
    // The warning type
    warn: {
        color: [241, 196, 15],
        text: "warn ",
        level: 2
    },
    // The info type
    info: {
        color: [52, 152, 219],
        text: "info ",
        level: 3
    },
    action: {
        color: [88, 232, 95],
        text: "action ",
        level: 3
    },
    // Display date
    date: false,
    // Log level
    level: 4,
    // Output stream
    stream: process.stdout,
    // The options passed to `util.inspect`
    inspectOptions: { colors: true }
};
// Generate a random string for the file name
var filename = randomstring.generate({
    length: 10,
    charset: "hex"
});
var commander_1 = require("commander");
var timer_node_1 = require("timer-node");
var program = new commander_1.Command();
var user, rerunEnable, category, maxSize, link, loopProgram, directoryPath, selectedQuality;
var timer = new timer_node_1.Timer({ label: "main-timer" });
var recording_timer = new timer_node_1.Timer({ label: "recording-timer" });
timer.start();
var printLogo = function () {
    console.log(logo({
        name: "TwitchRec",
        font: "Chunky",
        lineChars: 10,
        padding: 2,
        margin: 3
    })
        .emptyLine()
        .emptyLine()
        .center('Twitch recording software. Developed by Pignuuu. "--help" for options')
        .center("https://stianwiu.me")
        .render());
};
printLogo();
program.requiredOption("-u, --user <string>", "Twitch username");
program.option("-r, --rerun <boolean>", "Should the program record reruns");
program.option("-c, --category <string>", "Only record certain category");
program.option("-m, --max <num>", "How many GB file can become");
program.option("-l, --loop <boolean>", "Weather program should infinitely loop when stream is over");
program.option("-y, --yes", "Skip settings confirmation");
program.option("-d, --directory <string>", "Where to save the files produced");
program.option("-q, --quality <num>", "What quality to record at, 0 is highest");
program.parse(process.argv);
var options = program.opts();
var checkConfiguration = function () { return __awaiter(void 0, void 0, void 0, function () {
    var prompt_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = options.user.toLowerCase();
                if (options.rerun == "false") {
                    rerunEnable = false;
                }
                else {
                    rerunEnable = true;
                }
                if (options.category) {
                    category = options.category.toLowerCase();
                }
                else {
                    category = "disabled";
                }
                if (options.max) {
                    maxSize = Number(options.max) + "GB";
                }
                else {
                    maxSize = "disabled";
                }
                if (options.quality) {
                    selectedQuality = options.quality;
                }
                else {
                    selectedQuality = 0;
                }
                if (options.loop == "true") {
                    loopProgram = true;
                }
                else {
                    loopProgram = false;
                }
                if (options.directory) {
                    directoryPath = options.directory;
                    if (directoryPath.substr(directoryPath.length - 1) != "/") {
                        directoryPath = directoryPath + "/";
                    }
                    try {
                        fs.accessSync(directoryPath, fs.constants.W_OK);
                    }
                    catch (err) {
                        Logger.log("Couldn't find or couldn't write to ".concat(directoryPath), "error");
                        process.exit();
                    }
                }
                else {
                    directoryPath = "./";
                }
                console.clear();
                if (!!options.yes) return [3 /*break*/, 2];
                console.log(logo({
                    name: "Settings",
                    font: "Chunky",
                    lineChars: 10,
                    padding: 2,
                    margin: 3
                })
                    .emptyLine()
                    .center("Are these settings correct?")
                    .emptyLine()
                    .left("Username: ".concat(user))
                    .left("Reruns: ".concat(rerunEnable))
                    .left("Category: ".concat(category))
                    .left("Max size: ".concat(maxSize))
                    .left("Loop: ".concat(loopProgram))
                    .left("Directory: ".concat(directoryPath))
                    .left("Quality: ".concat(selectedQuality))
                    .emptyLine()
                    .center("You can skip this by adding -y or --yes to the command")
                    .render());
                prompt_1 = new Confirm({
                    name: "question",
                    message: "Are these settings correct?"
                });
                return [4 /*yield*/, prompt_1.run().then(function (answer) {
                        if (!answer) {
                            Logger.log("Program stopped by user", "warn");
                            process.exit();
                        }
                        console.clear();
                        printLogo();
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                console.clear();
                printLogo();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
var startProcess = function () { return __awaiter(void 0, void 0, void 0, function () {
    // Check if stream is live
    function checkM3u8StreamUrl(url) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios.head(url)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    var browser, page, checkIfUserExists, checkIfUserIsLive, checkIfStreamIsRerun, checkIfRecordRerun, clickChatButton, getFileSizeGb, checkCategory, recordingProgress, startRecording;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, checkConfiguration()];
            case 1:
                _a.sent();
                Logger.log("Loading please wait...", "info");
                return [4 /*yield*/, puppeteer.launch({
                        // headless: false, // Uncomment this line to see the browser pop up
                        args: ["--no-sandbox"],
                        defaultViewport: {
                            width: 1920,
                            height: 1080
                        }
                    })];
            case 2:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 3:
                page = _a.sent();
                return [4 /*yield*/, page.goto("https://www.twitch.tv/".concat(user))];
            case 4:
                _a.sent();
                checkIfUserExists = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, page.waitForSelector("#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div.Layout-sc-nxg1ff-0.bDMqsP.core-error__message-container > p", { timeout: 3000 })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, false];
                            case 2:
                                error_1 = _a.sent();
                                return [2 /*return*/, true];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); };
                checkIfUserIsLive = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, page.waitForSelector("#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--watch-chat.channel-root--live.channel-root--watch.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP.channel-root__main--with-chat > div.channel-root__info.channel-root__info--with-chat > div > div.Layout-sc-nxg1ff-0.jLilpG > div > div > div > div.Layout-sc-nxg1ff-0.iMHulU > div > div > div > a > div.Layout-sc-nxg1ff-0.ScHaloIndicator-sc-1l14b0i-1.dKzslu.tw-halo__indicator > div > div > div", { timeout: 3000 })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, true];
                            case 2:
                                error_2 = _a.sent();
                                return [2 /*return*/, false];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); };
                checkIfStreamIsRerun = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var error_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, page.waitForSelector("#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--watch-chat.channel-root--live.channel-root--watch.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP.channel-root__main--with-chat > div.channel-root__info.channel-root__info--with-chat > div > div.Layout-sc-nxg1ff-0.jLilpG > div > div.Layout-sc-nxg1ff-0.hMFNaU.metadata-layout__split-top > div.Layout-sc-nxg1ff-0 > div > div > div > div > div > a > span", { timeout: 3000 })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, true];
                            case 2:
                                error_3 = _a.sent();
                                return [2 /*return*/, false];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); };
                checkIfRecordRerun = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = rerunEnable == false;
                                if (!_a) return [3 /*break*/, 2];
                                return [4 /*yield*/, checkIfStreamIsRerun()];
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
                clickChatButton = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var err_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, page.waitForSelector("#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--home.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP > div.channel-root__info.channel-root__info--offline.channel-root__info--home > div > div.Layout-sc-nxg1ff-0.bPMozh.home-header-sticky > div.Layout-sc-nxg1ff-0.Bza-dv > div > div > ul > li:nth-child(5) > a > div > div.ScTextWrapper-sc-18v7095-1.eFGtCR > div", { timeout: 3000 })];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, page.click("#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div.channel-root.channel-root--home.channel-root--unanimated > div.Layout-sc-nxg1ff-0.bDMqsP > div.channel-root__info.channel-root__info--offline.channel-root__info--home > div > div.Layout-sc-nxg1ff-0.bPMozh.home-header-sticky > div.Layout-sc-nxg1ff-0.Bza-dv > div > div > ul > li:nth-child(5) > a > div > div.ScTextWrapper-sc-18v7095-1.eFGtCR > div")];
                            case 2:
                                _a.sent();
                                Logger.log("Clicked 'Chat' button", "action");
                                return [3 /*break*/, 4];
                            case 3:
                                err_2 = _a.sent();
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, clickChatButton()];
            case 5:
                _a.sent();
                getFileSizeGb = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var stats, fileSizeInBytes, fileSizeInMegabytes, fileSizeInGigabytes;
                    return __generator(this, function (_a) {
                        stats = fs.statSync("".concat(directoryPath, "videos/").concat(user, "/").concat(user, "-").concat(filename, ".mp4"));
                        fileSizeInBytes = stats.size;
                        fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
                        fileSizeInGigabytes = fileSizeInMegabytes * 0.001;
                        return [2 /*return*/, fileSizeInGigabytes.toString().substring(0, 6)];
                    });
                }); };
                checkCategory = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var value1, value2, element1, err_3, element2, err_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (category == "disabled") {
                                    return [2 /*return*/, true];
                                }
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
                recordingProgress = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                _b = (_a = console).log;
                                _e = (_d = logo({
                                    name: "TwitchRec",
                                    font: "Chunky",
                                    lineChars: 10,
                                    padding: 2,
                                    margin: 3
                                })
                                    .emptyLine()
                                    .left("User: ".concat(user))
                                    .emptyLine())
                                    .left;
                                _f = "File size: ".concat;
                                return [4 /*yield*/, getFileSizeGb()];
                            case 1:
                                _g = (_c = _e.apply(_d, [_f.apply("File size: ", [_j.sent(), " GB"])])
                                    .left("Running for: ".concat(timer.format("D:%d H:%h M:%m S:%s")))
                                    .left("Recording: ".concat(recording_timer.format("D:%d H:%h M:%m S:%s"))))
                                    .left;
                                _h = "Rerun: ".concat;
                                return [4 /*yield*/, checkIfStreamIsRerun()];
                            case 2:
                                _b.apply(_a, [_g.apply(_c, [_h.apply("Rerun: ", [_j.sent()])])
                                        .emptyLine("".concat(console.clear()))
                                        .center("Twitch recording software. Developed by Pignuuu.")
                                        .center("https://stianwiu.me")
                                        .render()]);
                                return [2 /*return*/];
                        }
                    });
                }); };
                startRecording = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var stream, finishedRecording;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fs.existsSync("".concat(directoryPath, "videos"))];
                            case 1:
                                if (!!(_a.sent())) return [3 /*break*/, 3];
                                return [4 /*yield*/, fs.mkdirSync("".concat(directoryPath, "videos"))];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                Logger.log("Getting raw stream url", "info");
                                return [4 /*yield*/, m3u8Info
                                        .getStream(user)
                                        .then(function (data) {
                                        if (selectedQuality < data.length && selectedQuality >= 0) {
                                            link = data[selectedQuality].url;
                                        }
                                        else {
                                            Logger.error("You can't record at that quality", "error");
                                            process.exit();
                                        }
                                    })["catch"](function (err) { return console.error(err); })];
                            case 4:
                                _a.sent();
                                Logger.log("Recording started", "action");
                                recording_timer.start();
                                return [4 /*yield*/, fs.existsSync("".concat(directoryPath, "videos/").concat(user))];
                            case 5:
                                if (!!(_a.sent())) return [3 /*break*/, 7];
                                return [4 /*yield*/, fs.mkdirSync("".concat(directoryPath, "videos/").concat(user))];
                            case 6:
                                _a.sent();
                                _a.label = 7;
                            case 7: return [4 /*yield*/, m3u8stream(link).pipe(fs.createWriteStream("".concat(directoryPath, "videos/").concat(user, "/").concat(user, "-").concat(filename, ".mp4")))];
                            case 8:
                                stream = _a.sent();
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                            case 9:
                                _a.sent();
                                return [4 /*yield*/, recordingProgress()];
                            case 10:
                                _a.sent();
                                finishedRecording = false;
                                _a.label = 11;
                            case 11: return [4 /*yield*/, checkM3u8StreamUrl(link)];
                            case 12:
                                if (!((_a.sent()) == true &&
                                    finishedRecording == false)) return [3 /*break*/, 17];
                                return [4 /*yield*/, recordingProgress()];
                            case 13:
                                _a.sent();
                                return [4 /*yield*/, checkCategory()];
                            case 14:
                                if ((_a.sent()) == false) {
                                    stream.end();
                                    finishedRecording = true;
                                    Logger.log("Stream has changed category", "info");
                                }
                                return [4 /*yield*/, getFileSizeGb()];
                            case 15:
                                if ((_a.sent()) > maxSize && maxSize != "disabled") {
                                    stream.end();
                                    finishedRecording = true;
                                    Logger.log("Max file size reached", "warn");
                                }
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                            case 16:
                                _a.sent();
                                return [3 /*break*/, 11];
                            case 17: return [2 /*return*/];
                        }
                    });
                }); };
                (function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0: return [4 /*yield*/, checkIfUserExists()];
                            case 1:
                                if (!_l.sent()) return [3 /*break*/, 30];
                                Logger.log("User exists", "info");
                                return [4 /*yield*/, checkIfUserIsLive()];
                            case 2:
                                if ((_l.sent()) == false) {
                                    Logger.log("Recording will start when ".concat(user, " goes live or starts a rerun"), "info");
                                }
                                _l.label = 3;
                            case 3:
                                if (!(loopProgram == true)) return [3 /*break*/, 17];
                                _l.label = 4;
                            case 4: return [4 /*yield*/, checkIfUserIsLive()];
                            case 5:
                                _b = (_l.sent()) == false;
                                if (_b) return [3 /*break*/, 7];
                                return [4 /*yield*/, checkIfRecordRerun()];
                            case 6:
                                _b = (_l.sent()) == false;
                                _l.label = 7;
                            case 7:
                                _a = _b;
                                if (_a) return [3 /*break*/, 9];
                                return [4 /*yield*/, checkCategory()];
                            case 8:
                                _a = (_l.sent()) == false;
                                _l.label = 9;
                            case 9:
                                if (!_a) return [3 /*break*/, 11];
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                            case 10:
                                _l.sent();
                                return [3 /*break*/, 4];
                            case 11: return [4 /*yield*/, startRecording()];
                            case 12:
                                _l.sent();
                                return [4 /*yield*/, printLogo()];
                            case 13:
                                _l.sent();
                                Logger.log("Your file is ready. File: ./".concat(user, "/").concat(user, "-").concat(filename, ".mp4"), "info");
                                timer.stop();
                                _d = (_c = Logger).log;
                                _e = "Final file size: ".concat;
                                return [4 /*yield*/, getFileSizeGb()];
                            case 14:
                                _d.apply(_c, [_e.apply("Final file size: ", [_l.sent(), " GB"]), "info"]);
                                Logger.log(timer.format("Entire process took D:%d H:%h M:%m S:%s"), "info");
                                Logger.log(recording_timer.format("Recorded for D:%d H:%h M:%m S:%s\n"), "info");
                                Logger.log("Waiting for stream to start again", "info");
                                return [4 /*yield*/, page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })];
                            case 15:
                                _l.sent();
                                return [4 /*yield*/, clickChatButton()];
                            case 16:
                                _l.sent();
                                return [3 /*break*/, 3];
                            case 17:
                                if (!(loopProgram == false)) return [3 /*break*/, 29];
                                _l.label = 18;
                            case 18: return [4 /*yield*/, checkIfUserIsLive()];
                            case 19:
                                _g = (_l.sent()) == false;
                                if (_g) return [3 /*break*/, 21];
                                return [4 /*yield*/, checkIfRecordRerun()];
                            case 20:
                                _g = (_l.sent()) == false;
                                _l.label = 21;
                            case 21:
                                _f = _g;
                                if (_f) return [3 /*break*/, 23];
                                return [4 /*yield*/, checkCategory()];
                            case 22:
                                _f = (_l.sent()) == false;
                                _l.label = 23;
                            case 23:
                                if (!_f) return [3 /*break*/, 25];
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                            case 24:
                                _l.sent();
                                return [3 /*break*/, 18];
                            case 25: return [4 /*yield*/, startRecording()];
                            case 26:
                                _l.sent();
                                return [4 /*yield*/, printLogo()];
                            case 27:
                                _l.sent();
                                Logger.log("Your file is ready. File: ".concat(directoryPath).concat(user, "/").concat(user, "-").concat(filename, ".mp4"), "info");
                                timer.stop();
                                _j = (_h = Logger).log;
                                _k = "Final file size: ".concat;
                                return [4 /*yield*/, getFileSizeGb()];
                            case 28:
                                _j.apply(_h, [_k.apply("Final file size: ", [_l.sent(), " GB"]), "info"]);
                                Logger.log(timer.format("Entire process took D:%d H:%h M:%m S:%s"), "info");
                                Logger.log(recording_timer.format("Recorded for D:%d H:%h M:%m S:%s"), "info");
                                _l.label = 29;
                            case 29:
                                process.exit();
                                return [3 /*break*/, 31];
                            case 30:
                                Logger.log("User does not exist", "error");
                                process.exit();
                                _l.label = 31;
                            case 31: return [2 /*return*/];
                        }
                    });
                }); })();
                return [2 /*return*/];
        }
    });
}); };
startProcess();
