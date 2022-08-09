#!/usr/bin/env node

const argv = require("minimist")(process.argv.slice(2));
const path = require("path");
const { writeFileSync, ensureFileSync, existsSync, copySync } = require("fs-extra");
const { build } = require("esbuild");

const npmName = argv._[0];

const npmPath = path.resolve(__dirname, "..", "node_modules", npmName);
const pkgPath = path.join(npmPath, "package.json");
const licensePath = path.join(npmPath, "LICENSE");

const pkgJson = require(pkgPath);

const outfile = path.join(__dirname, "..", "compiled", npmName, "index.js");
const outPkg = path.join(__dirname, "..", "compiled", npmName, "package.json");
const license = path.join(__dirname, "..", "compiled", npmName, "LICENSE");

// 这里就获取到主入口文件
let entryPoint = path.join(npmPath, "index");
if (pkgJson.main) {
  entryPoint = path.join(npmPath, pkgJson.main);
}

build({
  entryPoints: [entryPoint],
  bundle: true,
  external: ["esbuild"],
  format: "cjs",
  logLevel: "error",
  minify: true,
  outfile,
});

ensureFileSync(outPkg);
writeFileSync(outPkg, JSON.stringify({ ...pkgJson, main: "./index.js" }), "utf-8");

if (existsSync(licensePath)) {
  copySync(licensePath, license);
}
