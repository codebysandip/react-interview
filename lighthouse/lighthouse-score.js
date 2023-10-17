import { spawnSync } from "child_process";
import chromeLauncher from "chrome-launcher";
import { createRequire } from "module";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "path";
import { cwd, exit } from "process";
const require = createRequire(import.meta.url);

const build = spawnSync("npm run build", { stdio: "inherit", encoding: "utf-8", shell: true });
if (build.status) {
  exit(build.status);
}
const deploy = spawnSync("npm run pm2:prod", {
  stdio: "inherit",
  encoding: "utf-8",
  shell: true,
});
if (deploy.status) {
  exit(deploy.status);
}
let count = 0;
startLighthouse();

const lighthouse = require("lighthouse");
function startLighthouse() {
  count++;
  (async () => {
    const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
    const options = {
      logLevel: "info",
      output: "json",
      outputPath: "./lighthouse/report.json",
      port: chrome.port,
      // onlyCategories: ["performance", "seo"],
      // screenEmulation: { width: 1280, height: 720 },
      // budgetPath: join(cwd(), "lighthouse/budget.json"),
    };
    const runnerResult = await lighthouse("http://localhost:5200", options);

    // `.report` is the HTML report as a string
    const reportHtml = runnerResult.report;
    const categories = runnerResult.lhr.categories;
    writeFileSync(options.outputPath, reportHtml);
    let svgStr = readFileSync(join(cwd(), "lighthouse", "pagespeed_placeholder.svg"), {
      encoding: "utf-8",
    });
    const perfScore = categories.performance.score * 100;
    const accessibilityScore = categories.accessibility.score * 100;
    const bestPracticesScore = categories["best-practices"].score * 100;
    const seoScore = categories.seo.score * 100;
    const pwaScore = categories.pwa.score * 100;
    if (count > 1) {
      let isError = false;
      if (perfScore < 90) {
        isError = true;
        console.error(`Performance score ${perfScore} is less than 90`);
      }
      if (accessibilityScore < 90) {
        console.error(`Accessibility score ${accessibilityScore} is less than 90`);
      }
      if (bestPracticesScore < 90) {
        console.error(`Best Practices score ${bestPracticesScore} is less than 90`);
      }
      if (seoScore < 90) {
        isError = true;
        console.error(`Seo score ${seoScore} is less than 90`);
      }
      if (pwaScore < 90) {
        isError = true;
        console.error(`PWA score ${pwaScore} is less than 90`);
      }
      spawnSync("npx pm2 delete all", { stdio: "inherit", encoding: "utf-8", shell: true });
      if (isError) {
        throw new Error(`Lighthouse score should be greater than 90 for each category`);
      }
    }

    // replace score
    svgStr = svgStr
      .replace("{performance_score}", perfScore)
      .replace("{accessibility_score}", accessibilityScore)
      .replace("{best_practices_score}", bestPracticesScore)
      .replace("{seo_score}", seoScore)
      .replace("{pwa_score}", pwaScore);

    // replace stroke
    svgStr = svgStr
      .replace(
        "{performance_stroke}",
        `${(360 * perfScore) / 100}, ${360 - (360 * perfScore) / 100}`,
      )
      .replace(
        "{accessibility_stroke}",
        `${(360 * accessibilityScore) / 100}, ${360 - (360 * accessibilityScore) / 100}`,
      )
      .replace(
        "{best_practices_stroke}",
        `${(360 * bestPracticesScore) / 100}, ${360 - (360 * bestPracticesScore) / 100}`,
      )
      .replace("{seo_stroke}", `${(360 * seoScore) / 100},${360 - (360 * seoScore) / 100}`)
      .replace("{pwa_stroke}", `${(360 * pwaScore) / 100}, ${360 - (360 * pwaScore) / 100}`);

    // replace gauge color
    function getColor(score) {
      if (score >= 90) {
        return "green";
      } else if (score >= 50 && score < 90) {
        return "orange";
      } else {
        return "red";
      }
    }
    svgStr = svgStr
      .replace("{performance_gauge_color}", getColor(perfScore))
      .replace("{accessibility_gauge_color}", getColor(accessibilityScore))
      .replace("{best_practices_gauge_color}", getColor(bestPracticesScore))
      .replace("{seo_gauge_color}", getColor(seoScore))
      .replace("{pwa_gauge_color}", getColor(pwaScore));

    writeFileSync(join(cwd(), "lighthouse", "pagespeed.svg"), svgStr, { encoding: "utf-8" });

    // `.lhr` is the Lighthouse Result as a JS object
    console.log("Report is done for", runnerResult.lhr.finalUrl);
    console.log("Performance score was", perfScore);
    console.log("Accessibility score was", accessibilityScore);
    console.log("Best Practices score was", bestPracticesScore);
    console.log("Seo score was", seoScore);
    console.log("PWA score was", pwaScore);
    await chrome.kill();
    spawnSync("npx pm2 delete all", { stdio: "inherit", encoding: "utf-8", shell: true });
    exit();
  })();
}
