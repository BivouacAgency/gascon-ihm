"use server";

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// squeekboard is controlled via DBus (sm.puri.OSK0) rather than process
// start/stop, so it doesn't require Wayland env vars in the Node.js process.
const DBUS_SEND =
  "dbus-send --session --type=method_call --dest=sm.puri.OSK0 /sm/puri/OSK0 sm.puri.OSK0.SetVisible";

async function setKeyboardVisible(visible: boolean): Promise<void> {
  await execAsync(`${DBUS_SEND} boolean:${visible}`);
}

export async function showKeyboard() {
  try {
    await setKeyboardVisible(true);
    return { status: "shown" };
  } catch (error) {
    throw new Error(
      `Failed to show keyboard: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function hideKeyboard() {
  try {
    await setKeyboardVisible(false);
    return { status: "hidden" };
  } catch (error) {
    throw new Error(
      `Failed to hide keyboard: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
} 