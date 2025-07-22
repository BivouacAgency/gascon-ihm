import { useEffect, useState, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import { env } from "@/env.js";
import type { ESP32Message } from "@/server/esp32-serial-protocol/types";

// This file contains the hook to send/receive commands from/to the ESP32

// Props for the UICommand
interface UICommand {
  type: "command" | "config";
  payload: unknown;
}

// Return type for the useESP32Communication hook
interface UseESP32CommunicationReturn {
  isConnected: boolean;
  lastMessage: ESP32Message | null;
  sendCommand: (command: UICommand) => void;
  connectionError: string | null;
}

/**
 * Hook to send/receive commands from/to the ESP32
 * @returns The connection status, last message, send command function, and connection error
 */
export function useESP32Communication(): UseESP32CommunicationReturn {
  // Socket connection
  const [socket, setSocket] = useState<Socket | null>(null);
  // Connection status
  const [isConnected, setIsConnected] = useState(false);
  // Last message received from the ESP32
  const [lastMessage, setLastMessage] = useState<ESP32Message | null>(null);
  // Connection error
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Effect to connect to the WebSocket server
  useEffect(() => {
    // Determine the WebSocket server URL
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    
    // Use environment variable if set, otherwise use current hostname
    const host = env.NEXT_PUBLIC_WEBSOCKET_HOST ?? window.location.hostname;
    const socketUrl = `${protocol}//${host}:8081`;
    
    console.log(`🔌 Connecting to WebSocket server at: ${socketUrl}`);
    const newSocket = io(socketUrl);

    // Event listeners
    // Connect event
    newSocket.on("connect", () => {
      console.log("🟢 Connected to ESP32 bridge");
      setIsConnected(true);
      setConnectionError(null);
    });

    // Disconnect event
    newSocket.on("disconnect", () => {
      console.log("🔴 Disconnected from ESP32 bridge");
      setIsConnected(false);
    });

    // ESP32 data event
    newSocket.on("esp32-data", (message: ESP32Message) => {
      console.log("📡 Received from ESP32:", message);
      setLastMessage(message);
    });

    // UART error event
    newSocket.on("uart-error", (error: { error: string }) => {
      console.warn("❌ UART Error:", error);
      setConnectionError(error.error);
    });

    // Socket error event
    newSocket.on("error", (error: { message: string }) => {
      console.error("❌ Socket Error:", error);
      setConnectionError(error.message);
    });

    // Set the socket connection
    setSocket(newSocket);

    // Cleanup function to close the socket connection
    return () => {
      newSocket.close();
    };
  }, []);

  // Callback to send a command to the ESP32
  const sendCommand = useCallback(
    (command: UICommand) => {
      if (socket && isConnected) {
        console.log("📤 Sending to ESP32:", command);
        socket.emit("send-to-esp32", command);
      } else {
        console.warn("⚠️ Cannot send command: Socket not connected");
      }
    },
    [socket, isConnected],
  );

  // Return the connection status, last message, send command function, and connection error
  return {
    isConnected,
    lastMessage,
    sendCommand,
    connectionError,
  };
}
