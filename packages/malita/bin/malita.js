#!/usr/bin/env node

const { Command } = require("commander");

const program = new Command();

console.log(1234);

program
  .version(require("../package.json").version, "-v, -V", "输出当前框架的版本")
  .description("跳转手写前端框架的产物框架")
  .usage("<command> [options]")
  .parse(process.argv);

program
  .command("help")
  .alias("h")
  .description("帮助命令")
  .action(function () {
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
  .description("框架开发 dev 命令")
  .action(function () {
    const { dev } = require("../lib/dev");
    dev();
  });

program.parse(process.argv);
