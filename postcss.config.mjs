import path from "node:path";

const ensurePostcssFrom = {
  postcssPlugin: "ensure-postcss-from",
  Once(root, { result }) {
    // Tailwind 4 resolves @import "tailwindcss" from result.opts.from.
    // Turbopack can call PostCSS without it, which makes Tailwind resolve one
    // directory above this app.
    if (result.opts.from) {
      return;
    }

    let usesTailwind = false;
    root.walkAtRules((rule) => {
      if (
        [
          "apply",
          "config",
          "import",
          "plugin",
          "reference",
          "tailwind",
          "theme",
          "variant",
        ].includes(rule.name)
      ) {
        usesTailwind = true;
        return false;
      }
    });

    if (usesTailwind) {
      result.opts.from = path.join(process.cwd(), "src", "app", "globals.css");
    }
  },
};

const config = {
  plugins: [ensurePostcssFrom, "@tailwindcss/postcss"],
};

export default config;
