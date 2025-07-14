"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useESP32Communication } from "@/hooks/useESP32Communication";

export default function Test() {
  const { isConnected, lastMessage, sendCommand, connectionError } =
    useESP32Communication();

  const handlePing = () => {
    sendCommand({
      type: "command",
      payload: { action: "ping" },
    });
  };

  return (
    <div className="bg-grey h-full p-6">
      <div className="flex h-full gap-6">
        <div className="min-w-0 flex-shrink-0 flex-grow basis-0">
          <Card className="mb-6">
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
          </Card>

          <Card className="mb-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Controls</h2>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handlePing}
                // disabled={!isConnected}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                🏓 Send PING
              </Button>
            </div>
          </Card>
          <Card>
            <p className="text-center leading-relaxed text-white">
              Lorem ipsum dolor: sit amet consecteur
            </p>
          </Card>
        </div>

        <div className="w-80 min-w-0 flex-shrink">
          <Card className="h-fit">
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
          </Card>
        </div>
      </div>
    </div>
  );
}
