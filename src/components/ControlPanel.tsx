import { useState } from 'react';
import { Plus, Minus, Play, Pause } from 'lucide-react';
import type { Direction } from '../lib/trafficController';

interface ControlPanelProps {
  onVehicleCountChange: (direction: Direction, delta: number) => void;
  onToggleSimulation: () => void;
  isRunning: boolean;
  vehicleCounts: Record<Direction, number>;
}

export function ControlPanel({
  onVehicleCountChange,
  onToggleSimulation,
  isRunning,
  vehicleCounts,
}: ControlPanelProps) {
  const directions: Direction[] = ['north', 'south', 'east', 'west'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Vehicle Detection Control</h2>
        <button
          onClick={onToggleSimulation}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {directions.map((direction) => (
          <div
            key={direction}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="text-sm font-medium text-gray-700 capitalize mb-3">
              {direction}
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => onVehicleCountChange(direction, -1)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={vehicleCounts[direction] <= 0}
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="text-2xl font-bold text-gray-900">
                {vehicleCounts[direction]}
              </div>
              <button
                onClick={() => onVehicleCountChange(direction, 1)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>AI-Based Detection:</strong> Uses YOLOv8-Nano neural network for real-time vehicle detection. Adaptive signal timing (15-60s) adjusts based on detected vehicle count and queue length.
        </p>
      </div>
    </div>
  );
}
