import { Command } from "commander";
const program = new Command();
const randomstring = require("randomstring");
const fs = require("fs");

program.option("-u, --user <username>", "Twitch user to record [Required]");
program.parse(process.argv);
const options = program.opts();
