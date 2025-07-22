import "dotenv/config";
import { SerialPort, SerialPortMock } from "serialport";
import { Server as SocketServer } from "socket.io";
import { createServer } from "http";
import { env } from "../env.js";
import { UARTParser } from "./esp32-serial-protocol/uart-parser.js";
import { CommandEncoder } from "./esp32-serial-protocol/command-encoder.js";
import { ESP32Command, type ESP32Message } from "./esp32-serial-protocol/types.js";
import { ESP32Mock } from "./mocks/index.js";
import { UICommandSchema, type UICommand } from "./esp32-serial-protocol/schemas/ui-command.js";
import { SENSOR_ID_MAP } from "./esp32-serial-protocol/mappings/sensors.js";
import { HEATER_MASK_MAP } from "./esp32-serial-protocol/mappings/heaters.js";
import { esp32MessagesLogFilter } from "@/config/logging/esp32MessagesLogFilter.jsx";

/**
 * This file contains the UART bridge for the ESP32 serial protocol
 */
class UARTBridge {
  private io: SocketServer;
  private port!: SerialPort | SerialPortMock;
  private uartParser: UARTParser;
  private esp32Mock?: ESP32Mock;
  private isUsingMock: boolean;

  /**
   * Constructor for the UART bridge
   */
  constructor() {
    // Determine if the UART mode is mock
    this.isUsingMock = env.UART_MODE === "mock";
    this.uartParser = new UARTParser();

    // Create the HTTP server
    const httpServer = createServer();
    
    // Determine the host to bind to based on environment variable (NEXT_PUBLIC_WEBSOCKET_HOST)
    const bindHost = env.NEXT_PUBLIC_WEBSOCKET_HOST ?? 'localhost';
    
    // Configure CORS based on environment variable (NEXT_PUBLIC_WEBSOCKET_HOST)
    const allowedOrigins = bindHost === 'localhost' 
      ? ['http://localhost:3000', 'http://127.0.0.1:3000']
      : [`http://${bindHost}:3000`, `http://localhost:3000`, 'http://127.0.0.1:3000'];

    // Create the Socket.io server
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: false,
      },
    });

    // Setup the UART parser events
    this.setupUARTParserEvents();

    // Initialize the serial port
    this.initializeSerial();

    // Start the HTTP server
    httpServer.listen(8081, bindHost, () => {
      console.log(`🔌 [UART Bridge] Socket.io server running on port 8081 (${bindHost})`);
    });

    process.on("SIGINT", () => {
      console.log("✋ [UART Bridge] Shutting down…");
      this.io.close(() => {
        httpServer.close(() => process.exit(0));
      });
    });
  }

  /**
   * Initialize the serial port
   */
  private initializeSerial() {
    try {
      // If the UART mode is mock
      if (this.isUsingMock) {
        console.log("🔧 [UART] Using MOCK mode");
        const mockPath = "/dev/ESP32_MOCK";

        // Bind the mock port to the ESP32_MOCK device
        SerialPortMock.binding.createPort(mockPath, {
          echo: true,
          record: true,
        });

        // Create the mock port
        this.port = new SerialPortMock({
          path: mockPath,
          baudRate: 115200,
        });

        // Handle the open event of the mock port
        this.port.on("open", () => {
          console.log("🔌 [Mock] ESP32 port opened");
          
          // Initialize and start the ESP32 mock
          this.esp32Mock = new ESP32Mock({
            statusUpdateInterval: 5000,
            initialDelay: 3000,
            randomizeStates: true,
          });

          // Start the ESP32 mock
          this.esp32Mock.start((mockData: Buffer) => {
            if (this.port instanceof SerialPortMock) {
              this.port.write(mockData);
            }
          });
        });
      } else {
        console.log("🔧 [UART] Using REAL mode");
        console.log(`🔌 [UART] Device path: ${env.UART_DEVICE_PATH}`);

        // Create the real port
        this.port = new SerialPort({
            path: env.UART_DEVICE_PATH,
          baudRate: 115200,
        });
      }

      // Setup the event handlers
      this.setupEventHandlers();
    } catch (error) {
      console.error("❌ [UART] Failed to initialize serial port:", error);
      this.io.emit("uart-error", {
        error: "Serial port initialization failed",
      });
    }
  }

  /**
   * Setup the UART parser events
   */
  private setupUARTParserEvents() {
    // Handle parsed ESP32 messages
    this.uartParser.on("message", (message: ESP32Message) => {
      if (esp32MessagesLogFilter[message.type]) {
        console.log("📡 [ESP32 → Backend]", message.type, message);
      }
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

  /**
   * Setup the event handlers
   */
  private setupEventHandlers() {
    if (!this.port) return;

    // Handle raw UART data (when the port receives data)
    this.port.on("data", (data: Buffer) => {
      this.uartParser.processData(data);
    });

    // Handle serial port errors
    this.port.on("error", (error: Error) => {
      console.error("❌ [UART] Serial port error:", error);
      this.io.emit("uart-error", { error: error.message });
    });

    // Handle serial port close
    this.port.on("close", () => {
      console.log("🔌 [UART] Serial port closed");
      // Stop mock if it's running
      if (this.esp32Mock) {
        this.esp32Mock.stop();
      }
    });

    // Handle WebSocket connections
    this.io.on("connection", (socket) => {
      console.log("🟢 [WebSocket] Frontend client connected:", socket.id);

      // Handle sending commands to the ESP32
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

      // Handle WebSocket disconnections
      socket.on("disconnect", () => {
        console.log("🔴 [WebSocket] Frontend client disconnected:", socket.id);
      });
    });
  }

  /**
   * Format the command for the ESP32
   */
  private formatCommandForESP32(uiCommandRaw: unknown): Buffer | null {
    // Validate the entire UICommand structure
    const uiCommandResult = UICommandSchema.safeParse(uiCommandRaw);
    // If the UICommand structure is not valid, return null
    if (!uiCommandResult.success) {
      console.warn(`⚠️ [UART] Invalid UICommand format:`, uiCommandResult.error.format());
      return null;
    }

    // Get the UICommand
    const uiCommand = uiCommandResult.data;

    // Switch on the action of the UICommand
    switch (uiCommand.payload.action) {
      case ESP32Command.PING:
        return CommandEncoder.encodePing();
        
      case ESP32Command.MAN_HEAT_START:
        const data = uiCommand.payload.data;
        
        // Convert sensor to sensor ID using the mapping
        const sensorId = SENSOR_ID_MAP[data.sensor];
        
        // Convert R1R2 to heater mask using the mapping
        const heaterMask = HEATER_MASK_MAP[data.R1R2];
        
        // Convert temperature to scaled value (×10)
        const targetTemp = Math.round(data.temperatureSet * 10);
        
        console.log(`🔥 [UART] Starting heating: Sensor=${sensorId}, Target=${targetTemp} (${data.temperatureSet}°C), Duration=${data.durationSet}ms, Mask=${heaterMask}`);
        
        return CommandEncoder.encodeManualHeatStart(sensorId, targetTemp, data.durationSet, heaterMask);
        
      case ESP32Command.MAN_HEAT_STOP:
        console.log("🛑 [UART] Stop heating command received");
        return CommandEncoder.encodeManualHeatStop();
    }
  }

  /**
   * Simulate ESP32 responses to commands in mock mode
   */
  private simulateResponseForCommand(uiCommand: UICommand): void {
    if (!this.esp32Mock) return;

    // Get the payload of the UICommand
    const payload = uiCommand.payload;
    
    // Simulate responses with a slight delay to mimic real ESP32
    setTimeout(() => {
      if (!this.esp32Mock) return;

      // Switch on the action of the UICommand
      switch (payload.action) {
        case ESP32Command.PING:
          this.esp32Mock.sendPong();
          break;
          
        case ESP32Command.MAN_HEAT_START:
          // Send ACK first
          this.esp32Mock.sendAck(0x11); // MAN_HEAT_START command ID
          
          // Then send multiple MANUAL_HEAT_STATUS messages (like real ESP32)
          setTimeout(() => this.esp32Mock?.sendManualHeatStatus(true, 0x11, 0x22, 0x33), 500);
          setTimeout(() => this.esp32Mock?.sendManualHeatStatus(true, 0x11, 0x22, 0x33), 1500);
          setTimeout(() => this.esp32Mock?.sendManualHeatStatus(false, 0x11, 0x22, 0x33), 2500);
          break;
          
        case ESP32Command.MAN_HEAT_STOP:
          // Send ACK for stop command
          this.esp32Mock.sendAck(0x14); // MAN_HEAT_STOP command ID
          break;
      }
    }, 100); // Small delay to simulate processing time
  }
}

new UARTBridge();

export default UARTBridge;
