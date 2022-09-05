import path from "path";
import esbuild, { Plugin } from "esbuild";
import postcss from "postcss";
// @ts-ignore
import px2rem from "../compiled/@alitajs/postcss-plugin-px2rem";

// https://github.com/evanw/esbuild/issues/20#issuecomment-802269745
export function style(): Plugin {
  return {
    name: "style",
    setup({ onResolve, onLoad }) {
      onResolve({ filter: /\.css$/, namespace: "file" }, (args) => {
        return { path: path.resolve(args.resolveDir, args.path), namespace: "style-stub" };
      });

      onLoad({ filter: /.*/, namespace: "style-stub" }, async (args) => ({
        contents: `
              import { injectStyle } from "__style_helper__"
              import css from ${JSON.stringify(args.path)}
              injectStyle(css)
            `,
      }));

      onResolve({ filter: /\.css$/, namespace: "style-stub" }, (args) => {
        return { path: args.path, namespace: "style-content" };
      });

      onLoad({ filter: /.*/, namespace: "style-helper" }, async () => ({
        contents: `
              export function injectStyle(text) {
                if (typeof document !== 'undefined') {
                  var style = document.createElement('style')
                  var node = document.createTextNode(text)
                  style.appendChild(node)
                  document.head.appendChild(style)
                }
              }
            `,
      }));

      onResolve({ filter: /^__style_helper__$/, namespace: "style-stub" }, (args) => ({
        path: args.path,
        namespace: "style-helper",
        sideEffects: false,
      }));

      onLoad(
        {
          filter: /.*/,
          namespace: "style-content",
        },
        async (args) => {
          const { errors, warnings, outputFiles } = await esbuild.build({
            entryPoints: [args.path],
            logLevel: "silent",
            bundle: true,
            write: false,
            charset: "utf8",
            minify: true,
            loader: {
              ".svg": "dataurl",
              ".ttf": "dataurl",
            },
          });
          if (errors.length > 0) {
            return {
              errors,
              warnings,
              contents: outputFiles![0].text,
              loader: "text",
            };
          }
          try {
            const result = await postcss([
              px2rem({
                rootValue: 100,
                minPixelValue: 2,
                selectorDoubleRemList: [/.adm-/, /.ant-/],
              }),
            ]).process(outputFiles![0].text, {
              from: args.path,
              to: args.path,
            });
            return {
              errors,
              warnings,
              contents: result.css,
              loader: "text",
            };
          } catch (error) {
            return {
              errors,
              warnings,
              contents: outputFiles![0].text,
              loader: "text",
            };
          }
        }
      );
    },
  };
}
