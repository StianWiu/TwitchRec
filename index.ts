import { Command } from "commander";
const program = new Command();
const puppeteer = require("puppeteer");
const randomstring = require("randomstring");
const fs = require("fs");
const random = require("random");

const noLinkSpecified = () => {
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

const options = program.opts();
const checkIfUrlIsValid = async () => {
  //   if (options.output == undefined) noPathSpecified();
  if (options.link) {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });
      const page = await browser.newPage();
      await page.goto(options.link, { waitUntil: "load", timeout: 0 });
      console.log("Link is valid");
      startScrapingProcess();
    } catch (e: any) {
      console.log("Link could not be resloved.");
      process.exit();
    }
  } else noLinkSpecified();
};
const startScrapingProcess = async () => {
  const returnedLinks = await scrapeAvailableLinks(options.link);
  const nextLink = await scrapeRandomLink(returnedLinks);
  var i = 0;
  var nextLinkLoop = undefined;
  while (true) {
    if (i == 0) {
      var getLinksLoop = await scrapeAvailableLinks(nextLink);
    } else {
      const getLinksLoop = await scrapeAvailableLinks(nextLinkLoop);
    }
    nextLinkLoop = await scrapeRandomLink(getLinksLoop);
    i++;
  }
};
const scrapeAvailableLinks = async (link) => {
  const grabLinks = await puppeteer.launch({
    defaultViewport: { width: 1920, height: 1080 },
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await grabLinks.newPage();
  await page.goto(link);
  console.log(`Opening ${link}`);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const linksArray = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a")).map((anchor) => [anchor.href])
  );
  grabLinks.close();
  return linksArray;
};
const scrapeRandomLink = async (linksArray) => {
  var arrayLength = linksArray.length;
  console.log(linksArray);
  if (arrayLength > 0) {
    if (arrayLength == 1) {
      var rng = 1;
    } else {
      var rng: number = random.int(0, arrayLength - 1);
    }
    return linksArray[rng].join();
  } else {
    console.log("No more links to explore");
    process.exit();
  }
};
checkIfUrlIsValid();
