import axios from "axios";
import { spawn, spawnSync } from "node:child_process";
import { exit } from "node:process";

(async () => {
  const TEST_API_PORT = 7002;
  const REACT_PORT = 7000;
  const buildProcess = spawn(
    `cross-env TEST_API_PORT=${TEST_API_PORT} PORT=${REACT_PORT} npm run start:cypress`,
    [],
    {
      stdio: "inherit",
      shell: true,
      detached: true,
      // signal,
    },
  );
  const intervalId = setInterval(async () => {
    try {
      const resp = await axios.get(`http://localhost:${REACT_PORT}`, { responseType: "text" });
      clearInterval(intervalId);
      if (resp.status === 200) {
        spawnSync(
          // eslint-disable-next-line max-len
          `cross-env PORT=${REACT_PORT} npm run cypress:run`,
          {
            stdio: "inherit",
            shell: true,
          },
        );
        buildProcess.stdout?.destroy();
        buildProcess.stderr?.destroy();
        process.kill(-(buildProcess.pid || 0));
        exit();
      }
    } catch {}
  }, 200);
})();
