import { useEffect, useState, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import { env } from "@/env.js";
import type { ESP32Message } from "@/server/esp32-serial-protocol/types";

// This file contains the hook to send/receive commands from/to the ESP32

// Props for the UICommand
interface UICommand {
  payload: unknown;
}

// Return type for the useESP32Communication hook
interface UseESP32CommunicationReturn {
  isConnected: boolean;
  lastMessage: ESP32Message | null;
  sendCommand: (command: UICommand) => void;
  connectionError: string | null;
}

// Singleton socket instance to ensure only one WebSocket connection
let socketInstance: Socket | null = null;
// Function to create or retrieve the existing socket instance
function getSocketInstance(): Socket {
  if (!socketInstance) {
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    const host = env.NEXT_PUBLIC_WEBSOCKET_HOST ?? window.location.hostname;
    const socketUrl = `${protocol}//${host}:8081`;
    console.log(`🔌 [Socket] Connecting to: ${socketUrl}`);
    socketInstance = io(socketUrl);
  }
  return socketInstance;
}

/**
 * Hook to send/receive commands from/to the ESP32
 * Uses a shared WebSocket instance to avoid multiple connections.
 */
export function useESP32Communication(): UseESP32CommunicationReturn {
  // Connection status
  const [isConnected, setIsConnected] = useState(false);
  // Last message received from the ESP32
  const [lastMessage, setLastMessage] = useState<ESP32Message | null>(null);
  // Connection error
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const socket = getSocketInstance();

    const handleConnect = () => { console.log("🟢 Connected to ESP32 bridge"); setIsConnected(true); setConnectionError(null); };
    const handleDisconnect = () => { console.log("🔴 Disconnected from ESP32 bridge"); setIsConnected(false); };
    const handleEsp32Data = (message: ESP32Message) => setLastMessage(message);
    const handleUartError = (error: { error: string }) => setConnectionError(error.error);
    const handleSocketError = (error: { message: string }) => setConnectionError(error.message);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("esp32-data", handleEsp32Data);
    socket.on("uart-error", handleUartError);
    socket.on("error", handleSocketError);

    if (socket.connected) setIsConnected(true);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("esp32-data", handleEsp32Data);
      socket.off("uart-error", handleUartError);
      socket.off("error", handleSocketError);
    };
  }, []);

  const sendCommand = useCallback((command: UICommand) => {
    const socket = getSocketInstance();
    if (isConnected) {
      console.log("📤 Sending to ESP32:", command);
      socket.emit("send-to-esp32", command);
    } else {
      console.warn("⚠️ Cannot send command: Socket not connected");
    }
  }, [isConnected]);

  return {
    isConnected,
    lastMessage,
    sendCommand,
    connectionError,
  };
}
