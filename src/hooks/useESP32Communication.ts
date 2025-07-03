import { useEffect, useState, useCallback } from "react";
import { io, type Socket } from "socket.io-client";

interface ESP32Message {
  type: "sensor" | "status" | "error";
  data: unknown;
  timestamp: number;
}

interface UICommand {
  type: "command" | "config";
  payload: unknown;
}

interface UseESP32CommunicationReturn {
  isConnected: boolean;
  lastMessage: ESP32Message | null;
  sendCommand: (command: UICommand) => void;
  connectionError: string | null;
}

export function useESP32Communication(): UseESP32CommunicationReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<ESP32Message | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8081");

    newSocket.on("connect", () => {
      console.log("🟢 Connected to ESP32 bridge");
      setIsConnected(true);
      setConnectionError(null);
    });

    newSocket.on("disconnect", () => {
      console.log("🔴 Disconnected from ESP32 bridge");
      setIsConnected(false);
    });

    newSocket.on("esp32-data", (message: ESP32Message) => {
      console.log("📡 Received from ESP32:", message);
      setLastMessage(message);
    });

    newSocket.on("uart-error", (error: { error: string }) => {
      console.error("❌ UART Error:", error);
      setConnectionError(error.error);
    });

    newSocket.on("error", (error: { message: string }) => {
      console.error("❌ Socket Error:", error);
      setConnectionError(error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

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

  return {
    isConnected,
    lastMessage,
    sendCommand,
    connectionError,
  };
}
