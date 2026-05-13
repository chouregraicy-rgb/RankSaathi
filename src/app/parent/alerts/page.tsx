// src/app/parent/alerts/page.tsx
"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell, MapPin, AlertTriangle, CheckCircle2, Info,
  BellOff, Settings, Flame, Target, Clock,
} from "lucide-react";
import { timeAgo } from "@/utils";

const ALL_ALERTS = [
  { id: "a1", type: "geo",       severity: "warning", message: "Left coaching center early (3:45 PM)",         time: "2026-05-09T16:15:00", read: false },
  { id: "a2", type: "mood",      severity: "warning", message: "Burnout risk detected — study session disrupted",time: "2026-05-09T14:30:00", read: false },
  { id: "a3", type: "test",      severity: "info",    message: "Physics test completed — Score: 72%",          time: "2026-05-08T17:00:00", read: true  },
  { id: "a4", type: "streak",    severity: "success", message: "7-day study streak achieved! 🔥",              time: "2026-05-08T08:00:00", read: true  },
  { id: "a5", type: "geo",       severity: "success", message: "Arrived at coaching center safely",            time: "2026-05-08T10:45:00", read: true  },
  { id: "a6", type: "mood",      severity: "info",    message: "Focus score improved to 82 today",             time: "2026-05-07T20:00:00", read: true  },
  { id: "a7", type: "test",      severity: "warning", message: "Low score on Biology mock — 58%",              time: "2026-05-06T15:00:00", read: true  },
  { id: "a8", type: "geo",       severity: "warning", message: "Safe zone not reached for 2 hours",            time: "2026-05-05T19:00:00", read: true  },
];

const ALERT_ICONS = {
  geo:     MapPin,
  mood:    Flame,
  test:    Target,
  streak:  CheckCircle2,
};

const SEVERITY_STYLES = {
  warning: { bg: "bg-amber-50 dark:bg-amber-950/20",  border: "border-amber-200 dark:border-amber-900",  icon: "text-amber-500" },
  success: { bg: "bg-green-50 dark:bg-green-950/20",  border: "border-green-200 dark:border-green-900",  icon: "text-green-500" },
  info:    { bg: "bg-blue-50 dark:bg-blue-950/20",    border: "border-blue-200 dark:border-blue-900",    icon: "text-blue-500"  },
};

const NOTIFICATION_SETTINGS = [
  { key: "geo_alerts",      label: "Location Alerts",         desc: "When student leaves safe zones",       on: true  },
  { key: "mood_alerts",     label: "Mood & Burnout Alerts",   desc: "Burnout risk and focus score drops",   on: true  },
  { key: "test_results",    label: "Test Results",            desc: "Every time a test is completed",       on: true  },
  { key: "streak_alerts",   label: "Streak Achievements",     desc: "Milestone streak notifications",       on: false },
  { key: "daily_summary",   label: "Daily Summary",           desc: "End-of-day study report",              on: true  },
  { key: "weekly_report",   label: "Weekly Report",           desc: "Sunday evening performance report",    on: true  },
];

export default function ParentAlertsPage() {
  const [settings, setSettings] = useState(NOTIFICATION_SETTINGS);
  const [alerts, setAlerts] = useState(ALL_ALERTS);

  function markAllRead() {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  }

  function toggleSetting(key: string) {
    setSettings((prev) => prev.map((s) => s.key === key ? { ...s, on: !s.on } : s));
  }

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <DashboardLayout role="parent" title="Alerts">
      <div className="space-y-5 max-w-3xl">
        <Tabs defaultValue="alerts">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="alerts" className="gap-1">
                Alerts
                {unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="settings">Notification Settings</TabsTrigger>
            </TabsList>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={markAllRead}>
                <CheckCircle2 className="h-3.5 w-3.5" /> Mark all read
              </Button>
            )}
          </div>

          {/* Alerts tab */}
          <TabsContent value="alerts" className="mt-4 space-y-2">
            {alerts.map((alert) => {
              const Icon = ALERT_ICONS[alert.type as keyof typeof ALERT_ICONS] ?? Bell;
              const styles = SEVERITY_STYLES[alert.severity as keyof typeof SEVERITY_STYLES];
              return (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${styles.bg} ${styles.border} ${!alert.read ? "ring-1 ring-offset-1 ring-amber-300 dark:ring-amber-700" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-white dark:bg-black/20 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${styles.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(alert.time)}</p>
                  </div>
                  {!alert.read && (
                    <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  )}
                </div>
              );
            })}
          </TabsContent>

          {/* Settings tab */}
          <TabsContent value="settings" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base font-display">Notification Preferences</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                {settings.map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">{setting.label}</p>
                      <p className="text-xs text-muted-foreground">{setting.desc}</p>
                    </div>
                    {/* Toggle */}
                    <button
                      onClick={() => toggleSetting(setting.key)}
                      className={`w-11 h-6 rounded-full transition-all relative ${setting.on ? "bg-primary" : "bg-muted"}`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${setting.on ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
