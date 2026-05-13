// src/services/geoService.ts
// Geo tracking — privacy-first, battery-optimised

import { createClient } from "@/lib/supabase/client";
import { getDistanceMeters } from "@/utils";
import type { GeoFence, StudentLocation } from "@/types";

let watchId: number | null = null;
let lastLoggedAt = 0;
const LOG_INTERVAL_MS = 5 * 60 * 1000; // Log every 5 minutes max

// ---- Get current position (one-shot) ----
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false, // Battery save
      timeout: 10000,
      maximumAge: 60000, // Accept 1min cached position
    });
  });
}

// ---- Start watching location ----
export function startLocationWatch(
  studentId: string,
  fences: GeoFence[],
  onUpdate?: (location: StudentLocation) => void
): void {
  if (!navigator.geolocation || watchId !== null) return;

  watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const now = Date.now();
      // Throttle DB writes
      if (now - lastLoggedAt < LOG_INTERVAL_MS) return;
      lastLoggedAt = now;

      const { latitude, longitude, accuracy, speed } = position.coords;

      // Check if inside any safe zone
      const inSafeZone = fences.some(
        (f) =>
          f.is_active &&
          getDistanceMeters(latitude, longitude, f.latitude, f.longitude) <=
            f.radius_meters
      );

      // Get battery level if available
      let batteryLevel: number | null = null;
      try {
        const battery = await (navigator as any).getBattery?.();
        if (battery) batteryLevel = Math.round(battery.level * 100);
      } catch {}

      const locationData = {
        student_id: studentId,
        latitude,
        longitude,
        accuracy: Math.round(accuracy),
        speed: speed ? Math.round(speed * 3.6) : null, // m/s → km/h
        battery_level: batteryLevel,
        timestamp: new Date().toISOString(),
        is_in_safe_zone: inSafeZone,
        location_label: getLocationLabel(latitude, longitude, fences),
      };

      // Save to Supabase
      const supabase = createClient();
      const { data } = await supabase
        .from("student_locations")
        .insert(locationData)
        .select()
        .single();

      if (data && onUpdate) onUpdate(data as StudentLocation);
    },
    (error) => console.warn("[geoService] Watch error:", error.message),
    {
      enableHighAccuracy: false,
      maximumAge: 120000, // 2 min cache
      timeout: 15000,
    }
  );
}

// ---- Stop watching ----
export function stopLocationWatch(): void {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

// ---- Check if inside any geofence ----
function getLocationLabel(
  lat: number,
  lng: number,
  fences: GeoFence[]
): string | null {
  for (const fence of fences) {
    if (!fence.is_active) continue;
    const dist = getDistanceMeters(lat, lng, fence.latitude, fence.longitude);
    if (dist <= fence.radius_meters) return fence.label;
  }
  return null;
}

// ---- Fetch today's location history ----
export async function getTodayLocations(
  studentId: string
): Promise<StudentLocation[]> {
  const supabase = createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("student_locations")
    .select("*")
    .eq("student_id", studentId)
    .gte("timestamp", today.toISOString())
    .order("timestamp", { ascending: true });

  return (data as StudentLocation[]) ?? [];
}

// ---- Fetch geofences for a student ----
export async function getStudentFences(studentId: string): Promise<GeoFence[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("geo_fences")
    .select("*")
    .eq("student_id", studentId);

  return (data as GeoFence[]) ?? [];
}

// ---- Save a new geofence ----
export async function saveGeofence(
  fence: Omit<GeoFence, "id">
): Promise<GeoFence | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("geo_fences")
    .insert(fence)
    .select()
    .single();

  return data as GeoFence | null;
}
