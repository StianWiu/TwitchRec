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
var timer = new timer_node_1.Timer({ label: "main-timer" });
var recording_timer = new timer_node_1.Timer({ label: "recording-timer" });
timer.start();
var printLogo = function () {
    console.log(logo({
        name: "Pignuuu",
        font: "Chunky",
        lineChars: 10,
        padding: 2,
        margin: 3
    })
        .emptyLine()
        .right("V2.0.0")
        .emptyLine()
        .center('Twitch recording software. Developed by Pignuuu. "--help" for options')
        .render());
};
printLogo();
program.requiredOption("-u, --user <string>", "Twitch username");
program.option("-r, --rerun <boolean>", "Record reruns [Optional]");
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
};
checkConfiguration();
var startProcess = function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, checkIfUserExists, checkIfUserIsLive, checkIfStreamIsRerun, checkIfRecordRerun, clickChatButton, startRecording;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, puppeteer.launch({
                    // headless: false,
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
                startRecording = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var link;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                process_1.stdout.write("\nGetting raw stream url");
                                return [4 /*yield*/, page.goto("https://pwn.sh/tools/getstream.html")];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, page.waitForSelector("#input-url")];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, page.click("#input-url")];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, page.keyboard.type("twitch.tv/" + options.user)];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, page.waitForSelector("#go")];
                            case 5:
                                _a.sent();
                                return [4 /*yield*/, page.click("#go")];
                            case 6:
                                _a.sent();
                                return [4 /*yield*/, page.waitForSelector("#alert_result > a:nth-child(1)")];
                            case 7:
                                _a.sent();
                                return [4 /*yield*/, page.evaluate(function () {
                                        return Array.from(document.querySelectorAll("#alert_result > a:nth-child(1)"), function (a) { return a.getAttribute("href"); });
                                    })];
                            case 8:
                                link = _a.sent();
                                browser.close();
                                process_1.stdout.write("\nRecording");
                                recording_timer.start();
                                return [4 /*yield*/, fs.existsSync("./videos/" + user)];
                            case 9:
                                if (!!(_a.sent())) return [3 /*break*/, 11];
                                return [4 /*yield*/, fs.mkdirSync("./videos/" + user)];
                            case 10:
                                _a.sent();
                                _a.label = 11;
                            case 11: return [4 /*yield*/, m3u8stream(link[0]).pipe(fs.createWriteStream("videos/" + user + "/" + user + "-" + filename + ".mp4"))];
                            case 12:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                (function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, checkIfUserExists()];
                            case 1:
                                if (!_b.sent()) return [3 /*break*/, 9];
                                process_1.stdout.write("\nUser exitsts");
                                _b.label = 2;
                            case 2: return [4 /*yield*/, checkIfUserIsLive()];
                            case 3:
                                _a = (_b.sent()) == false;
                                if (_a) return [3 /*break*/, 5];
                                return [4 /*yield*/, checkIfRecordRerun()];
                            case 4:
                                _a = (_b.sent()) == false;
                                _b.label = 5;
                            case 5:
                                if (!_a) return [3 /*break*/, 7];
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                            case 6:
                                _b.sent();
                                return [3 /*break*/, 2];
                            case 7: return [4 /*yield*/, startRecording()];
                            case 8:
                                _b.sent();
                                return [3 /*break*/, 10];
                            case 9:
                                process_1.stdout.write("\nUser does not exist");
                                process.exit();
                                _b.label = 10;
                            case 10: return [2 /*return*/];
                        }
                    });
                }); })();
                return [2 /*return*/];
        }
    });
}); };
startProcess();
