import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, Users, RefreshCw, Zap } from "lucide-react";

// Types
interface TimeSlot {
  startDateTime: string;
  endDateTime: string;
  availableResourceIds: string[];
}

interface BookingGrid {
  weekStart: string;
  timeSlots: TimeSlot[];
}

interface GridParams {
  weekStart: string;
  resourceIds: string[];
}

interface CacheEntry {
  data: BookingGrid;
  timestamp: number;
  ttl: number;
}

interface BookingUpdate {
  type: "booking_created" | "booking_cancelled" | "resource_unavailable";
  affectedWeeks: string[];
  resourceId?: string;
  timestamp: number;
}

// Mock resources
const MOCK_RESOURCES = [
  { id: "res-1", name: "John Smith", type: "Engineer" },
  { id: "res-2", name: "Sarah Wilson", type: "Designer" },
  { id: "res-3", name: "Mike Johnson", type: "Manager" },
  { id: "res-4", name: "Lisa Brown", type: "Engineer" },
  { id: "res-5", name: "David Lee", type: "Designer" },
  { id: "res-6", name: "Emma Davis", type: "Engineer" },
];

// Cache implementation
class LocalCache {
  private cache = new Map<string, CacheEntry>();

  generateKey(params: GridParams): string {
    return `booking-grid:${params.weekStart}:${params.resourceIds
      .sort()
      .join(",")}`;
  }

  get(key: string): BookingGrid | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: BookingGrid, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// WebSocket simulation
class MockWebSocket {
  private listeners: Array<(update: BookingUpdate) => void> = [];
  private intervalId: NodeJS.Timeout | null = null;

  connect() {
    // Simulate random booking updates every 10-15 seconds
    this.intervalId = setInterval(() => {
      this.simulateBookingUpdate();
    }, 10000 + Math.random() * 5000);
  }

  disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  onBookingUpdate(callback: (update: BookingUpdate) => void) {
    this.listeners.push(callback);
  }

  removeListener(callback: (update: BookingUpdate) => void) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  private simulateBookingUpdate() {
    const updateTypes: BookingUpdate["type"][] = [
      "booking_created",
      "booking_cancelled",
      "resource_unavailable",
    ];
    const randomType =
      updateTypes[Math.floor(Math.random() * updateTypes.length)];

    // Generate random affected weeks (current week + nearby weeks)
    const today = new Date();
    const affectedWeeks = [];
    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
      const weekDate = new Date(today);
      weekDate.setDate(today.getDate() + i * 7);
      affectedWeeks.push(getWeekStart(weekDate));
    }

    const update: BookingUpdate = {
      type: randomType,
      affectedWeeks,
      resourceId:
        MOCK_RESOURCES[Math.floor(Math.random() * MOCK_RESOURCES.length)].id,
      timestamp: Date.now(),
    };

    this.listeners.forEach((listener) => listener(update));
  }

  // Manual trigger for demo purposes
  triggerUpdate(type: BookingUpdate["type"]) {
    const today = new Date();
    const currentWeekStart = getWeekStart(today);

    const update: BookingUpdate = {
      type,
      affectedWeeks: [currentWeekStart],
      resourceId: MOCK_RESOURCES[0].id,
      timestamp: Date.now(),
    };

    this.listeners.forEach((listener) => listener(update));
  }
}

// Global cache instance
const cache = new LocalCache();

// Global WebSocket instance
const mockWS = new MockWebSocket();

// Fake API simulation
const fakeAPI = {
  async fetchBookingGrid(params: GridParams): Promise<BookingGrid> {
    // Simulate expensive computation delay
    await new Promise((resolve) =>
      setTimeout(resolve, 2000 + Math.random() * 1000)
    );

    const weekStart = new Date(params.weekStart);
    const timeSlots: TimeSlot[] = [];

    // Generate time slots for 5 days (Mon-Fri), 8AM-6PM
    for (let day = 0; day < 5; day++) {
      for (let hour = 8; hour < 18; hour++) {
        const slotStart = new Date(weekStart);
        slotStart.setDate(weekStart.getDate() + day);
        slotStart.setHours(hour, 0, 0, 0);

        const slotEnd = new Date(slotStart);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        // Randomly assign available resources
        const availableResources = params.resourceIds.filter(
          () => Math.random() > 0.3
        );

        timeSlots.push({
          startDateTime: slotStart.toISOString(),
          endDateTime: slotEnd.toISOString(),
          availableResourceIds: availableResources,
        });
      }
    }

    return {
      weekStart: params.weekStart,
      timeSlots,
    };
  },
};

