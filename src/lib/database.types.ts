export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      intersections: {
        Row: {
          id: string
          name: string
          location: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          status?: string
          created_at?: string
        }
      }
      traffic_signals: {
        Row: {
          id: string
          intersection_id: string | null
          direction: string
          current_state: string
          timing: number
          updated_at: string
        }
        Insert: {
          id?: string
          intersection_id?: string | null
          direction: string
          current_state?: string
          timing?: number
          updated_at?: string
        }
        Update: {
          id?: string
          intersection_id?: string | null
          direction?: string
          current_state?: string
          timing?: number
          updated_at?: string
        }
      }
      vehicle_detections: {
        Row: {
          id: string
          intersection_id: string | null
          direction: string
          vehicle_count: number
          confidence: number
          detected_at: string
        }
        Insert: {
          id?: string
          intersection_id?: string | null
          direction: string
          vehicle_count?: number
          confidence?: number
          detected_at?: string
        }
        Update: {
          id?: string
          intersection_id?: string | null
          direction?: string
          vehicle_count?: number
          confidence?: number
          detected_at?: string
        }
      }
      performance_metrics: {
        Row: {
          id: string
          intersection_id: string | null
          avg_wait_time: number
          throughput: number
          latency: number
          cycle_time: number
          recorded_at: string
        }
        Insert: {
          id?: string
          intersection_id?: string | null
          avg_wait_time?: number
          throughput?: number
          latency?: number
          cycle_time?: number
          recorded_at?: string
        }
        Update: {
          id?: string
          intersection_id?: string | null
          avg_wait_time?: number
          throughput?: number
          latency?: number
          cycle_time?: number
          recorded_at?: string
        }
      }
      signal_cycles: {
        Row: {
          id: string
          intersection_id: string | null
          direction: string
          previous_state: string | null
          new_state: string
          duration: number
          vehicle_count: number
          changed_at: string
        }
        Insert: {
          id?: string
          intersection_id?: string | null
          direction: string
          previous_state?: string | null
          new_state: string
          duration?: number
          vehicle_count?: number
          changed_at?: string
        }
        Update: {
          id?: string
          intersection_id?: string | null
          direction?: string
          previous_state?: string | null
          new_state?: string
          duration?: number
          vehicle_count?: number
          changed_at?: string
        }
      }
    }
  }
}
