"use client";

import { useCallback } from "react";

/**
 * useVirtualKeyboard
 * @returns {Object} - Object containing showKeyboard and hideKeyboard functions
 * @description This hook is used to show and hide the virtual keyboard.
 */
export function useVirtualKeyboard() {
  const showKeyboard = useCallback(async () => {
    try {
      const response = await fetch("/api/keyboard/show");
      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to show keyboard:", data.error);
      }
    } catch (error) {
      console.error("Error showing keyboard:", error);
    }
  }, []);

  const hideKeyboard = useCallback(async () => {
    try {
      const response = await fetch("/api/keyboard/hide");
      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to hide keyboard:", data.error);
      }
    } catch (error) {
      console.error("Error hiding keyboard:", error);
    }
  }, []);

  return {
    showKeyboard,
    hideKeyboard,
  };
} 