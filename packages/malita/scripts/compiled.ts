import minimist from "minimist";
import path from "path";
// @ts-ignore
import ncc from "@vercel/ncc";
import { writeFileSync, ensureFileSync, existsSync, copySync } from "fs-extra";
const argv = minimist(process.argv.slice(2));
const npmName = argv._[0];

const cwd = process.cwd();

const npmPath = path.resolve(cwd, "node_modules", npmName);
const pkgPath = path.join(npmPath, "package.json");
const licensePath = path.join(npmPath, "LICENSE");

const pkgJson = require(pkgPath);

const outfile = path.join(cwd, "compiled", npmName, "index.js");
const outPkg = path.join(cwd, "compiled", npmName, "package.json");
const license = path.join(cwd, "compiled", npmName, "LICENSE");

ncc(npmPath, {
  // provide a custom cache path or disable caching
  cache: false,
  // externals to leave as requires of the build
  externals: ["externalpackage"],
  // directory outside of which never to emit assets
  filterAssetBase: process.cwd(), // default
  minify: true, // default
  sourceMap: false, // default
  assetBuilds: false, // default
  sourceMapBasePrefix: "../", // default treats sources as output-relative
  sourceMapRegister: true, // default
  watch: false, // default
  license: "", // default does not generate a license file
  v8cache: false, // default
  quiet: false, // default
  debugLog: false, // default
}).then(({ code }: any) => {
  ensureFileSync(outfile);
  writeFileSync(outfile, code, "utf-8");
});

ensureFileSync(outPkg);
writeFileSync(outPkg, JSON.stringify({ ...pkgJson, main: "./index.js" }), "utf-8");

if (existsSync(licensePath)) {
  copySync(licensePath, license);
}
