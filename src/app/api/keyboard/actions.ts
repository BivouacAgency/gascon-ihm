"use server";

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function isKeyboardRunning(): Promise<boolean> {
  try {
    const { stdout } = await execAsync("pgrep squeekboard");
    return stdout.trim().length > 0;
  } catch {
    return false;
  }
}

async function startKeyboard(): Promise<void> {
  try {
    // Start squeekboard in the background
    await execAsync("squeekboard &");
    
    // Wait a bit to ensure the process starts
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verify it's running
    const running = await isKeyboardRunning();
    if (!running) {
      throw new Error("Failed to start keyboard process");
    }
  } catch (error) {
    throw new Error(`Failed to start keyboard: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function showKeyboard() {
  try {
    const isRunning = await isKeyboardRunning();
    if (isRunning) {
      return { status: "shown", message: "Keyboard was already running" };
    }

    await startKeyboard();
    return { status: "shown" };
  } catch (error) {
    throw new Error(`Failed to show keyboard: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function hideKeyboard() {
  try {
    const isRunning = await isKeyboardRunning();
    if (!isRunning) {
      return { status: "hidden", message: "Keyboard was not running" };
    }

    await execAsync("pkill squeekboard");
    
    // Verify it's stopped
    const stillRunning = await isKeyboardRunning();
    if (stillRunning) {
      throw new Error("Failed to stop keyboard process");
    }
    
    return { status: "hidden" };
  } catch (error) {
    throw new Error(`Failed to hide keyboard: ${error instanceof Error ? error.message : String(error)}`);
  }
} 