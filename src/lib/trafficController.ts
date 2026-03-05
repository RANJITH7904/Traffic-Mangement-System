import { supabase } from './supabase';

export type SignalState = 'red' | 'yellow' | 'green';
export type Direction = 'north' | 'south' | 'east' | 'west';

export interface TrafficSignal {
  id: string;
  direction: Direction;
  currentState: SignalState;
  timing: number;
  remainingTime: number;
}

export interface VehicleData {
  direction: Direction;
  count: number;
  confidence: number;
}

export class TrafficController {
  private signals: Map<Direction, TrafficSignal> = new Map();
  private intersectionId: string = '';
  private cycleStartTime: number = 0;
  private minGreenTime = 15;
  private maxGreenTime = 60;
  private yellowTime = 3;
  private allRedTime = 2;

  async initialize(intersectionId: string) {
    this.intersectionId = intersectionId;
    const { data } = await supabase
      .from('traffic_signals')
      .select('*')
      .eq('intersection_id', intersectionId);

    if (data) {
      data.forEach((signal) => {
        this.signals.set(signal.direction as Direction, {
          id: signal.id,
          direction: signal.direction as Direction,
          currentState: signal.current_state as SignalState,
          timing: signal.timing,
          remainingTime: signal.timing,
        });
      });
    }
  }

  calculateOptimalTiming(vehicleData: VehicleData[]): number {
    const direction = vehicleData[0]?.direction;
    const vehicleCount = vehicleData[0]?.count || 0;

    const baseTime = this.minGreenTime;
    const additionalTime = Math.min(
      vehicleCount * 2,
      this.maxGreenTime - baseTime
    );

    return Math.max(baseTime, Math.min(baseTime + additionalTime, this.maxGreenTime));
  }

  async updateSignalState(
    direction: Direction,
    newState: SignalState,
    timing: number,
    vehicleCount: number
  ) {
    const signal = this.signals.get(direction);
    if (!signal) return;

    const previousState = signal.currentState;

    signal.currentState = newState;
    signal.timing = timing;
    signal.remainingTime = timing;

    await supabase
      .from('traffic_signals')
      .update({
        current_state: newState,
        timing: timing,
        updated_at: new Date().toISOString(),
      })
      .eq('id', signal.id);

    await supabase.from('signal_cycles').insert({
      intersection_id: this.intersectionId,
      direction: direction,
      previous_state: previousState,
      new_state: newState,
      duration: timing,
      vehicle_count: vehicleCount,
    });
  }

  async processVehicleDetection(vehicleData: VehicleData[]) {
    await Promise.all(
      vehicleData.map((data) =>
        supabase.from('vehicle_detections').insert({
          intersection_id: this.intersectionId,
          direction: data.direction,
          vehicle_count: data.count,
          confidence: data.confidence,
        })
      )
    );
  }

  async logPerformanceMetrics(
    avgWaitTime: number,
    throughput: number,
    latency: number,
    cycleTime: number
  ) {
    await supabase.from('performance_metrics').insert({
      intersection_id: this.intersectionId,
      avg_wait_time: avgWaitTime,
      throughput: throughput,
      latency: latency,
      cycle_time: cycleTime,
    });
  }

  getSignals(): TrafficSignal[] {
    return Array.from(this.signals.values());
  }

  getSignal(direction: Direction): TrafficSignal | undefined {
    return this.signals.get(direction);
  }
}
