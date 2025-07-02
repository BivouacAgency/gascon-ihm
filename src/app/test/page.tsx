"use client";

import { useESP32Communication } from "@/hooks/useESP32Communication";

export default function Test() {
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
      <div className="flex h-full gap-6">
        <div className="min-w-0 flex-shrink-0 flex-grow basis-0">
          <div className="bg-dark-grey border-grey mb-6 rounded-lg border p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-white">
              ESP32 Connection
            </h2>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-white">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            {connectionError && (
              <p className="mt-2 text-red-400">Error: {connectionError}</p>
            )}
          </div>

          <div className="bg-dark-grey border-grey mb-6 rounded-lg border p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-white">Controls</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleStartPump}
                disabled={!isConnected}
                className="disabled:bg-grey rounded-lg bg-green-600 px-6 py-3 font-medium text-white"
              >
                Start Pump
              </button>
              <button
                onClick={handleStopPump}
                disabled={!isConnected}
                className="disabled:bg-grey rounded-lg bg-red-700 px-6 py-3 font-medium text-white"
              >
                Stop Pump
              </button>
              <button
                onClick={handleGetStatus}
                disabled={!isConnected}
                className="disabled:bg-grey rounded-lg bg-blue-600 px-6 py-3 font-medium text-white"
              >
                Get Status
              </button>
            </div>
          </div>
        </div>

        <div className="w-80 min-w-0 flex-shrink">
          <div className="bg-dark-grey border-grey h-fit rounded-lg border p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Latest ESP32 Data
            </h2>
            {lastMessage ? (
              <div className="border-grey bg-dark-grey rounded-lg border p-4">
                <p className="mb-2">
                  <strong className="text-white">Type:</strong>{" "}
                  <span className="text-white">{lastMessage.type}</span>
                </p>
                <p className="mb-2">
                  <strong className="text-white">Data:</strong>
                </p>
                <pre className="bg-grey border-grey overflow-x-auto rounded p-3 text-sm text-white">
                  {JSON.stringify(lastMessage.data, null, 2)}
                </pre>
                <p className="mt-2">
                  <strong className="text-white">Timestamp:</strong>{" "}
                  <span className="text-white">
                    {new Date(lastMessage.timestamp).toLocaleString()}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-white">No data received yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
