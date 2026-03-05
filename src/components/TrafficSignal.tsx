import type { SignalState } from '../lib/trafficController';

interface TrafficSignalProps {
  state: SignalState;
  direction: string;
  timer: number;
}

export function TrafficSignal({ state, direction, timer }: TrafficSignalProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-gray-900 rounded-lg p-3 shadow-lg">
        <div className="flex flex-col gap-2">
          <div
            className={`w-8 h-8 rounded-full transition-all duration-300 ${
              state === 'red'
                ? 'bg-red-500 shadow-lg shadow-red-500/50'
                : 'bg-red-900/30'
            }`}
          />
          <div
            className={`w-8 h-8 rounded-full transition-all duration-300 ${
              state === 'yellow'
                ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50'
                : 'bg-yellow-900/30'
            }`}
          />
          <div
            className={`w-8 h-8 rounded-full transition-all duration-300 ${
              state === 'green'
                ? 'bg-green-500 shadow-lg shadow-green-500/50'
                : 'bg-green-900/30'
            }`}
          />
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium text-gray-700 capitalize">
          {direction}
        </div>
        <div className="text-xs text-gray-500">{timer}s</div>
      </div>
    </div>
  );
}
