"use server";

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * isKeyboardRunning
 * @description Checks if the keyboard is running
 * @returns {Promise<boolean>} - True if the keyboard is running, false otherwise
 */
async function isKeyboardRunning(): Promise<boolean> {
  try {
    const { stdout } = await execAsync("pgrep squeekboard");
    return stdout.trim().length > 0;
  } catch {
    return false;
  }
}

/**
 * showKeyboard
 * @description Shows the keyboard
 * @returns {Promise<{status: string, message?: string}>} - The status of the keyboard
 */
export async function showKeyboard() {
  try {
    const isRunning = await isKeyboardRunning();
    if (isRunning) {
      return { status: "shown", message: "Keyboard was already running" };
    }

    await execAsync("squeekboard");
    return { status: "shown" };
  } catch (error) {
    throw new Error(`Failed to show keyboard: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * hideKeyboard
 * @description Hides the keyboard
 * @returns {Promise<{status: string, message?: string}>} - The status of the keyboard
 */
export async function hideKeyboard() {
  try {
    const isRunning = await isKeyboardRunning();
    if (!isRunning) {
      return { status: "hidden", message: "Keyboard was not running" };
    }

    await execAsync("pkill squeekboard");
    return { status: "hidden" };
  } catch (error) {
    throw new Error(`Failed to hide keyboard: ${error instanceof Error ? error.message : String(error)}`);
  }
} 