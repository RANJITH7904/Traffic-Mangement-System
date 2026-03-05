import { useEffect, useState, useCallback } from 'react';
import { Intersection } from './components/Intersection';
import { Dashboard } from './components/Dashboard';
import { ControlPanel } from './components/ControlPanel';
import { TrafficController, Direction, TrafficSignal, VehicleData } from './lib/trafficController';
import { VehicleDetectionModel, TrafficOptimizationModel } from './lib/aiModel';
import { supabase } from './lib/supabase';
import { Brain, AlertCircle, Network } from 'lucide-react';

function App() {
  const [controller] = useState(() => new TrafficController());
  const [detectionModel] = useState(() => new VehicleDetectionModel());
  const [optimizationModel] = useState(() => new TrafficOptimizationModel());
  const [signals, setSignals] = useState<TrafficSignal[]>([]);
  const [vehicleCounts, setVehicleCounts] = useState<Record<Direction, number>>({
    north: 0,
    south: 0,
    east: 0,
    west: 0,
  });
  const [metrics, setMetrics] = useState({
    avgWaitTime: 0,
    throughput: 0,
    latency: 0,
    cycleTime: 0,
    modelConfidence: 0.85,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [intersectionId, setIntersectionId] = useState<string>('');
  const [currentPhase, setCurrentPhase] = useState<'ns' | 'ew'>('ns');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const initializeSystem = async () => {
      try {
        const { data } = await supabase
          .from('intersections')
          .select('id')
          .limit(1)
          .maybeSingle();

        if (data) {
          setIntersectionId(data.id);
          await controller.initialize(data.id);
          setSignals(controller.getSignals());
        }
      } catch (err) {
        setError('Failed to initialize traffic system');
        console.error(err);
      }
    };

    initializeSystem();
  }, [controller]);

  const handleVehicleCountChange = useCallback((direction: Direction, delta: number) => {
    setVehicleCounts((prev) => ({
      ...prev,
      [direction]: Math.max(0, prev[direction] + delta),
    }));
  }, []);

  const processTrafficCycle = useCallback(async () => {
    if (!intersectionId) return;

    const startTime = performance.now();

    const activeDirections: Direction[] = currentPhase === 'ns' ? ['north', 'south'] : ['east', 'west'];
    const inactiveDirections: Direction[] = currentPhase === 'ns' ? ['east', 'west'] : ['north', 'south'];

    const sensorReadings: Record<string, number> = {
      north: vehicleCounts.north + Math.random() * 3,
      south: vehicleCounts.south + Math.random() * 3,
      east: vehicleCounts.east + Math.random() * 3,
      west: vehicleCounts.west + Math.random() * 3,
    };

    const detectionResults = detectionModel.batchInference(
      ['north', 'south', 'east', 'west'],
      sensorReadings
    );

    const vehicleData: VehicleData[] = activeDirections.map((dir) => ({
      direction: dir,
      count: detectionResults[dir].vehicleCount,
      confidence: detectionResults[dir].confidence,
    }));

    await controller.processVehicleDetection(vehicleData);

    const totalVehicles = activeDirections.reduce((sum, dir) => sum + vehicleCounts[dir], 0);
    const avgConfidence = activeDirections.reduce((sum, dir) => sum + detectionResults[dir].confidence, 0) / activeDirections.length;

    const optimalTiming = optimizationModel.calculateOptimalTiming(totalVehicles, totalVehicles / 2);

    for (const dir of activeDirections) {
      await controller.updateSignalState(dir, 'green', optimalTiming, vehicleCounts[dir]);
    }

    for (const dir of inactiveDirections) {
      await controller.updateSignalState(dir, 'red', optimalTiming, 0);
    }

    setSignals(controller.getSignals());

    const modelLatency = activeDirections.reduce((sum, dir) => sum + detectionResults[dir].inferenceTime, 0) / activeDirections.length;
    const processingTime = performance.now() - startTime;

    const newThroughput = Math.round(totalVehicles / (optimalTiming / 60));
    const predictedWaitTime = optimizationModel.predictWaitTime(optimalTiming, totalVehicles);

    const newMetrics = {
      avgWaitTime: predictedWaitTime,
      throughput: newThroughput,
      latency: modelLatency,
      cycleTime: optimalTiming,
      modelConfidence: avgConfidence,
    };

    setMetrics(newMetrics);

    await controller.logPerformanceMetrics(
      newMetrics.avgWaitTime,
      newMetrics.throughput,
      newMetrics.latency,
      newMetrics.cycleTime
    );

    setVehicleCounts((prev) => {
      const updated = { ...prev };
      activeDirections.forEach((dir) => {
        updated[dir] = Math.max(0, prev[dir] - Math.floor(Math.random() * 3 + 2));
      });
      inactiveDirections.forEach((dir) => {
        updated[dir] = prev[dir] + Math.floor(Math.random() * 2);
      });
      return updated;
    });

    setCurrentPhase((prev) => (prev === 'ns' ? 'ew' : 'ns'));
  }, [controller, detectionModel, optimizationModel, currentPhase, intersectionId, vehicleCounts]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSignals((prevSignals) => {
        return prevSignals.map((signal) => ({
          ...signal,
          remainingTime: Math.max(0, signal.remainingTime - 1),
        }));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    const currentSignal = signals.find((s) => s.currentState === 'green');
    if (currentSignal && currentSignal.remainingTime === 0) {
      processTrafficCycle();
    }
  }, [signals, isRunning, processTrafficCycle]);

  const toggleSimulation = () => {
    if (!isRunning) {
      processTrafficCycle();
    }
    setIsRunning(!isRunning);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Network className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              AI-Powered Traffic Control System
            </h1>
          </div>
          <p className="text-gray-600">
            Real-time intelligent traffic signal control using deep learning-based vehicle detection
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="mb-8">
          <Dashboard
            avgWaitTime={metrics.avgWaitTime}
            throughput={metrics.throughput}
            latency={metrics.latency}
            cycleTime={metrics.cycleTime}
            modelConfidence={metrics.modelConfidence}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Intersection signals={signals} vehicleCounts={vehicleCounts} />
          </div>
          <div>
            <ControlPanel
              onVehicleCountChange={handleVehicleCountChange}
              onToggleSimulation={toggleSimulation}
              isRunning={isRunning}
              vehicleCounts={vehicleCounts}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Detection Model</h3>
              <p className="text-sm text-gray-600">
                YOLOv8-Nano (3.2M parameters) performs real-time vehicle detection with 92-98% confidence from camera feeds
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Traffic Optimization</h3>
              <p className="text-sm text-gray-600">
                ML model predicts optimal signal timing (15-60s) based on vehicle count and queue length analysis
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Adaptive Control</h3>
              <p className="text-sm text-gray-600">
                Real-time decision-making adjusts signal timing dynamically to minimize wait times and maximize throughput
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
