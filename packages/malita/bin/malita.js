#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
console.log("hello alita");

program
  .version(require("../package.json").version, "-v, -V", "输出当前版本")
  .description("这是21天短文，挑战手写前端框架的产物框架")
  .usage("<command> [options]");

program
  .command("help")
  .alias("h")
  .description("帮助")
  .action(function (name, other) {
    console.log(`
这是21天短文，挑战手写前端框架的产物框架 malita

支持的命令:
  version, -v,-V 输出当前框架的版本
  help,-h 输出帮助程序

Example call:
    $ malita <command> --help`);
  });

program
  .command("dev")
  .description("启动服务")
  .action(function () {
    const { dev } = require("../lib/dev");
    dev();
  });

program
  .command("generate")
  .alias("g")
  .description("微生成器")
  .action(function (_, options) {
    const { generate } = require("../lib/generate");
    generate(options.args);
  });

program
  .command("build")
  .description("打包")
  .action(function (_, options) {
    const { build } = require("../lib/build");
    build();
  });

program.parse(process.argv);
