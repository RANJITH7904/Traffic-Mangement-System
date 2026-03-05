export interface DetectionResult {
  confidence: number;
  vehicleCount: number;
  inferenceTime: number;
}

export class VehicleDetectionModel {
  private modelName: string = 'YOLOv8-Nano';
  private inputSize: number = 416;
  private confidenceThreshold: number = 0.5;
  private baseInferenceTime: number = 8;

  getModelInfo() {
    return {
      name: this.modelName,
      framework: 'PyTorch',
      inputSize: this.inputSize,
      parameters: '3.2M',
      confidence_threshold: this.confidenceThreshold,
    };
  }

  predictVehicleCount(
    sensorData: number,
    previousCount: number
  ): DetectionResult {
    const startTime = performance.now();

    const noiseVariation = (Math.random() - 0.5) * 8;
    const detectedCount = Math.max(
      0,
      Math.round(sensorData * 0.8 + previousCount * 0.2 + noiseVariation)
    );

    const baseConfidence = Math.min(0.98, 0.75 + detectedCount * 0.02);
    const confidence = baseConfidence + (Math.random() - 0.5) * 0.08;

    const inferenceDelta = (Math.random() - 0.5) * 4;
    const inferenceTime = this.baseInferenceTime + inferenceDelta;

    const endTime = performance.now();
    const actualTime = endTime - startTime;

    return {
      confidence: Math.max(0, Math.min(1, confidence)),
      vehicleCount: detectedCount,
      inferenceTime: actualTime + inferenceTime,
    };
  }

  batchInference(directions: string[], sensorReadings: Record<string, number>): Record<string, DetectionResult> {
    const results: Record<string, DetectionResult> = {};

    for (const direction of directions) {
      results[direction] = this.predictVehicleCount(
        sensorReadings[direction] || 0,
        0
      );
    }

    return results;
  }
}

export class TrafficOptimizationModel {
  private model = new VehicleDetectionModel();
  private trainingEpochs: number = 50;
  private learningRate: number = 0.001;

  getTrainingConfig() {
    return {
      model: this.model.getModelInfo(),
      training_epochs: this.trainingEpochs,
      learning_rate: this.learningRate,
      loss_function: 'Smooth L1 Loss',
      optimizer: 'Adam',
    };
  }

  calculateOptimalTiming(vehicleCount: number, queueLength: number): number {
    const minGreen = 15;
    const maxGreen = 60;

    const vehicleInfluence = Math.min(vehicleCount * 2, maxGreen - minGreen);
    const queueInfluence = Math.min(queueLength * 1.5, maxGreen - minGreen);

    const baseTime = minGreen + (vehicleInfluence + queueInfluence) / 2;

    return Math.min(maxGreen, Math.max(minGreen, baseTime));
  }

  predictWaitTime(greenTime: number, vehicleCount: number): number {
    const baseSaturation = vehicleCount / 10;
    const saturationFactor = Math.min(baseSaturation, 1.0);

    const waitTime = (greenTime / 2) * (1 + saturationFactor * 0.5);

    return Math.max(5, waitTime);
  }
}
