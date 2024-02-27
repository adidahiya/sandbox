// @ts-check

import console from "node:console";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

main();

function main() {
  const rootPath = resolve(import.meta.dirname, "..");
  const packageJsonPath = resolve(rootPath, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

  console.log(`Project ${packageJson.name} has the following dependencies:`);
  console.log(Object.keys(packageJson.dependencies));
  console.log(`And the following dev dependencies:`);
  console.log(Object.keys(packageJson.devDependencies));
}
