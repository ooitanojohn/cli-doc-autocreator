#!/usr/bin/env node

"use strict";

import { parseArgs } from "node:util";

const options = {
  "account-number": {
    type: "string",
    short: "a",
    multiple: false,
  },
  role: {
    type: "string",
    short: "r",
    multiple: false,
  },
};

const args = process.argv.slice(2);

const parsedArgs = parseArgs({ options, args });

console.log(parsedArgs);
