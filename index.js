"use strict";
exports.__esModule = true;
var commander_1 = require("commander");
var program = new commander_1.Command();
var randomstring = require("randomstring");
var fs = require("fs");
program.option("-u, --user <username>", "Twitch user to record [Required]");
program.parse(process.argv);
var options = program.opts();
