import type { PluginBuild, OnResolveArgs, OnLoadArgs } from "esbuild";
import { build } from "esbuild";
import path from "path";
import postcss from "../compiled/postcss";
// @ts-ignore
import pxtorem from "@alitajs/postcss-plugin-px2rem";

export const styles = () => {
  return {
    name: "styles",
    setup({ onResolve, onLoad }: PluginBuild) {
      onResolve({ filter: /\.css$/, namespace: "file" }, (args: OnResolveArgs) => {
        return {
          path: path.resolve(args.resolveDir, args.path),
          namespace: "style-stub",
        };
      });

      onLoad({ filter: /.*/, namespace: "style-stub" }, (args: OnLoadArgs) => {
        return {
          contents: `
            import { styleHelper } from "__style_helper__";
            import text from ${JSON.stringify(args.path)};
            styleHelper(text);
          `,
        };
      });

      onResolve(
        { filter: /^__style_helper__$/, namespace: "style-stub" },
        (args: OnResolveArgs) => {
          return {
            path: args.path,
            namespace: "style-helper",
            sideEffects: false,
          };
        }
      );

      onLoad({ filter: /.*/, namespace: "style-helper" }, () => {
        return {
          contents: `
              export function styleHelper(text) {
                if(typeof document !== 'undefined') {
                  var style = document.createElement('style');
                  const node = document.createTextNode(text);
                  style.appendChild(node);
                  document.head.appendChild(style);
                }
              }
            `,
        };
      });

      onResolve({ filter: /.css/, namespace: "style-stub" }, (args: OnResolveArgs) => {
        return {
          path: args.path,
          namespace: "style-content",
        };
      });

      onLoad({ filter: /.*/, namespace: "style-content" }, async (args) => {
        const {
          errors,
          warnings,
          outputFiles = [],
        } = await build({
          bundle: true,
          external: ["esbuild"],
          format: "cjs",
          logLevel: "error",
          minify: true,
          platform: "browser",
          entryPoints: [args.path],
          write: false,
          charset: "utf8",
        });

        // const processedCss = postcss(
        //   pxtorem({
        //     selectorDoubleRemList: [/.ant-/, /.adm-/, /.am-/],
        //     rootValue: 100,
        //     minPixelValue: 2,
        //   })
        // ).process(outputFiles[0].text).css;

        return {
          contents: outputFiles[0].text,
          errors,
          warnings,
          loader: "text",
        };
      });
    },
  };
};
