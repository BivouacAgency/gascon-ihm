"use client";

import { useESP32Communication } from "@/hooks/useESP32Communication";

export default function TurbocuvePage() {
  const { isConnected, lastMessage, sendCommand, connectionError } =
    useESP32Communication();

  const handleStartPump = () => {
    sendCommand({
      type: "command",
      payload: { action: "start_pump" },
    });
  };

  const handleStopPump = () => {
    sendCommand({
      type: "command",
      payload: { action: "stop_pump" },
    });
  };

  const handleGetStatus = () => {
    sendCommand({
      type: "command",
      payload: { action: "get_status" },
    });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">Turbocuve Control Panel</h1>

      {/* Connection Status */}
      <div className="mb-6 rounded-lg border p-4">
        <h2 className="mb-2 text-xl font-semibold">ESP32 Connection</h2>
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
        {connectionError && (
          <p className="mt-2 text-red-600">Error: {connectionError}</p>
        )}
      </div>

      {/* Control Buttons */}
      <div className="mb-6 rounded-lg border p-4">
        <h2 className="mb-4 text-xl font-semibold">Controls</h2>
        <div className="flex gap-4">
          <button
            onClick={handleStartPump}
            disabled={!isConnected}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
          >
            Start Pump
          </button>
          <button
            onClick={handleStopPump}
            disabled={!isConnected}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-gray-400"
          >
            Stop Pump
          </button>
          <button
            onClick={handleGetStatus}
            disabled={!isConnected}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            Get Status
          </button>
        </div>
      </div>

      {/* Last Message Display */}
      <div className="rounded-lg border p-4">
        <h2 className="mb-4 text-xl font-semibold">Latest ESP32 Data</h2>
        {lastMessage ? (
          <div className="rounded bg-gray-100 p-3">
            <p>
              <strong>Type:</strong> {lastMessage.type}
            </p>
            <p>
              <strong>Data:</strong> {JSON.stringify(lastMessage.data, null, 2)}
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(lastMessage.timestamp).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No data received yet</p>
        )}
      </div>
    </div>
  );
}
