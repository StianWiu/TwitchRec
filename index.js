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
var stopWhileLoop = false;
var rerunStream = undefined;
var windows = undefined;
var fps = undefined;
var output = undefined;
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var noUserSpecified = function () {
    console.log("Missing argument -u or --user");
    process.exit();
};
var noOsSpecified = function () {
    console.log("Missing argument -w or --windows");
    process.exit();
};
program.option("-u, --user <username>", "Twitch user to record [Required]");
program.option("-w, --windows <true/false>", "Using windows true or false [Required]");
program.option("-f, --frames <number>", "How many fps to export to [Optinal]");
program.option("-o, --output <true/false>", "Print ffmpeg to console? [Optinal]");
program.parse(process.argv);
var options = program.opts();
var checkConfiguration = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
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
                if (options.output) {
                    if (options.output == "true") {
                        output = true;
                    }
                    output = false;
                }
                else {
                    output = true;
                }
            }
            else
                noOsSpecified();
        }
        else
            noUserSpecified();
        return [2 /*return*/];
    });
}); };
// make sure provided link actually opens
var checkIfUrlIsValid = function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, checkConfiguration()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 6, , 7]);
                return [4 /*yield*/, puppeteer.launch({
                        headless: true,
                        args: ["--no-sandbox"]
                    })];
            case 3:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 4:
                page = _a.sent();
                return [4 /*yield*/, page.goto("https://twitch.tv/" + options.user, {
                        waitUntil: "load",
                        timeout: 0
                    })];
            case 5:
                _a.sent();
                console.log("Username is valid");
                startRecording();
                return [3 /*break*/, 7];
            case 6:
                e_1 = _a.sent();
                console.log("Username could not be resloved.");
                process.exit();
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
// generate random hex string to use for filename
var filename = randomstring.generate({
    length: 10,
    charset: "hex"
});
var startRecording = function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, checkIfLive, checkIfRerun, page, originalUrl, record;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                browser = undefined;
                if (!(windows == true)) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, puppeteer_stream_1.launch)({
                        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe ",
                        // change to appropriate resolution
                        defaultViewport: {
                            width: 1920,
                            height: 1080
                        },
                        args: ["--start-maximized"]
                    })];
            case 1:
                browser = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, (0, puppeteer_stream_1.launch)({
                    executablePath: "/usr/bin/google-chrome-stable",
                    // change to appropriate resolution
                    defaultViewport: {
                        width: 1024,
                        height: 768
                    },
                    args: ["--start-maximized"]
                })];
            case 3:
                browser = _a.sent();
                _a.label = 4;
            case 4:
                checkIfLive = function () { return __awaiter(void 0, void 0, void 0, function () {
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
                checkIfRerun = function () { return __awaiter(void 0, void 0, void 0, function () {
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
                return [4 /*yield*/, browser.newPage()];
            case 5:
                page = _a.sent();
                return [4 /*yield*/, page.setDefaultNavigationTimeout(0)];
            case 6:
                _a.sent();
                return [4 /*yield*/, page.goto("https://twitch.tv/" + options.user)];
            case 7:
                _a.sent();
                originalUrl = page.url();
                record = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var file, _a, _b, err_1, stream, ffmpeg, progress, test1, test2, pages;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                file = fs.createWriteStream(__dirname + ("/videos/" + options.user + "-" + filename + "-stream.mp4"));
                                console.log("Created file " + options.user + "-" + filename + "-stream.mp4");
                                return [4 /*yield*/, page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })];
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
                                console.log("Clicked \"Start Watching\" button");
                                return [3 /*break*/, 7];
                            case 6:
                                err_1 = _c.sent();
                                console.log("Stream is not agerestricted");
                                return [3 /*break*/, 7];
                            case 7: return [4 /*yield*/, (0, puppeteer_stream_1.getStream)(page, { audio: true, video: true })];
                            case 8:
                                stream = _c.sent();
                                console.log("Starting to record");
                                ffmpeg = undefined;
                                // -r specifies what the wanted fps is
                                if (windows == true) {
                                    ffmpeg = exec("ffmpeg.exe -y -re -i - -r " + fps + " ./videos/" + options.user + "-" + filename + "-export.mp4 -threads 1", console.log("Render fps set to " + fps));
                                }
                                else {
                                    ffmpeg = exec("ffmpeg -y -re -i - -r " + fps + " ./videos/" + options.user + "-" + filename + "-export.mp4 -threads 1", console.log("Render fps set to " + fps));
                                }
                                progress = undefined;
                                // outputs rendering data
                                console.log("Starting to render live video to " + options.user + "-" + filename + "-export.mp4 \n\nPress enter in console to finish recording or wait until stream is over");
                                if (output == true) {
                                    ffmpeg.stderr
                                        .on("data", function (chunk) {
                                        console.log(chunk.toString());
                                        progress = chunk;
                                    })
                                        .on("error", function (err, stdout, stderr) {
                                        console.log("ffmpeg stdout:\n" + stdout);
                                        console.log("ffmpeg stderr:\n" + stderr);
                                    });
                                }
                                stream.pipe(ffmpeg.stdin);
                                rl.question("", function (stringFromConsole) {
                                    if (stringFromConsole == "") {
                                        stopWhileLoop = true;
                                    }
                                    rl.close();
                                });
                                _c.label = 9;
                            case 9: return [4 /*yield*/, checkIfLive()];
                            case 10:
                                if (!((_c.sent()) == true)) return [3 /*break*/, 13];
                                if (stopWhileLoop) {
                                    return [3 /*break*/, 13];
                                }
                                if (originalUrl != page.url()) {
                                    console.log("Stopping recording because streamer raided someone else");
                                    return [3 /*break*/, 13];
                                }
                                return [4 /*yield*/, checkIfRerun()];
                            case 11:
                                if ((_c.sent()) == false && rerunStream == false) {
                                    console.log("Stream is a rerun");
                                    return [3 /*break*/, 13];
                                }
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 15000); })];
                            case 12:
                                _c.sent();
                                return [3 /*break*/, 9];
                            case 13:
                                console.log(stream);
                                console.log("#");
                                console.log(stream.pipe);
                                console.log("#");
                                console.log(stream.pipe(file));
                                stream.pipe(file);
                                return [4 /*yield*/, stream.destroy()];
                            case 14:
                                _c.sent();
                                file.close();
                                console.log("Recording finished");
                                console.log("Waiting for render to finish");
                                test1 = 0;
                                test2 = 1;
                                return [4 /*yield*/, browser.pages()];
                            case 15:
                                pages = _c.sent();
                                return [4 /*yield*/, Promise.all(pages.map(function (page) { return page.close(); }))];
                            case 16:
                                _c.sent();
                                return [4 /*yield*/, browser.close()];
                            case 17:
                                _c.sent();
                                _c.label = 18;
                            case 18:
                                if (!(test1 != test2)) return [3 /*break*/, 20];
                                test1 = progress;
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                            case 19:
                                _c.sent();
                                test2 = progress;
                                return [3 /*break*/, 18];
                            case 20:
                                console.log("Render finished");
                                console.log(ffmpeg);
                                console.log("#");
                                console.log(ffmpeg.stdin);
                                ffmpeg.stdin.setEncoding("utf8");
                                ffmpeg.stdin.write("q");
                                ffmpeg.stdin.end();
                                ffmpeg.kill();
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                            case 21:
                                _c.sent();
                                console.log("Deleting temporary stream file");
                                fs.unlinkSync("./videos/" + options.user + "-" + filename + "-stream.mp4");
                                process.exit();
                                return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9: return [4 /*yield*/, checkIfLive()];
            case 10:
                if (!((_a.sent()) == false)) return [3 /*break*/, 13];
                console.log("Streamer is not live");
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 60000); })];
            case 11:
                _a.sent();
                return [4 /*yield*/, page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })];
            case 12:
                _a.sent();
                return [3 /*break*/, 9];
            case 13: return [4 /*yield*/, checkIfRerun()];
            case 14:
                if ((_a.sent()) == false) {
                    console.log("This stream is a rerun \nContinuing to record anyways");
                    rerunStream = true;
                }
                else {
                    rerunStream = false;
                }
                record();
                return [2 /*return*/];
        }
    });
}); };
checkIfUrlIsValid();
