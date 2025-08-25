"use client";

import { useCallback, useState } from "react";
import { z } from "zod";

interface KeyboardState {
  isShowing: boolean;
  error: string | null;
}

// Zod schema for responses from /api/keyboard/show and /api/keyboard/hide
const KeyboardOkResponseSchema = z.object({
  status: z.enum(["shown", "hidden"]),
  message: z.string().optional(),
});

const KeyboardErrorResponseSchema = z.object({
  error: z.string(),
});

const KeyboardResponseSchema = z.union([
  KeyboardOkResponseSchema,
  KeyboardErrorResponseSchema,
]);

/**
 * useVirtualKeyboard
 * @returns {Object} - Object containing showKeyboard and hideKeyboard functions, and keyboard state
 * @description This hook is used to show and hide the virtual keyboard.
 */
export function useVirtualKeyboard() {
  const [state, setState] = useState<KeyboardState>({
    isShowing: false,
    error: null,
  });

  const showKeyboard = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      const response = await fetch("/api/keyboard/show");
      const data = KeyboardResponseSchema.parse(await response.json());

      if ("error" in data) {
        setState((prev) => ({ ...prev, error: data.error }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isShowing: true,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error showing keyboard",
      }));
    }
  }, []);

  const hideKeyboard = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      const response = await fetch("/api/keyboard/hide");
      const data = KeyboardResponseSchema.parse(await response.json());

      if ("error" in data) {
        setState((prev) => ({ ...prev, error: data.error }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isShowing: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error hiding keyboard",
      }));
    }
  }, []);

  return {
    showKeyboard,
    hideKeyboard,
    isShowing: state.isShowing,
    error: state.error,
  };
}
