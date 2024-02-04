import path from "path";

function toPascalCase(text) {
  return text.replace(/(^\w|-\w)/g, (v) => v.replace(/-/, "").toUpperCase());
}

export default {
  indexTemplate: (filePaths) => {
    const exportEntries = filePaths.map(({ path: filePath }) => {
      const basename = path.basename(filePath, path.extname(filePath));
      const exportName = `Svg${toPascalCase(basename)}`;
      return `export { default as ${exportName} } from './tsx/${basename}'`;
    });
    return exportEntries.join("\n");
  },
  filenameCase: "kebab",
  icon: "1em",
  typescript: true,
  noPrettier: true,
  jsxRuntime: "automatic",
  svgProps: {
    role: "img",
  },
};
