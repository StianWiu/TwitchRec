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
var commander_1 = require("commander");
var puppeteer_stream_1 = require("puppeteer-stream");
var program = new commander_1.Command();
var puppeteer = require("puppeteer");
var randomstring = require("randomstring");
var fs = require("fs");
var exec = require("child_process").exec;
var noLinkSpecified = function () {
    console.log("Missing argument -l or --link");
    process.exit();
};
var noTimeSpecified = function () {
    console.log("Missing argument -t or --time");
    process.exit();
};
program
    .option("-l, --link <link>", "link to webscrape")
    .option("-t, --time <time>", "how many minutes to record");
program.parse(process.argv);
var options = program.opts();
var checkIfUrlIsValid = function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (options.time == undefined)
                    noTimeSpecified();
                if (!options.link) return [3 /*break*/, 7];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, puppeteer.launch({
                        headless: true,
                        args: ["--no-sandbox"]
                    })];
            case 2:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 3:
                page = _a.sent();
                return [4 /*yield*/, page.goto(options.link, { waitUntil: "load", timeout: 0 })];
            case 4:
                _a.sent();
                console.log("Link is valid");
                startRecording();
                return [3 /*break*/, 6];
            case 5:
                e_1 = _a.sent();
                console.log("Link could not be resloved.");
                process.exit();
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 8];
            case 7:
                noLinkSpecified();
                _a.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };
var filename = randomstring.generate({
    length: 10,
    charset: "hex"
});
var file = fs.createWriteStream(__dirname + ("/videos/" + filename + ".mp4"));
function startRecording() {
    return __awaiter(this, void 0, void 0, function () {
        var browser, checkIfLive, page, record;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, puppeteer_stream_1.launch)({
                        // If using windows change to this
                        // executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe ",
                        executablePath: "/usr/bin/google-chrome-stable",
                        defaultViewport: {
                            width: 1024,
                            height: 768
                        }
                    })];
                case 1:
                    browser = _a.sent();
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
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    return [4 /*yield*/, page.goto(options.link)];
                case 3:
                    _a.sent();
                    record = function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b, err_1, stream, ffmpeg;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })];
                                case 1:
                                    _c.sent();
                                    return [4 /*yield*/, page.keyboard.press("f")];
                                case 2:
                                    _c.sent();
                                    _c.label = 3;
                                case 3:
                                    _c.trys.push([3, 6, , 7]);
                                    _b = (_a = Promise).all;
                                    return [4 /*yield*/, page.click("#root > div > div.Layout-sc-nxg1ff-0.ldZtqr > div.Layout-sc-nxg1ff-0.iLYUfX > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.InjectLayout-sc-588ddc-0.persistent-player > div > div.Layout-sc-nxg1ff-0.video-player > div > div > div > div > div.Layout-sc-nxg1ff-0.krOuYh.player-overlay-background.player-overlay-background--darkness-0.content-overlay-gate > div > div.Layout-sc-nxg1ff-0.bzQnIQ.content-overlay-gate__allow-pointers > button")];
                                case 4: return [4 /*yield*/, _b.apply(_a, [[
                                            _c.sent()
                                        ]])];
                                case 5:
                                    _c.sent();
                                    console.log("Stream is agerestricted");
                                    return [3 /*break*/, 7];
                                case 6:
                                    err_1 = _c.sent();
                                    console.log("Stream is not agerestricted");
                                    return [3 /*break*/, 7];
                                case 7: return [4 /*yield*/, (0, puppeteer_stream_1.getStream)(page, { audio: true, video: true })];
                                case 8:
                                    stream = _c.sent();
                                    console.log("recording");
                                    ffmpeg = exec("ffmpeg -y -threads 1 -i - ./videos/" + filename + "-export.mp4");
                                    ffmpeg.stderr.on("data", function (chunk) {
                                        console.log(chunk.toString());
                                    });
                                    stream.pipe(ffmpeg.stdin);
                                    _c.label = 9;
                                case 9: return [4 /*yield*/, checkIfLive()];
                                case 10:
                                    if (!((_c.sent()) == true)) return [3 /*break*/, 12];
                                    console.log("Streamer is still streaming");
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10000); })];
                                case 11:
                                    _c.sent();
                                    return [3 /*break*/, 9];
                                case 12:
                                    stream.pipe(file);
                                    return [4 /*yield*/, stream.destroy()];
                                case 13:
                                    _c.sent();
                                    file.close();
                                    console.log("finished");
                                    ffmpeg.stdin.setEncoding("utf8");
                                    ffmpeg.stdin.write("q");
                                    ffmpeg.stdin.end();
                                    ffmpeg.kill();
                                    process.exit();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    _a.label = 4;
                case 4: return [4 /*yield*/, checkIfLive()];
                case 5:
                    if (!((_a.sent()) == false)) return [3 /*break*/, 8];
                    console.log("Streamer is not live");
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10000); })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 8:
                    record();
                    return [2 /*return*/];
            }
        });
    });
}
checkIfUrlIsValid();
