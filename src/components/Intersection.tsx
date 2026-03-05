import { Car } from 'lucide-react';
import { TrafficSignal } from './TrafficSignal';
import type { TrafficSignal as TrafficSignalType } from '../lib/trafficController';

interface IntersectionProps {
  signals: TrafficSignalType[];
  vehicleCounts: Record<string, number>;
}

export function Intersection({ signals, vehicleCounts }: IntersectionProps) {
  const getSignal = (direction: string) =>
    signals.find((s) => s.direction === direction);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative bg-gray-200 rounded-lg p-8">
        <div className="relative w-full aspect-square">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-gray-700 rounded"></div>

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-full bg-gray-600"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-24 w-full bg-gray-600"></div>

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-yellow-400 opacity-50"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-full bg-yellow-400 opacity-50"></div>
            </div>
          </div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <TrafficSignal
              state={getSignal('north')?.currentState || 'red'}
              direction="north"
              timer={getSignal('north')?.remainingTime || 0}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <TrafficSignal
              state={getSignal('south')?.currentState || 'red'}
              direction="south"
              timer={getSignal('south')?.remainingTime || 0}
            />
          </div>

          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <TrafficSignal
              state={getSignal('west')?.currentState || 'red'}
              direction="west"
              timer={getSignal('west')?.remainingTime || 0}
            />
          </div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <TrafficSignal
              state={getSignal('east')?.currentState || 'red'}
              direction="east"
              timer={getSignal('east')?.remainingTime || 0}
            />
          </div>

          <div className="absolute top-20 left-1/2 -translate-x-1/2 flex flex-col gap-1">
            {Array.from({ length: Math.min(vehicleCounts.north || 0, 5) }).map(
              (_, i) => (
                <Car
                  key={i}
                  className="w-5 h-5 text-blue-600 transform rotate-180"
                />
              )
            )}
          </div>

          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col gap-1">
            {Array.from({ length: Math.min(vehicleCounts.south || 0, 5) }).map(
              (_, i) => (
                <Car key={i} className="w-5 h-5 text-blue-600" />
              )
            )}
          </div>

          <div className="absolute left-20 top-1/2 -translate-y-1/2 flex flex-row gap-1">
            {Array.from({ length: Math.min(vehicleCounts.west || 0, 5) }).map(
              (_, i) => (
                <Car
                  key={i}
                  className="w-5 h-5 text-blue-600 transform -rotate-90"
                />
              )
            )}
          </div>

          <div className="absolute right-20 top-1/2 -translate-y-1/2 flex flex-row gap-1">
            {Array.from({ length: Math.min(vehicleCounts.east || 0, 5) }).map(
              (_, i) => (
                <Car
                  key={i}
                  className="w-5 h-5 text-blue-600 transform rotate-90"
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
