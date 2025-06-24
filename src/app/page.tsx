"use client";

import { useESP32Communication } from "@/hooks/useESP32Communication";

export default function Accueil() {
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
    <div className="bg-grey h-full p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-white">Accueil</h1>

        {/* Connection Status */}
        <div className="bg-dark-grey mb-6 rounded-lg border border-gray-600 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-gray-100">
            ESP32 Connection
          </h2>
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-gray-200">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          {connectionError && (
            <p className="mt-2 text-red-400">Error: {connectionError}</p>
          )}
        </div>

        {/* Control Buttons */}
        <div className="bg-dark-grey mb-6 rounded-lg border border-gray-600 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-gray-100">Controls</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleStartPump}
              disabled={!isConnected}
              className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700 disabled:bg-gray-600 disabled:text-gray-400"
            >
              Start Pump
            </button>
            <button
              onClick={handleStopPump}
              disabled={!isConnected}
              className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700 disabled:bg-gray-600 disabled:text-gray-400"
            >
              Stop Pump
            </button>
            <button
              onClick={handleGetStatus}
              disabled={!isConnected}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-400"
            >
              Get Status
            </button>
          </div>
        </div>

        {/* Last Message Display */}
        <div className="bg-dark-grey rounded-lg border border-gray-600 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-gray-100">
            Latest ESP32 Data
          </h2>
          {lastMessage ? (
            <div className="rounded-lg border border-gray-600 bg-gray-800 p-4">
              <p className="mb-2">
                <strong className="text-gray-200">Type:</strong>{" "}
                <span className="text-gray-300">{lastMessage.type}</span>
              </p>
              <p className="mb-2">
                <strong className="text-gray-200">Data:</strong>
              </p>
              <pre className="overflow-x-auto rounded border border-gray-700 bg-gray-900 p-3 text-sm text-gray-300">
                {JSON.stringify(lastMessage.data, null, 2)}
              </pre>
              <p className="mt-2">
                <strong className="text-gray-200">Timestamp:</strong>{" "}
                <span className="text-gray-300">
                  {new Date(lastMessage.timestamp).toLocaleString()}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-gray-400">No data received yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
