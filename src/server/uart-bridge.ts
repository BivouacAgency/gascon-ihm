import "dotenv/config";
import { SerialPort, SerialPortMock } from "serialport";
import { Server as SocketServer } from "socket.io";
import { createServer } from "http";
import { env } from "../env.js";
import { UARTParser, CommandEncoder, type ESP32Message } from "./esp32-serial-protocol/index.js";
import { ESP32Mock } from "./mocks/index.js";

interface UICommand {
  type: "command" | "config";
  payload: unknown;
}

class UARTBridge {
  private io: SocketServer;
  private port!: SerialPort | SerialPortMock;
  private uartParser: UARTParser;
  private esp32Mock?: ESP32Mock;
  private isUsingMock: boolean;

  constructor() {
    this.isUsingMock = env.UART_MODE === "mock";
    this.uartParser = new UARTParser();

    const httpServer = createServer();
    this.io = new SocketServer(httpServer, {
      cors: {
        //origin: http://localhost:3000
        origin: true, // Allow any origin for development
        methods: ["GET", "POST"],
        credentials: false,
      },
    });

    this.setupUARTParserEvents();
    this.initializeSerial();

    httpServer.listen(8081, () => {
      console.log("🔌 [UART Bridge] Socket.io server running on port 8081");
    });
  }

  private initializeSerial() {
    try {
      if (this.isUsingMock) {
        console.log("🔧 [UART] Using MOCK mode");
        const mockPath = "/dev/ESP32_MOCK";

        SerialPortMock.binding.createPort(mockPath, {
          echo: true,
          record: true,
        });

        this.port = new SerialPortMock({
          path: mockPath,
          baudRate: 115200,
        });

        this.port.on("open", () => {
          console.log("🔌 [Mock] ESP32 port opened");
          
          // Initialize and start the ESP32 mock
          this.esp32Mock = new ESP32Mock({
            statusUpdateInterval: 5000,
            initialDelay: 3000,
            randomizeStates: true,
          });
          
          this.esp32Mock.start((mockData: Buffer) => {
            if (this.port instanceof SerialPortMock) {
              this.port.write(mockData);
            }
          });
        });
      } else {
        console.log("🔧 [UART] Using REAL mode");
          console.log(`🔌 [UART] Device path: ${env.UART_DEVICE_PATH}`);

        this.port = new SerialPort({
            path: env.UART_DEVICE_PATH,
          baudRate: 115200,
        });
      }

      this.setupEventHandlers();
    } catch (error) {
      console.error("❌ [UART] Failed to initialize serial port:", error);
      this.io.emit("uart-error", {
        error: "Serial port initialization failed",
      });
    }
  }

  private setupUARTParserEvents() {
    // Handle parsed ESP32 messages
    this.uartParser.on("message", (message: ESP32Message) => {
      console.log("📡 [ESP32 → Backend]", message.type, message);
        this.io.emit("esp32-data", message);
    });

    // Handle parser errors
    this.uartParser.on("error", (error: Error) => {
      console.error("❌ [UART Parser] Error:", error.message);
      this.io.emit("uart-error", { error: error.message });
    });

    // Handle raw frames (for debugging)
    this.uartParser.on("frame", (frame) => {
      if (env.UART_VERBOSE) {
        console.log("🔍 [UART Parser] Raw frame:", {
          commandId: `0x${frame.commandId.toString(16).padStart(2, '0')}`,
          payloadLength: frame.payload.length,
        });
      }
    });
  }



  private setupEventHandlers() {
    if (!this.port) return;

    // Handle raw UART data
    this.port.on("data", (data: Buffer) => {
      this.uartParser.processData(data);
    });

    this.port.on("error", (error: Error) => {
      console.error("❌ [UART] Serial port error:", error);
      this.io.emit("uart-error", { error: error.message });
    });

    this.port.on("close", () => {
      console.log("🔌 [UART] Serial port closed");
      // Stop mock if it's running
      if (this.esp32Mock) {
        this.esp32Mock.stop();
      }
    });

    this.io.on("connection", (socket) => {
      console.log("🟢 [WebSocket] Frontend client connected:", socket.id);

      socket.on("send-to-esp32", (data: UICommand) => {
        try {
          console.log("📤 [Frontend → ESP32]", data);
          const command = this.formatCommandForESP32(data);
          if (this.port && command) {
            this.port.write(command);
            
            // In mock mode, simulate ESP32 responses
            if (this.isUsingMock && this.esp32Mock) {
              this.simulateResponseForCommand(data);
            }
          }
        } catch (error) {
          console.error("❌ [UART] Error sending to ESP32:", error);
          socket.emit("error", { message: "Failed to send command to ESP32" });
        }
      });

      socket.on("disconnect", () => {
        console.log("🔴 [WebSocket] Frontend client disconnected:", socket.id);
      });
    });
  }



  private formatCommandForESP32(uiCommand: UICommand): Buffer | null {
    if (uiCommand.type === "command" && typeof uiCommand.payload === "object") {
      const payload = uiCommand.payload as Record<string, unknown>;
      
      if (payload.action === "ping") {
        return CommandEncoder.encodePing();
      }
      
      if (payload.action === "manualHeatStart" && payload.params) {
        const params = payload.params as number[];
        if (params.length >= 3 && params[0] !== undefined && params[1] !== undefined && params[2] !== undefined) {
          return CommandEncoder.encodeManualHeatStart(params[0], params[1], params[2]);
        }
      }
    }

    console.warn("⚠️ [UART] Unknown command format:", uiCommand);
    return null;
  }

  /**
   * Simulate ESP32 responses to commands in mock mode
   */
  private simulateResponseForCommand(uiCommand: UICommand): void {
    if (!this.esp32Mock) return;

    if (uiCommand.type === "command" && typeof uiCommand.payload === "object") {
      const payload = uiCommand.payload as Record<string, unknown>;
      
      // Simulate responses with a slight delay to mimic real ESP32
      setTimeout(() => {
        if (!this.esp32Mock) return;

        switch (payload.action) {
          case "ping":
            this.esp32Mock.sendPong();
            break;
            
          case "manualHeatStart":
            // Send ACK first
            this.esp32Mock.sendAck(0x11); // MAN_HEAT_START command ID
            
            // Then send multiple MANUAL_HEAT_STATUS messages (like real ESP32)
            setTimeout(() => this.esp32Mock?.sendManualHeatStatus(true, 0x11, 0x22, 0x33), 500);
            setTimeout(() => this.esp32Mock?.sendManualHeatStatus(true, 0x11, 0x22, 0x33), 1500);
            setTimeout(() => this.esp32Mock?.sendManualHeatStatus(false, 0x11, 0x22, 0x33), 2500);
            break;
            
          default:
            console.log(`🤖 [ESP32 Mock] No response defined for action: ${payload.action}`);
            break;
        }
      }, 100); // Small delay to simulate processing time
    }
  }
}

new UARTBridge();

export default UARTBridge;
