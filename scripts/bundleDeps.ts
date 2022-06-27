import minimist from "minimist";
import path from "path";
import ncc from "@vercel/ncc";
import resolve from "resolve";
import { ensureDirSync, writeFileSync, existsSync, copyFileSync } from "fs-extra";
import { Package } from "dts-packer";

const argv = minimist(process.argv.slice(2));

const cwd = process.cwd();

const pkg = argv._[0];

const nodeModulesPath = path.resolve(cwd, "node_modules", pkg);

// 的 main 入口
const entry = require.resolve(pkg, {
  paths: [nodeModulesPath],
});

const target = `compiled/${pkg}`;

const build = async () => {
  const { code } = await ncc(entry, {
    minify: true,
    target: "es5",
    assetBuilds: false,
  });
  ensureDirSync(target);
  writeFileSync(path.join(target, "index.js"), code, "utf-8");

  const pkgRoot = path.dirname(
    resolve.sync(`${pkg}/package.json`, {
      basedir: cwd,
    })
  );

  if (existsSync(path.join(pkgRoot, "LICENSE"))) {
    copyFileSync(path.join(pkgRoot, "LICENSE"), path.join(target, "LICENSE"));
  }

  copyFileSync(path.join(pkgRoot, "package.json"), path.join(target, "package.json"));

  // new Package({
  //   cwd: cwd,
  //   name: pkg,
  //   typesRoot: target,
  // });
};

build();
