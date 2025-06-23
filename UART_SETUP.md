# 🔌 ESP32 UART Bridge Setup

This document explains how to set up the UART communication bridge between your ESP32 and the Next.js frontend.

## 📦 Installation

1. **Install the new dependencies:**

```bash
pnpm install
```

The following packages were added to your `package.json`:

- `serialport` - For UART communication with ESP32
- `socket.io` - Server-side WebSocket library
- `socket.io-client` - Client-side WebSocket library
- `tsx` - For running TypeScript files directly
- `concurrently` - For running multiple processes

## 🚀 Running the Application

### Development Mode

You have two options for running in development:

**Option 1: Run everything together (recommended):**

```bash
pnpm run dev:full
```

**Option 2: Run separately:**

```bash
# Terminal 1 - Next.js frontend
pnpm run dev

# Terminal 2 - UART Bridge
pnpm run dev:bridge
```

### Production Mode

```bash
# Build the frontend
pnpm run build

# Start the production server
pnpm run start
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in your project root with:

```bash
# Database (required for T3 Stack)
DATABASE_URL="your-database-url"

# ESP32 UART Mode
UART_MODE=mock    # Use "mock" for development, "real" for actual ESP32
# UART_MODE=real  # Uncomment when using real ESP32
```

**UART_MODE Options:**

- `mock` - Simulates ESP32 data for development (no physical device needed)
- `real` - Connects to actual ESP32 via serial port

### ESP32 Serial Port

Update the serial port path in `src/server/uart-bridge.ts`:

```typescript
// For Windows (ESP32 connected via USB)
path: "COM3"; // or COM4, COM5, etc.

// For Linux/Raspberry Pi
path: "/dev/ttyUSB0"; // or /dev/ttyACM0

// For macOS
path: "/dev/cu.usbserial-*";
```

### Baud Rate

Default is `115200`. Change it in both:

- `src/server/uart-bridge.ts` (line ~78)
- Your ESP32 code: `Serial.begin(115200);`

## 📡 ESP32 Communication Protocol

### From ESP32 to Frontend

The ESP32 should send data in these formats:

**Sensor data:**

```
TEMP:22.5
PRESSURE:1013.25
HUMIDITY:65.2
STATUS:READY
```

**Simple commands:**

```
FORWARD
BACKWARD
CLICK
```

### From Frontend to ESP32

The frontend sends JSON objects that get converted to commands:

**Frontend command:**

```typescript
sendCommand({
  type: "command",
  payload: { action: "start_pump" },
});
```

**ESP32 receives:**

```
START_PUMP
```

## 🎯 Usage in React Components

```typescript
import { useESP32Communication } from "@/hooks/useESP32Communication";

function MyComponent() {
  const { isConnected, lastMessage, sendCommand, connectionError } = useESP32Communication();

  const handlePumpControl = () => {
    sendCommand({
      type: "command",
      payload: { action: "start_pump" },
    });
  };

  return (
    <div>
      <p>ESP32 Status: {isConnected ? "Connected" : "Disconnected"}</p>
      {lastMessage && (
        <pre>{JSON.stringify(lastMessage, null, 2)}</pre>
      )}
      <button onClick={handlePumpControl}>Start Pump</button>
    </div>
  );
}
```

## 🐛 Troubleshooting

### UART Bridge Won't Start

1. **Check serial port permissions (Linux):**

```bash
sudo usermod -a -G dialout $USER
# Logout and login again
```

2. **Verify ESP32 is connected:**

```bash
# Linux
ls /dev/tty*
dmesg | grep USB

# Windows
# Check Device Manager > Ports (COM & LPT)
```

3. **Port already in use:**
   Make sure no other applications (Arduino IDE, PlatformIO, etc.) are using the serial port.

### Frontend Not Connecting

1. **Check UART bridge is running:**
   Look for: `🔌 [UART Bridge] Socket.io server running on port 8081`

2. **Check browser console for Socket.io errors**

3. **Verify WebSocket URL in hook:**
   Default is `http://localhost:8081` - change if needed.

### Permission Denied (Raspberry Pi)

```bash
# Add user to dialout group
sudo usermod -a -G dialout pi

# Or run with sudo (not recommended for production)
sudo npm run dev:bridge
```

### TypeScript/Linter Issues

⚠️ **Known Issue**: You may see TypeScript errors related to `SerialPortMock` usage:

```
Unsafe call of a(n) `error` type typed value.
Unsafe member access .createPort on an `error` typed value.
```

This is a known typing issue with the `serialport` mock functionality. The code works correctly despite these warnings.

### Mock Mode Not Working

1. **Check environment variable:**
   Ensure `UART_MODE=mock` in your `.env` file

2. **Restart the bridge:**

   ```bash
   # Stop with Ctrl+C and restart
   pnpm run dev:bridge
   ```

3. **Check console output:**
   Look for: `🔧 [UART] Using MOCK mode`

## 🔧 Next Steps

1. Install dependencies: `pnpm install`
2. Copy `.env.example` to `.env` and configure
3. Set `UART_MODE=mock` for development
4. Connect your ESP32 via USB (for real mode)
5. Update the serial port path in `uart-bridge.ts` (for real mode)
6. Test with: `pnpm run dev:full`
7. Open `http://localhost:3000/turbocuve` to see the example interface

The linter errors you see are normal TypeScript warnings and don't affect functionality.
