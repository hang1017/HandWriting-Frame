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

program
  .command("generate")
  .alias("g")
  .description("微生成器")
  .action((_name, other) => {
    const { args } = other;
    if (args && !!args.length) {
      const { generate } = require("../dist/generate");
      generate(args[1]);
    } else {
      console.error("cli format error");
    }
  });

program.parse();
