import "dotenv/config";
import { SerialPort, SerialPortMock, ReadlineParser } from "serialport";
import { Server as SocketServer } from "socket.io";
import { createServer } from "http";
import { env } from "../env.js";

// Types for ESP32 communication
interface ESP32Message {
  type: "sensor" | "status" | "error";
  data: unknown;
  timestamp: number;
}

interface UICommand {
  type: "command" | "config";
  payload: unknown;
}

class UARTBridge {
  private io: SocketServer;
  private port!: SerialPort | SerialPortMock;
  private parser!: ReadlineParser;
  private isUsingMock: boolean;

  constructor() {
    // Check environment variable for UART mode
    this.isUsingMock = env.UART_MODE === "mock";

    // Create HTTP server for Socket.io
    const httpServer = createServer();
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: "http://localhost:3000", // Frontend
        methods: ["GET", "POST"],
      },
    });

    this.initializeSerial();

    // Start Socket.io server
    httpServer.listen(8081, () => {
      console.log("🔌 [UART Bridge] Socket.io server running on port 8081");
    });
  }

  private initializeSerial() {
    try {
      if (this.isUsingMock) {
        console.log("🔧 [UART] Using MOCK mode");
        // Create a mock serial port for testing
        const mockPath = "/dev/ESP32_MOCK";

        // Create the mock port FIRST
        // TODO: fix typescript error
        SerialPortMock.binding.createPort(mockPath, {
          echo: true,
          record: true,
        });

        // THEN create the SerialPortMock instance (auto-opens)
        this.port = new SerialPortMock({
          path: mockPath,
          baudRate: 115200,
        });

        // Simulate some ESP32 data for testing
        this.port.on("open", () => {
          console.log("🔌 [Mock] ESP32 port opened, simulating data...");
          setTimeout(() => {
            if (this.port instanceof SerialPortMock) {
              // Access mock-specific methods
              // TODO: fix typescript error
              this.port.port.emitData("TEMP:23.5\n");
              this.port.port.emitData("STATUS:READY\n");
            }
          }, 2000);
        });
      } else {
        console.log("🔧 [UART] Using REAL mode");
        // Use real serial port - adjust path for your system
        const realPath = process.platform === "win32" ? "COM3" : "/dev/ttyUSB0";

        this.port = new SerialPort({
          path: realPath,
          baudRate: 115200,
        });
      }

      this.parser = this.port.pipe(new ReadlineParser({ delimiter: "\n" }));
      this.setupEventHandlers();
    } catch (error) {
      console.error("❌ [UART] Failed to initialize serial port:", error);
      this.io.emit("uart-error", {
        error: "Serial port initialization failed",
      });
    }
  }

  private setupEventHandlers() {
    if (!this.port || !this.parser) return;

    // Handle data from ESP32
    this.parser.on("data", (line: string) => {
      try {
        const command = line.trim();
        console.log("📡 [ESP32 → Backend]", command);

        // Parse ESP32 message
        const message: ESP32Message = {
          type: "sensor",
          data: this.parseESP32Message(command),
          timestamp: Date.now(),
        };

        // Broadcast to all connected frontend clients
        this.io.emit("esp32-data", message);
      } catch (error) {
        console.error("❌ [UART] Error parsing ESP32 data:", error);
      }
    });

    // Handle serial port errors
    this.port.on("error", (error: Error) => {
      console.error("❌ [UART] Serial port error:", error);
      this.io.emit("uart-error", { error: error.message });
    });

    // Handle WebSocket connections
    this.io.on("connection", (socket) => {
      console.log("🟢 [WebSocket] Frontend client connected:", socket.id);

      // Handle commands from frontend
      socket.on("send-to-esp32", (data: UICommand) => {
        try {
          console.log("📤 [Frontend → ESP32]", data);
          const command = this.formatCommandForESP32(data);
          if (this.port) {
            this.port.write(command + "\n");
          }
        } catch (error) {
          console.error("❌ [UART] Error sending to ESP32:", error);
          socket.emit("error", { message: "Failed to send command to ESP32" });
        }
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("🔴 [WebSocket] Frontend client disconnected:", socket.id);
      });
    });
  }

  private parseESP32Message(rawMessage: string): unknown {
    // Parse different types of ESP32 messages
    // Examples: "TEMP:22.5", "PRESSURE:1013.25", "STATUS:READY"

    if (rawMessage.includes(":")) {
      const [key, value] = rawMessage.split(":");
      return {
        sensor: key,
        value: isNaN(Number(value)) ? value : Number(value),
      };
    }

    // Handle simple commands like "FORWARD", "BACKWARD", "CLICK"
    return {
      command: rawMessage,
    };
  }

  private formatCommandForESP32(uiCommand: UICommand): string {
    // Format commands for ESP32 consumption
    // Example: { type: "command", payload: { action: "start_pump" } } → "START_PUMP"

    if (uiCommand.type === "command" && typeof uiCommand.payload === "object") {
      const payload = uiCommand.payload as Record<string, unknown>;
      if (payload.action && typeof payload.action === "string") {
        return payload.action.toUpperCase();
      }
    }

    return JSON.stringify(uiCommand);
  }
}

// Start the UART bridge
new UARTBridge();

export default UARTBridge;
