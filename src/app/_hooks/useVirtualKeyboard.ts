"use client";

import { useCallback, useState } from "react";

interface KeyboardState {
  isShowing: boolean;
  error: string | null;
}

/**
 * useVirtualKeyboard
 * @returns {Object} - Object containing showKeyboard and hideKeyboard functions, and keyboard state
 * @description This hook is used to show and hide the virtual keyboard.
 */
export function useVirtualKeyboard() {
  const [state, setState] = useState<KeyboardState>({
    isShowing: false,
    error: null
  });

  const showKeyboard = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const response = await fetch("/api/keyboard/show");
      const data = await response.json();
      
      if (!response.ok) {
        setState(prev => ({ 
          ...prev, 
          error: data.error || 'Failed to show keyboard'
        }));
        return;
      }

      setState(prev => ({ 
        ...prev, 
        isShowing: true 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Unknown error showing keyboard'
      }));
    }
  }, []);

  const hideKeyboard = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const response = await fetch("/api/keyboard/hide");
      const data = await response.json();

      if (!response.ok) {
        setState(prev => ({ 
          ...prev, 
          error: data.error || 'Failed to hide keyboard'
        }));
        return;
      }

      setState(prev => ({ 
        ...prev, 
        isShowing: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Unknown error hiding keyboard'
      }));
    }
  }, []);

  return {
    showKeyboard,
    hideKeyboard,
    isShowing: state.isShowing,
    error: state.error
  };
} 