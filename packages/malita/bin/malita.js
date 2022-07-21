#!/usr/bin/env node

const { program } = require("commander");

program
  .command("help")
  .alias("-h")
  .description("cli 介绍")
  .action((_name, _other) => {
    console.log("cli help");
  });

program.version(require("../package.json").version, "-v, -V");

program
  .command("dev")
  .description("服务端渲染启动")
  .action(() => {
    const { dev } = require("../dist/dev");
    dev();
  });

program.parse();
