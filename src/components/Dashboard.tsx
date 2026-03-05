import { Activity, Clock, TrendingUp, Zap, Brain, Gauge } from 'lucide-react';

interface MetricsProps {
  avgWaitTime: number;
  throughput: number;
  latency: number;
  cycleTime: number;
  modelConfidence?: number;
}

export function Dashboard({ avgWaitTime, throughput, latency, cycleTime, modelConfidence }: MetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Avg Wait Time</p>
            <p className="text-2xl font-bold text-gray-900">{avgWaitTime.toFixed(1)}s</p>
          </div>
          <Clock className="w-10 h-10 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Throughput</p>
            <p className="text-2xl font-bold text-gray-900">{throughput}</p>
            <p className="text-xs text-gray-500">vehicles/min</p>
          </div>
          <TrendingUp className="w-10 h-10 text-green-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Model Inference</p>
            <p className="text-2xl font-bold text-gray-900">{latency.toFixed(1)}ms</p>
          </div>
          <Zap className="w-10 h-10 text-yellow-500" />
        </div>
        <div className="mt-2 text-xs text-gray-600">
          CNN inference time
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Detection Confidence</p>
            <p className="text-2xl font-bold text-gray-900">{((modelConfidence || 0) * 100).toFixed(0)}%</p>
          </div>
          <Brain className="w-10 h-10 text-purple-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Cycle Time</p>
            <p className="text-2xl font-bold text-gray-900">{cycleTime}s</p>
          </div>
          <Activity className="w-10 h-10 text-red-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Model</p>
            <p className="text-lg font-bold text-gray-900">YOLOv8-Nano</p>
          </div>
          <Gauge className="w-10 h-10 text-indigo-500" />
        </div>
        <p className="text-xs text-gray-500 mt-2">3.2M parameters</p>
      </div>
    </div>
  );
}
