import esbuild, { Plugin } from "esbuild";
import path from "path";

export function styles(): Plugin {
  return {
    name: "style",
    setup: ({ onLoad, onResolve }) => {
      onResolve({ filter: /\.css$/, namespace: "file" }, (args) => {
        return {
          namespace: "styles-stub",
          path: path.resolve(args.resolveDir, args.path),
        };
      });

      onLoad({ namespace: "styles-stub", filter: /.*/ }, async (args) => {
        return {
          contents: `
              import {injectStyle} from '__style_helper__';
              import css from ${JSON.stringify(args.path)};
              injectStyle(css)
            `,
        };
      });

      onResolve({ filter: /^__style_helper__$/, namespace: "styles-stub" }, (args) => ({
        path: args.path,
        namespace: "style-helper",
        sideEffects: false,
      }));

      onLoad({ filter: /.*/, namespace: "style-helper" }, async (args) => {
        return {
          contents: `
            export function injectStyle(text) {
              if(typeof document !== 'undefined') {
                var style  = document.createElement('style');
                var node = document.createTextNode(text);
                style.appendChild(node);
                document.head.appendChild(style);
              }
            }
          `,
        };
      });

      onResolve({ namespace: "styles-stub", filter: /\.css$/ }, (args) => ({
        path: args.path,
        namespace: "style-content",
      }));

      onLoad({ filter: /.*/, namespace: "style-content" }, async (args) => {
        const buildData = await esbuild.build({
          bundle: true,
          write: false,
          minify: true,
          entryPoints: [args.path],
          charset: "utf8",
          logLevel: "silent",
          loader: {
            ".svg": "dataurl",
            ".ttf": "dataurl",
          },
        });

        const { errors, warnings, outputFiles } = buildData;
        return {
          errors,
          warnings,
          contents: outputFiles![0].text,
          loader: "text",
        };
      });
    },
  };
}
