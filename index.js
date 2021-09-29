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
var program = new commander_1.Command();
var puppeteer = require("puppeteer");
var randomstring = require("randomstring");
var fs = require("fs");
var random = require("random");
var noLinkSpecified = function () {
    console.log("Missing argument -l or --link");
    process.exit();
};
// const noPathSpecified = () => {
//   console.log("Missing argument -o or --output");
//   process.exit();
// };
program.option("-l, --link <link>", "link to webscrape");
//   .option("-o, --output <output>", "what folder to output to");
program.parse(process.argv);
var options = program.opts();
var checkIfUrlIsValid = function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
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
                startScrapingProcess();
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
var startScrapingProcess = function () { return __awaiter(void 0, void 0, void 0, function () {
    var returnedLinks, nextLink, i, nextLinkLoop, getLinksLoop, getLinksLoop_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, scrapeAvailableLinks(options.link)];
            case 1:
                returnedLinks = _a.sent();
                return [4 /*yield*/, scrapeRandomLink(returnedLinks)];
            case 2:
                nextLink = _a.sent();
                i = 0;
                nextLinkLoop = undefined;
                _a.label = 3;
            case 3:
                if (!true) return [3 /*break*/, 9];
                if (!(i == 0)) return [3 /*break*/, 5];
                return [4 /*yield*/, scrapeAvailableLinks(nextLink)];
            case 4:
                getLinksLoop = _a.sent();
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, scrapeAvailableLinks(nextLinkLoop)];
            case 6:
                getLinksLoop_1 = _a.sent();
                _a.label = 7;
            case 7: return [4 /*yield*/, scrapeRandomLink(getLinksLoop)];
            case 8:
                nextLinkLoop = _a.sent();
                i++;
                return [3 /*break*/, 3];
            case 9: return [2 /*return*/];
        }
    });
}); };
var scrapeAvailableLinks = function (link) { return __awaiter(void 0, void 0, void 0, function () {
    var grabLinks, page, linksArray;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, puppeteer.launch({
                    defaultViewport: { width: 1920, height: 1080 },
                    headless: true,
                    args: ["--no-sandbox"]
                })];
            case 1:
                grabLinks = _a.sent();
                return [4 /*yield*/, grabLinks.newPage()];
            case 2:
                page = _a.sent();
                return [4 /*yield*/, page.goto(link)];
            case 3:
                _a.sent();
                console.log("Opening " + link);
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.evaluate(function () {
                        return Array.from(document.querySelectorAll("a")).map(function (anchor) { return [anchor.href]; });
                    })];
            case 5:
                linksArray = _a.sent();
                grabLinks.close();
                return [2 /*return*/, linksArray];
        }
    });
}); };
var scrapeRandomLink = function (linksArray) { return __awaiter(void 0, void 0, void 0, function () {
    var arrayLength, rng, rng;
    return __generator(this, function (_a) {
        arrayLength = linksArray.length;
        console.log(linksArray);
        if (arrayLength > 0) {
            if (arrayLength == 1) {
                rng = 1;
            }
            else {
                rng = random.int(0, arrayLength - 1);
            }
            return [2 /*return*/, linksArray[rng].join()];
        }
        else {
            console.log("No more links to explore");
            process.exit();
        }
        return [2 /*return*/];
    });
}); };
checkIfUrlIsValid();
