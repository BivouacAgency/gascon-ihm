# Gascon IHM

A Next.js-based Human-Machine Interface (HMI) for ESP32 communication built with the T3 Stack.

## 🚀 Features

- **ESP32 UART Communication**: Real-time bidirectional communication with ESP32 devices
- **WebSocket Bridge**: Socket.io-based bridge between UART and web interface
- **Mock Mode**: Development mode with simulated ESP32 data
- **Modern UI**: Built with Next.js 15, React 19, and Tailwind CSS
- **Type-Safe**: Full TypeScript support with tRPC for API communication
- **Real-Time**: Live sensor data and command feedback

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [tRPC](https://trpc.io) - End-to-end typesafe APIs
- [Prisma](https://prisma.io) - Database ORM
- [Socket.io](https://socket.io/) - Real-time communication
- [SerialPort](https://serialport.io/) - UART communication

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment:**

   ```bash
   cp .env.example .env
   # Configure your database and UART settings
   ```

3. **Run in development:**

   ```bash
   # Run everything (recommended)
   pnpm run dev:full

   # Or run separately:
   pnpm run dev        # Frontend only
   pnpm run dev:bridge # UART bridge only
   ```

4. **Open the interface:**
   - Frontend: http://localhost:3000
   - ESP32 Control Panel: http://localhost:3000/turbocuve

## 🔌 ESP32 Setup

For detailed ESP32 UART communication setup, see [UART_SETUP.md](./UART_SETUP.md).

### Quick ESP32 Setup

1. Connect your ESP32 via USB
2. Update the serial port in `src/server/uart-bridge.ts`:
   ```typescript
   // Windows: "COM3", "COM4", etc.
   // Linux: "/dev/ttyUSB0", "/dev/ttyACM0"
   // macOS: "/dev/cu.usbserial-*"
   ```
3. Set `UART_MODE=real` in your `.env` file
4. Run `pnpm run dev:full`

## 📡 ESP32 Communication

### Sending Data from ESP32

```cpp
// In your ESP32 code
Serial.println("TEMP:22.5");
Serial.println("PRESSURE:1013.25");
Serial.println("STATUS:READY");
```

### Sending Commands to ESP32

```typescript
// In your React components
const { sendCommand } = useESP32Communication();

sendCommand({
  type: "command",
  payload: { action: "start_pump" },
});
```

## 🏗️ Project Structure

```
gascon-ihm/
├── src/
│   ├── app/
│   │   ├── turbocuve/          # ESP32 control interface
│   │   └── ...
│   ├── hooks/
│   │   └── useESP32Communication.ts  # React hook for ESP32 comm
│   ├── server/
│   │   ├── uart-bridge.ts      # UART ↔ WebSocket bridge
│   │   └── api/                # tRPC API routes
│   └── ...
├── prisma/
│   └── schema.prisma           # Database schema
└── ...
```

## 🔧 Development

### Environment Variables

- `UART_MODE`: Set to `"mock"` for development or `"real"` for actual ESP32
- `DATABASE_URL`: Your database connection string
- `NODE_ENV`: Development environment

### Available Scripts

- `pnpm run dev` - Start Next.js development server
- `pnpm run dev:bridge` - Start UART bridge only
- `pnpm run dev:full` - Start both frontend and UART bridge
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint
- `pnpm run typecheck` - Run TypeScript checks

## 🐛 Troubleshooting

### Common Issues

1. **Serial port permission denied** (Linux):

   ```bash
   sudo usermod -a -G dialout $USER
   # Logout and login again
   ```

2. **Port already in use**: Make sure Arduino IDE or other serial tools aren't using the port

3. **Mock mode not working**: Ensure `UART_MODE=mock` in your `.env` file

For detailed troubleshooting, see [UART_SETUP.md](./UART_SETUP.md).

## 📝 License

This project is built on the [T3 Stack](https://create.t3.gg/).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
