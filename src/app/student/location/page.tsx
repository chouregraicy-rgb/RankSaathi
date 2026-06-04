"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  startLocationWatch,
  stopLocationWatch,
  getCurrentPosition,
  getTodayLocations,
  getStudentFences,
} from "@/services/geoService";
import {
  MapPin, Navigation, Shield, ShieldOff, Battery,
  Clock, CheckCircle2, AlertCircle, Loader2, RefreshCw,
  Eye, EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LocationEntry {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  location_label: string | null;
  battery_level: number | null;
  is_in_safe_zone: boolean | null;
  timestamp: string;
}

export default function StudentLocationPage() {
  const supabase = createClient();

  const [studentId, setStudentId]         = useState<string | null>(null);
  const [isSharing, setIsSharing]         = useState(false);
  const [loading, setLoading]             = useState(true);
  const [shareLoading, setShareLoading]   = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationEntry | null>(null);
  const [history, setHistory]             = useState<LocationEntry[]>([]);
  const [error, setError]                 = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [lastUpdated, setLastUpdated]     = useState<string | null>(null);
  const [fences, setFences]               = useState<any[]>([]);
  const [parentLinked, setParentLinked]   = useState(false);

  // ── Get student ID + check parent link ───────────────────────────────────
  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get student record
        const { data: student } = await supabase
          .from("students")
          .select("id, user_id")
          .eq("user_id", user.id)
          .single();

        if (!student) return;
        setStudentId(student.user_id); // use auth user_id for location FK

        // Check if parent is linked
        const { data: parent } = await supabase
          .from("parents")
          .select("id")
          .eq("student_id", student.id)
          .maybeSingle();
        setParentLinked(!!parent);

        // Load geofences
        const fenceData = await getStudentFences(student.user_id);
        setFences(fenceData);

        // Load today's history
        const locs = await getTodayLocations(student.user_id);
        setHistory(locs.reverse()); // most recent first
        if (locs.length > 0) setCurrentLocation(locs[locs.length - 1]);

      } catch (err: any) {
        setError("Failed to load location data.");
      } finally {
        setLoading(false);
      }
    }
    init();
    return () => stopLocationWatch();
  }, []);

  // ── Share location (one-shot) ─────────────────────────────────────────────
  async function shareOnce() {
    if (!studentId) return;
    setShareLoading(true);
    setError(null);
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude, accuracy } = position.coords;

      // Get battery
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
        battery_level: batteryLevel,
        timestamp: new Date().toISOString(),
        is_in_safe_zone: false,
        location_label: "Current Location",
      };

      const { data, error: insertErr } = await supabase
        .from("student_locations")
        .insert(locationData)
        .select()
        .single();

      if (insertErr) throw insertErr;

      setCurrentLocation(data as LocationEntry);
      setHistory((prev) => [data as LocationEntry, ...prev]);
      setLastUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    } catch (err: any) {
      if (err.code === 1) {
        setPermissionDenied(true);
        setError("Location permission denied. Please allow location access in your browser settings.");
      } else {
        setError("Could not get location. Please try again.");
      }
    } finally {
      setShareLoading(false);
    }
  }

  // ── Toggle continuous sharing ─────────────────────────────────────────────
  function toggleContinuousShare() {
    if (!studentId) return;
    if (isSharing) {
      stopLocationWatch();
      setIsSharing(false);
    } else {
      setError(null);
      startLocationWatch(studentId, fences, (loc) => {
        setCurrentLocation(loc as any);
        setHistory((prev) => [loc as any, ...prev.slice(0, 19)]);
        setLastUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
      });
      setIsSharing(true);
      // Also do an immediate one-shot share
      shareOnce();
    }
  }

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const formatDate = (ts: string) =>
    new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Location Sharing</h1>
        <p className="text-sm text-gray-400">
          Share your location with your parent so they know you're safe.
        </p>
      </div>

      {/* ── Parent link status ── */}
      {!parentLinked && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-400">No parent linked yet</p>
            <p className="text-xs text-amber-400/70">Ask your parent to link their account using your invite code from Settings.</p>
          </div>
        </div>
      )}

      {/* ── Permission denied ── */}
      {permissionDenied && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <ShieldOff className="h-4 w-4 text-red-400" />
            <p className="text-sm font-medium text-red-400">Location Permission Denied</p>
          </div>
          <p className="text-xs text-red-400/70">
            To fix: Click the 🔒 lock icon in your browser address bar → Site settings → Location → Allow
          </p>
        </div>
      )}

      {/* ── Main sharing card ── */}
      <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 text-center space-y-4">

        {/* Status icon */}
        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all ${
          isSharing
            ? "bg-green-500/20 ring-4 ring-green-500/30 animate-pulse"
            : "bg-gray-800"
        }`}>
          <Navigation className={`h-8 w-8 ${isSharing ? "text-green-400" : "text-gray-500"}`} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            {isSharing ? "Sharing Live Location" : "Location Sharing Off"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isSharing
              ? "Your parent can see your location. Updates every 5 minutes."
              : "Tap below to share your location with your parent."}
          </p>
          {lastUpdated && (
            <p className="text-xs text-green-400 mt-1">Last updated: {lastUpdated}</p>
          )}
        </div>

        {/* Current location info */}
        {currentLocation && (
          <div className="bg-[#0a0a0f] rounded-xl p-3 text-left space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
              <span className="text-sm text-white font-medium">
                {currentLocation.location_label || "Current Location"}
              </span>
              {currentLocation.is_in_safe_zone && (
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px]">
                  Safe Zone ✓
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400 pl-5">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(currentLocation.timestamp)}
              </span>
              {currentLocation.accuracy && (
                <span>±{currentLocation.accuracy}m accuracy</span>
              )}
              {currentLocation.battery_level !== null && (
                <span className="flex items-center gap-1">
                  <Battery className="h-3 w-3" />
                  {currentLocation.battery_level}%
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={shareOnce}
            disabled={shareLoading || permissionDenied}
            variant="outline"
            className="flex-1 border-white/10 text-gray-300 hover:bg-white/5"
          >
            {shareLoading
              ? <Loader2 className="h-4 w-4 animate-spin mr-2" />
              : <MapPin className="h-4 w-4 mr-2" />
            }
            Share Now
          </Button>

          <Button
            onClick={toggleContinuousShare}
            disabled={permissionDenied}
            className={`flex-1 font-semibold ${
              isSharing
                ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isSharing ? (
              <><EyeOff className="h-4 w-4 mr-2" /> Stop Sharing</>
            ) : (
              <><Eye className="h-4 w-4 mr-2" /> Live Share</>
            )}
          </Button>
        </div>

        {error && !permissionDenied && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>

      {/* ── Privacy note ── */}
      <div className="bg-[#111118] border border-white/5 rounded-xl px-4 py-3 flex items-start gap-3">
        <Shield className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-gray-400 space-y-1">
          <p className="font-medium text-gray-300">Your privacy is protected</p>
          <p>Location is only shared with your linked parent. Only visible to them, not stored publicly. You can stop sharing anytime.</p>
        </div>
      </div>

      {/* ── Today's history ── */}
      {history.length > 0 && (
        <div className="bg-[#111118] border border-white/5 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-400" />
            Today's Location History
          </h3>
          <div className="space-y-2">
            {history.slice(0, 10).map((loc, i) => (
              <div key={loc.id} className="flex items-center gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  i === 0 ? "bg-green-400 ring-2 ring-green-400/30" : "bg-gray-600"
                }`} />
                <span className={`flex-1 ${i === 0 ? "text-white font-medium" : "text-gray-400"}`}>
                  {loc.location_label || "Location shared"}
                </span>
                <span className="text-xs text-gray-500">{formatTime(loc.timestamp)}</span>
                {i === 0 && (
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px]">Now</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="h-10 w-10 mx-auto mb-2 opacity-20" />
          <p className="text-sm">No location shared today yet.</p>
          <p className="text-xs mt-1">Tap "Share Now" to let your parent know where you are.</p>
        </div>
      )}

    </div>
  );
}
