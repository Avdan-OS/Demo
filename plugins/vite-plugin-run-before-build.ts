import { exec } from "child_process";
import type { Plugin } from "vite";

/** Options for {@link runBeforeBuildPlugin}. */
interface RunBeforeBuildPluginOptions {
  /** Executable to run. Defaults to `npm`. */
  command?: string;
  /** Arguments passed to the command. Defaults to `["run", "gen:lib"]`. */
  args?: string[];
  /** Working directory. Defaults to `process.cwd()`. */
  cwd?: string;
}

/**
 * Vite plugin that runs a shell command before a production build starts.
 *
 * @remarks
 * By default it regenerates the `src/lib` barrel files (`npm run gen:lib`),
 * so a build never uses stale indexes. It applies to `vite build` only, and a
 * failing command aborts the build.
 *
 * @param options - Configuration options for the command.
 * @returns Vite plugin object.
 */
export default function runBeforeBuildPlugin(
  options: RunBeforeBuildPluginOptions = {},
): Plugin {
  const command = options.command ?? "npm";
  const args = options.args ?? ["run", "gen:lib"];
  const cwd = options.cwd ?? process.cwd();

  return {
    name: "run-before-build",
    apply: "build",
    async buildStart() {
      const fullCommand = `${command} ${args.join(" ")}`;
      console.log(`[run-before-build] Running command: ${fullCommand}`);

      return new Promise<void>((resolve, reject) => {
        const child = exec(fullCommand, { cwd }, (error, stdout, stderr) => {
          if (error) {
            console.error(`[run-before-build] Error:`, error);
            reject(error);
            return;
          }
          if (stderr) console.error(`[run-before-build] stderr:\n${stderr}`);
          resolve();
        });

        child.stdout?.pipe(process.stdout);
        child.stderr?.pipe(process.stderr);
      });
    },
  };
}
