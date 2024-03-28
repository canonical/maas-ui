import { test } from "@playwright/test";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function runMAASCommand(
  action: string,
  params: string
): Promise<void> {
  const apiKey = process.env.MAAS_API_KEY;
  const maasURL = process.env.MAAS_URL;

  if (!apiKey || !maasURL) {
    throw new Error(
      "MAAS_API_KEY or MAAS_URL environment variables are not set."
    );
  }

  // Login command
  const loginCommand = `maas login admin http://${maasURL}/MAAS/api/2.0/ ${apiKey}`;
  const actionCommand = `maas admin ${action} ${params}`;
  await execAsync(loginCommand);

  const { stdout, stderr } = await execAsync(actionCommand);

  if (stderr) {
    throw new Error(`Error executing MAAS command: ${stderr}`);
  }

  console.log(stdout);
}

test("example test using runMAASCommand", async () => {
  await runMAASCommand("zones create", "name=zone-1");
});
