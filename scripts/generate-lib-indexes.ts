import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates an `index.ts` barrel file in every folder under `src/lib`.
 *
 * @remarks
 * Run with `npm run gen:lib` (also runs automatically before a production
 * build). Each barrel re-exports the folder's files and exposes subfolders as
 * PascalCase namespaces. Existing `index.ts` files are overwritten, so never
 * edit them by hand.
 */

/**
 * Converts a kebab-case folder name to PascalCase.
 *
 * @param str - Name such as `context-menu`.
 * @returns The PascalCase name, such as `ContextMenu`.
 */
function toPascalCase(str: string) {
  return str.replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase());
}

const ROOT_DIR = path.resolve(__dirname, "../src/lib");
const excludedRelativePaths = new Set<string>([
  "i18n/locales",
  "__tests__",
  ".DS_Store",
]);

/**
 * Tells whether a path must be skipped by the generator.
 *
 * @param fullPath - Absolute path of a file or folder under `src/lib`.
 * @returns True if the path or one of its parents is in the exclusion list.
 */
function isExcluded(fullPath: string): boolean {
  const relative = path.relative(ROOT_DIR, fullPath);
  for (const excluded of excludedRelativePaths) {
    if (relative === excluded || relative.startsWith(`${excluded}/`)) {
      return true;
    }
  }
  return false;
}

/**
 * Recursively (re)writes the `index.ts` barrel for a folder and its subfolders.
 *
 * @param dir - Absolute path of the folder to process.
 */
function generateIndex(dir: string) {
  const entries = fs.readdirSync(dir);
  const files: string[] = [];
  const folders: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (isExcluded(fullPath)) continue;

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      folders.push(entry);
    } else if (
      (entry.endsWith(".ts") || entry.endsWith(".tsx")) &&
      !entry.endsWith(".d.ts") &&
      entry !== "index.ts" &&
      entry !== "index.tsx"
    ) {
      files.push(entry);
    }
  }

  for (const folder of folders) {
    generateIndex(path.join(dir, folder));
  }

  const exportFiles = files.map((f) => {
    const name = path.parse(f).name;
    return `export * from './${name}';`;
  });

  const importFolders = folders.map((f) => {
    const pascalName = toPascalCase(f);
    return `import * as ${pascalName} from './${f}';`;
  });

  const exportFolders = folders.map((f) => {
    const pascalName = toPascalCase(f);
    return `  ${pascalName},`;
  });

  const content =
    importFolders.join("\n") +
    (importFolders.length > 0 && exportFiles.length > 0 ? "\n\n" : "") +
    exportFiles.join("\n") +
    (folders.length > 0
      ? `\n\nexport {\n${exportFolders.join("\n")}\n};\n`
      : "\n");

  fs.writeFileSync(path.join(dir, "index.ts"), content);
}

generateIndex(ROOT_DIR);