// Smart TTL calculation
const getTTL = (weekStart: string): number => {
  const now = new Date();
  const week = new Date(weekStart);
  const isCurrentWeek =
    now >= week && now < new Date(week.getTime() + 7 * 24 * 60 * 60 * 1000);

  return isCurrentWeek ? 10000 : 30000; // 10s for current week, 30s for future weeks
};

// Cached API service
const apiService = {
  async getBookingGrid(params: GridParams): Promise<BookingGrid> {
    const cacheKey = cache.generateKey(params);

    // Try cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Cache miss - fetch from API
    const data = await fakeAPI.fetchBookingGrid(params);

    // Store in cache
    const ttl = getTTL(params.weekStart);
    cache.set(cacheKey, data, ttl);

    return data;
  },
};

// Utility functions
const formatTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const getWeekStart = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
};

const addWeeks = (dateStr: string, weeks: number): string => {
  const date = new Date(dateStr + "T00:00:00");
  date.setDate(date.getDate() + weeks * 7);
  return date.toISOString().split("T")[0];
};

const hours = [
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
];

export default function BookingGridDemo() {
  const [selectedResources, setSelectedResources] = useState<string[]>([
    "res-1",
    "res-2",
    "res-3",
  ]);
  const [currentWeek, setCurrentWeek] = useState<string>(
    getWeekStart(new Date())
  );
  const [bookingData, setBookingData] = useState<BookingGrid | null>(null);
  const [loading, setLoading] = useState(false);
  const [cacheHit, setCacheHit] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [cacheStats, setCacheStats] = useState({
    size: 0,
    keys: [] as string[],
  });
  const [wsConnected, setWsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<BookingUpdate | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  const fetchData = useCallback(async () => {
    const startTime = Date.now();
    setLoading(true);
    setCacheHit(false);
    setRequestCount((prev) => prev + 1);

    try {
      const cacheKey = cache.generateKey({
        weekStart: currentWeek,
        resourceIds: selectedResources,
      });
      const cached = cache.get(cacheKey);

      if (cached) {
        setCacheHit(true);
        setBookingData(cached);
        setLoading(false);
        return;
      }

      const data = await apiService.getBookingGrid({
        weekStart: currentWeek,
        resourceIds: selectedResources,
      });

      setBookingData(data);
    } catch (error) {
      console.error("Failed to fetch booking data:", error);
    } finally {
      setLoading(false);
      setCacheStats(cache.getStats());
    }
  }, [currentWeek, selectedResources]);

  // WebSocket effect for real-time updates
  useEffect(() => {
    const handleBookingUpdate = (update: BookingUpdate) => {
      setLastUpdate(update);

      // Invalidate cache for affected weeks
      update.affectedWeeks.forEach((week) => {
        cache.invalidate(`booking-grid:${week}`);
      });

      setCacheStats(cache.getStats());

      // Auto-refresh current view if affected and enabled
      if (autoRefreshEnabled && update.affectedWeeks.includes(currentWeek)) {
        fetchData();
      }
    };

    mockWS.onBookingUpdate(handleBookingUpdate);
    mockWS.connect();
    setWsConnected(true);

    return () => {
      mockWS.removeListener(handleBookingUpdate);
      mockWS.disconnect();
      setWsConnected(false);
    };
  }, [currentWeek, autoRefreshEnabled, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleResourceToggle = (resourceId: string) => {
    setSelectedResources((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const weeksToAdd = direction === "next" ? 1 : -1;
    setCurrentWeek(addWeeks(currentWeek, weeksToAdd));
  };

  const clearCache = () => {
    cache.invalidate("booking-grid");
    setCacheStats(cache.getStats());
  };

  const preloadWeeks = async () => {
    setLoading(true);
    const currentWeekDate = new Date(currentWeek + "T00:00:00");
    const weeksToPreload = [];

    // Preload current week + 2 weeks before and 2 weeks after
    for (let i = -2; i <= 2; i++) {
      const weekDate = new Date(currentWeekDate);
      weekDate.setDate(weekDate.getDate() + i * 7);
      weeksToPreload.push(weekDate.toISOString().split("T")[0]);
    }

    try {
      // Load all weeks in parallel
      await Promise.all(
        weeksToPreload.map((week) =>
          apiService.getBookingGrid({
            weekStart: week,
            resourceIds: selectedResources,
          })
        )
      );
      setCacheStats(cache.getStats());
    } catch (error) {
      console.error("Failed to preload weeks:", error);
    } finally {
      setLoading(false);
    }
  };

  const triggerManualUpdate = (type: BookingUpdate["type"]) => {
    mockWS.triggerUpdate(type);
  };

  // Group time slots by day and time
  const groupedSlots =
    bookingData?.timeSlots.reduce((acc, slot) => {
      const date = slot.startDateTime.split("T")[0];
      const time = formatTime(slot.startDateTime);

      if (!acc[date]) acc[date] = {};
      acc[date][time] = slot;

      return acc;
    }, {} as Record<string, Record<string, TimeSlot>>) || {};

  const days = Object.keys(groupedSlots).sort();

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Calendar className="text-blue-600" />
          Booking Grid Demo
        </h1>
        <p className="text-gray-600 mb-6">
          Performance optimization with multi-layer caching
        </p>

        {/* Stats Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <RefreshCw className="text-blue-600 w-5 h-5" />
              <span className="text-sm font-medium text-blue-800">
                Requests
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {requestCount}
            </div>
          </div>

          <div
            className={`p-4 rounded-lg ${
              cacheHit ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap
                className={`w-5 h-5 ${
                  cacheHit ? "text-green-600" : "text-red-600"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  cacheHit ? "text-green-800" : "text-red-800"
                }`}
              >
                Cache Status
              </span>
            </div>
            <div
              className={`text-2xl font-bold ${
                cacheHit ? "text-green-900" : "text-red-900"
              }`}
            >
              {loading ? "Loading..." : cacheHit ? "HIT" : "MISS"}
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="text-purple-600 w-5 h-5" />
              <span className="text-sm font-medium text-purple-800">
                Cache Size
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {cacheStats.size}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <button
              onClick={clearCache}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Clear Cache
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Resource Selection */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="text-gray-600 w-5 h-5" />
              Select Resources
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {MOCK_RESOURCES.map((resource) => (
                <label
                  key={resource.id}
                  className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedResources.includes(resource.id)}
                    onChange={() => handleResourceToggle(resource.id)}
                    className="rounded text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-sm">{resource.name}</div>
                    <div className="text-xs text-gray-500">{resource.type}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Week Navigation */}
          <div className="lg:w-64">
            <h3 className="text-lg font-semibold mb-3">Week Navigation</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateWeek("prev")}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
              >
                ← Prev
              </button>
              <div className="flex-1 text-center font-medium">
                Week of {new Date(currentWeek).toLocaleDateString()}
              </div>
              <button
                onClick={() => navigateWeek("next")}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
              >
                Next →
              </button>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {loading ? "Loading..." : "Refresh Grid"}
            </button>
          </div>
        </div>

        {/* Booking Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-lg font-medium text-gray-700">
                Computing booking grid... (simulating expensive operation)
              </span>
            </div>
          </div>
        ) : bookingData ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-3 text-left font-semibold">
                    Time
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="border border-gray-200 p-3 text-center font-semibold min-w-32"
                    >
                      {formatDate(day + "T00:00:00")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map((hour) => (
                  <tr key={hour} className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-3 font-medium bg-gray-50">
                      {hour}
                    </td>
                    {days.map((day) => {
                      const slot = groupedSlots[day]?.[hour];
                      const availableCount =
                        slot?.availableResourceIds.length || 0;
                      const totalSelected = selectedResources.length;

                      return (
                        <td key={day} className="border border-gray-200 p-1">
                          <div
                            className={`p-2 rounded text-center text-sm font-medium ${
                              availableCount === 0
                                ? "bg-red-100 text-red-800"
                                : availableCount < totalSelected / 2
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {availableCount}/{totalSelected}
                            <div className="text-xs opacity-75">available</div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No booking data available
          </div>
        )}

        {/* Cache Debug Info */}
        {cacheStats.keys.length > 0 && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Cache Debug Info:</h4>
            <div className="text-sm space-y-1">
              {cacheStats.keys.map((key, index) => (
                <div
                  key={index}
                  className="font-mono text-xs text-gray-600 break-all"
                >
                  {key}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
