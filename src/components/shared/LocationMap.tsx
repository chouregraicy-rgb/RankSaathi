// src/components/shared/LocationMap.tsx
"use client";

interface LocationPoint {
  latitude:       number;
  longitude:      number;
  timestamp:      string;
  location_label: string | null;
}

interface LocationMapProps {
  locations: LocationPoint[];
  height?:   string;
}

export function LocationMap({ locations, height = "300px" }: LocationMapProps) {
  if (locations.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-muted/40 border border-border text-muted-foreground text-sm"
        style={{ height }}
      >
        No location data available
      </div>
    );
  }

  const latest = locations[0];
  const lat    = latest.latitude;
  const lng    = latest.longitude;
  const zoom   = 16;

  // OpenStreetMap iframe embed — zero dependencies, always works
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.008}%2C${lng + 0.01}%2C${lat + 0.008}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div style={{ height, position: "relative", borderRadius: "12px", overflow: "hidden" }}
      className="border border-border w-full">
      <iframe
        src={src}
        style={{ width: "100%", height: "100%", border: "none" }}
        title="Student Location Map"
        loading="lazy"
        allowFullScreen
      />
      {/* Current location overlay */}
      <div style={{
        position: "absolute", bottom: 8, left: 8,
        background: "rgba(0,0,0,0.75)", borderRadius: 8,
        padding: "4px 10px", color: "#fff", fontSize: 11,
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2b7fff", display: "inline-block", boxShadow: "0 0 0 2px rgba(43,127,255,0.4)" }} />
        {latest.location_label ?? "Current Location"} ·{" "}
        {new Date(latest.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}
