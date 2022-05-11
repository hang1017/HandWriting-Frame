import { Plugin, build } from "esbuild";
import path from "path";

export function style(): Plugin {
  return {
    name: "style",
    setup: ({ onLoad, onResolve }) => {
      /**
       * 第一步
       * 匹配所有的 .css 文件，将这些文件的命名空间定义为 style-stub
       */
      onResolve({ filter: /\.css$/, namespace: "file" }, (args) => {
        return {
          namespace: "style-stub",
          path: path.resolve(args.resolveDir, args.path),
        };
      });

      /**
       * 第二步
       * 修改 style-stub 返回的所有的内容
       */
      onLoad({ filter: /.*/, namespace: "style-stub" }, async (args) => {
        console.log(args.path);
        return {
          contents: `
            import { injectStyle } from '__style_helper__';
            import css from ${JSON.stringify(args.path)};
            injectStyle(css);
          `,
        };
      });

      /**
       * 第三步
       * 因为没有这个 __style_helper__, 所以需要在这个路径加载的时候，返回我们需要的代码，这样可能
       * 取 style-stub 全部文件，定义一个 __style_helper__ 的虚拟路径，将此定义为 style-helper
       */
      onResolve({ filter: /\__style_helper__$/, namespace: "style-stub" }, (args) => ({
        path: args.path,
        namespace: "style-helper",
        sideEffects: false,
      }));

      /**
       * 第四步
       * 定义了 style-helper 用于处理 __style_helper__ 的内容，所以要给 style-helper 增加逻辑。
       * 创建 style 样式，创建 textNode，增加到头部。
       * 这样 我们定义的 __style_helper__ 就有内容了。
       */
      onLoad({ filter: /\.*/, namespace: "style-helper" }, async (args) => {
        return {
          contents: `
            export function injectStyle(text) {
              if(typeof document !== "undefined") {
                var style = document.createElement('style');
                var node = document.createTextNode(text);
                style.appendChild(node);
                document.head.appendChild(style);
              }
            }
          `,
        };
      });

      /**
       * 第五步
       */
      onResolve({ filter: /\.css$/, namespace: "style-stub" }, (args) => ({
        path: args.path,
        namespace: "style-content",
      }));

      /**
       * 第六步
       */
      onLoad({ filter: /\.*/, namespace: "style-content" }, async (args) => {
        const { errors, warnings, outputFiles } = await build({
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
