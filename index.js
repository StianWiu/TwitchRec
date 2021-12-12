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
var fs = require("fs");
var puppeteer = require("puppeteer");
var m3u8stream = require("m3u8stream");
var randomstring = require("randomstring");
var logo = require("asciiart-logo");
var filename = randomstring.generate({
    length: 10,
    charset: "hex"
});
var commander_1 = require("commander");
var timer_node_1 = require("timer-node");
var process_1 = require("process");
var program = new commander_1.Command();
var user;
var rerunEnable;
var category;
var maxSize;
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
        .right("V2.3.1")
        .emptyLine()
        .center('Twitch recording software. Developed by Pignuuu. "--help" for options')
        .center("https://stianwiu.me")
        .render());
};
printLogo();
program.requiredOption("-u, --user <string>", "Twitch username");
program.option("-r, --rerun <boolean>", "Record reruns [Optional]");
program.option("-c, --category <string>", "Only record certain category [Optional]");
program.option("-m, --max <num>", "How many GB file can become [Optional]");
program.parse(process.argv);
var options = program.opts();
var checkConfiguration = function () {
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
        category = undefined;
    }
    if (options.max) {
        maxSize = Number(options.max);
    }
    else {
        maxSize = undefined;
    }
};
checkConfiguration();
var startProcess = function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, checkIfUserExists, checkIfUserIsLive, checkIfStreamIsRerun, checkIfRecordRerun, clickChatButton, getFileSize, getFileSizeGb, checkCategory, recordingProgress, startRecording;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                process_1.stdout.write("\nLoading please wait...");
                return [4 /*yield*/, puppeteer.launch({
                        // headless: false,
                        args: ["--no-sandbox"],
                        defaultViewport: {
                            width: 1920,
                            height: 1080
                        }
                    })];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _a.sent();
                return [4 /*yield*/, page.goto("https://www.twitch.tv/" + user)];
            case 3:
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
                    var err_1;
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
                                process_1.stdout.write('[ACTION] Clicked "Chat" button\n');
                                return [3 /*break*/, 4];
                            case 3:
                                err_1 = _a.sent();
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, clickChatButton()];
            case 4:
                _a.sent();
                getFileSize = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var fileInfo, fileSize;
                    return __generator(this, function (_a) {
                        fileInfo = fs.statSync("videos/" + user + "/" + user + "-" + filename + ".mp4");
                        fileSize = fileInfo.size;
                        return [2 /*return*/, fileSize];
                    });
                }); };
                getFileSizeGb = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var stats, fileSizeInBytes, fileSizeInMegabytes, fileSizeInGigabytes;
                    return __generator(this, function (_a) {
                        stats = fs.statSync("videos/" + user + "/" + user + "-" + filename + ".mp4");
                        fileSizeInBytes = stats.size;
                        fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
                        fileSizeInGigabytes = fileSizeInMegabytes * 0.001;
                        return [2 /*return*/, fileSizeInGigabytes.toString().substring(0, 6)];
                    });
                }); };
                checkCategory = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var value1, value2, element1, err_2, element2, err_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (category == undefined) {
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
                                err_2 = _a.sent();
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
                                err_3 = _a.sent();
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
                                console.clear();
                                _b = (_a = console).log;
                                _e = (_d = logo({
                                    name: "TwitchRec",
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
                                return [4 /*yield*/, getFileSizeGb()];
                            case 1:
                                _g = (_c = _e.apply(_d, [_f + (_j.sent()) + " GB"])
                                    .left("Running for: " + timer.format("D:%d H:%h M:%m S:%s"))
                                    .left("Recording: " + recording_timer.format("D:%d H:%h M:%m S:%s")))
                                    .left;
                                _h = "Rerun: ";
                                return [4 /*yield*/, checkIfStreamIsRerun()];
                            case 2:
                                _b.apply(_a, [_g.apply(_c, [_h + (_j.sent())])
                                        .emptyLine()
                                        .center("Twitch recording software. Developed by Pignuuu.")
                                        .center("https://stianwiu.me")
                                        .render()]);
                                return [2 /*return*/];
                        }
                    });
                }); };
                startRecording = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var link, stream, variableFileSize, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                process_1.stdout.write("\n[INFO] Getting raw stream url");
                                return [4 /*yield*/, page.goto("https://pwn.sh/tools/getstream.html")];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, page.waitForSelector("#input-url")];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, page.click("#input-url")];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, page.keyboard.type("twitch.tv/" + options.user)];
                            case 4:
                                _b.sent();
                                return [4 /*yield*/, page.waitForSelector("#go")];
                            case 5:
                                _b.sent();
                                return [4 /*yield*/, page.click("#go")];
                            case 6:
                                _b.sent();
                                return [4 /*yield*/, page.waitForSelector("#alert_result > a:nth-child(1)")];
                            case 7:
                                _b.sent();
                                return [4 /*yield*/, page.evaluate(function () {
                                        return Array.from(document.querySelectorAll("#alert_result > a:nth-child(1)"), function (a) { return a.getAttribute("href"); });
                                    })];
                            case 8:
                                link = _b.sent();
                                return [4 /*yield*/, page.goto("https://www.twitch.tv/" + user)];
                            case 9:
                                _b.sent();
                                process_1.stdout.write("\n[ACTION] Recording started");
                                recording_timer.start();
                                return [4 /*yield*/, fs.existsSync("./videos/" + user)];
                            case 10:
                                if (!!(_b.sent())) return [3 /*break*/, 12];
                                return [4 /*yield*/, fs.mkdirSync("./videos/" + user)];
                            case 11:
                                _b.sent();
                                _b.label = 12;
                            case 12: return [4 /*yield*/, m3u8stream(link[0]).pipe(fs.createWriteStream("videos/" + user + "/" + user + "-" + filename + ".mp4"))];
                            case 13:
                                stream = _b.sent();
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                            case 14:
                                _b.sent();
                                recordingProgress();
                                return [4 /*yield*/, getFileSize()];
                            case 15:
                                variableFileSize = _b.sent();
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 30000); })];
                            case 16:
                                _b.sent();
                                _b.label = 17;
                            case 17:
                                _a = variableFileSize;
                                return [4 /*yield*/, getFileSize()];
                            case 18:
                                if (!(_a != (_b.sent()))) return [3 /*break*/, 23];
                                return [4 /*yield*/, getFileSize()];
                            case 19:
                                variableFileSize = _b.sent();
                                recordingProgress();
                                return [4 /*yield*/, checkCategory()];
                            case 20:
                                if ((_b.sent()) == false) {
                                    stream.end();
                                }
                                return [4 /*yield*/, getFileSize()];
                            case 21:
                                if ((_b.sent()) > maxSize && !maxSize == undefined) {
                                    process_1.stdout.write("\n[INFO] Max file size reached");
                                    stream.end();
                                }
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 30000); })];
                            case 22:
                                _b.sent();
                                return [3 /*break*/, 17];
                            case 23: return [2 /*return*/];
                        }
                    });
                }); };
                (function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, checkIfUserExists()];
                            case 1:
                                if (!_f.sent()) return [3 /*break*/, 13];
                                process_1.stdout.write("\n[INFO] User exists");
                                process_1.stdout.write("\n[INFO] Recording will start when user goes live or starts a rerun.");
                                _f.label = 2;
                            case 2: return [4 /*yield*/, checkIfUserIsLive()];
                            case 3:
                                _b = (_f.sent()) == false;
                                if (_b) return [3 /*break*/, 5];
                                return [4 /*yield*/, checkIfRecordRerun()];
                            case 4:
                                _b = (_f.sent()) == false;
                                _f.label = 5;
                            case 5:
                                _a = _b;
                                if (_a) return [3 /*break*/, 7];
                                return [4 /*yield*/, checkCategory()];
                            case 6:
                                _a = (_f.sent()) == false;
                                _f.label = 7;
                            case 7:
                                if (!_a) return [3 /*break*/, 9];
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                            case 8:
                                _f.sent();
                                return [3 /*break*/, 2];
                            case 9: return [4 /*yield*/, startRecording()];
                            case 10:
                                _f.sent();
                                return [4 /*yield*/, printLogo()];
                            case 11:
                                _f.sent();
                                process_1.stdout.write("\n\n[INFO] Your file is ready. File:./" + user + "/" + user + "-" + filename + ".mp4\n");
                                timer.stop();
                                _d = (_c = process_1.stdout).write;
                                _e = "[INFO] Final file size:";
                                return [4 /*yield*/, getFileSize()];
                            case 12:
                                _d.apply(_c, [_e + (_f.sent()) + " GB\n"]);
                                process_1.stdout.write(timer.format("[INFO] Entire process took D:%d H:%h M:%m S:%s\n"));
                                process_1.stdout.write(recording_timer.format("[INFO] Recorded for D:%d H:%h M:%m S:%s\n"));
                                process.exit();
                                return [3 /*break*/, 14];
                            case 13:
                                process_1.stdout.write("\n[INFO] User does not exist. Exiting");
                                process.exit();
                                _f.label = 14;
                            case 14: return [2 /*return*/];
                        }
                    });
                }); })();
                return [2 /*return*/];
        }
    });
}); };
startProcess();
