import { useState, useEffect, useMemo, useCallback } from "react";
import { buildTimeline, optimizeSchedule, generatePlan } from "../utils/optimizeSchedule";

const STORAGE_KEY = "parkplanner-schedules";

function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDateHeader(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function loadSchedules() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};
    const parsed = JSON.parse(saved);
    // Validate new format: keys should be date strings like "2026-02-14"
    // Old format had park names as keys — ignore those
    const result = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(key) && value && typeof value.park === "string" && Array.isArray(value.rides)) {
        result[key] = value;
      }
    }
    return result;
  } catch {
    return {};
  }
}

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay(); // 0=Sun
  const daysInMonth = lastDay.getDate();

  const days = [];

  // Previous month padding
  if (startDow > 0) {
    const prevMonthLast = new Date(year, month, 0).getDate();
    for (let i = startDow - 1; i >= 0; i--) {
      const d = prevMonthLast - i;
      const dt = new Date(year, month - 1, d);
      days.push({ date: dt, dateStr: toDateStr(dt), otherMonth: true });
    }
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month, d);
    days.push({ date: dt, dateStr: toDateStr(dt), otherMonth: false });
  }

  // Next month padding to fill to 6 rows (42 cells) or at least complete the last row
  const totalCells = Math.ceil(days.length / 7) * 7;
  let nextDay = 1;
  while (days.length < totalCells) {
    const dt = new Date(year, month + 1, nextDay++);
    days.push({ date: dt, dateStr: toDateStr(dt), otherMonth: true });
  }

  return days;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function SchedulePanel({
  open,
  onClose,
  myListRides,
  rideDetails,
  parkHours,
  walkingTimes,
  allRides,
  onAddToList,
}) {
  const [schedules, setSchedules] = useState(loadSchedules);
  const todayStr = useMemo(() => toDateStr(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  // Persist schedules
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
  }, [schedules]);

  // Body scroll lock & ESC
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleKey = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKey);
      };
    }
  }, [open, onClose]);

  // Group myList rides by park
  const ridesByPark = useMemo(() => {
    const groups = {};
    myListRides.forEach((ride) => {
      if (!groups[ride.park]) groups[ride.park] = [];
      groups[ride.park].push(ride);
    });
    return groups;
  }, [myListRides]);

  const parkNames = useMemo(() => Object.keys(ridesByPark), [ridesByPark]);

  // Clean up scheduled rides that were removed from My List
  useEffect(() => {
    const myListIds = new Set(myListRides.map((r) => r.id));
    setSchedules((prev) => {
      const updated = { ...prev };
      let changed = false;
      for (const dateStr of Object.keys(updated)) {
        const entry = updated[dateStr];
        const filtered = entry.rides.filter((id) => myListIds.has(id));
        if (filtered.length !== entry.rides.length) {
          if (filtered.length === 0) {
            delete updated[dateStr];
          } else {
            updated[dateStr] = { ...entry, rides: filtered };
          }
          changed = true;
        }
      }
      return changed ? updated : prev;
    });
  }, [myListRides]);

  // Current day's schedule
  const dayEntry = schedules[selectedDate] || null;
  const selectedPark = dayEntry?.park || null;
  const currentSchedule = dayEntry?.rides || [];
  const hoursEntry = selectedPark ? parkHours[selectedPark] : null;

  const timeline = useMemo(() => {
    if (!selectedPark || !hoursEntry || !currentSchedule.length) {
      return { entries: [], totalTime: 0, endTimeStr: "", startTimeStr: "", overflow: false };
    }
    return buildTimeline(currentSchedule, selectedPark, hoursEntry, walkingTimes, rideDetails, allRides);
  }, [currentSchedule, selectedPark, hoursEntry, walkingTimes, rideDetails, allRides]);

  // Available rides: in myList for this park but not scheduled on this date
  const availableRides = useMemo(() => {
    if (!selectedPark) return [];
    const scheduled = new Set(currentSchedule);
    return (ridesByPark[selectedPark] || []).filter((r) => !scheduled.has(r.id));
  }, [ridesByPark, selectedPark, currentSchedule]);

  // Calendar days
  const calendarDays = useMemo(
    () => getCalendarDays(viewMonth.year, viewMonth.month),
    [viewMonth.year, viewMonth.month]
  );

  const updateDaySchedule = useCallback(
    (dateStr, park, rides) => {
      setSchedules((prev) => {
        if (rides.length === 0 && !park) {
          const { [dateStr]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [dateStr]: { park, rides } };
      });
    },
    []
  );

  const handleParkChange = useCallback(
    (newPark) => {
      if (!newPark) {
        // Clearing park — remove the day entry
        setSchedules((prev) => {
          const { [selectedDate]: _, ...rest } = prev;
          return rest;
        });
        return;
      }
      const currentPark = dayEntry?.park;
      if (newPark === currentPark) return;
      // Changing park clears rides for this day
      updateDaySchedule(selectedDate, newPark, []);
    },
    [selectedDate, dayEntry, updateDaySchedule]
  );

  const addRide = useCallback(
    (rideId) => {
      if (!selectedPark) return;
      const current = currentSchedule;
      if (!current.includes(rideId)) {
        updateDaySchedule(selectedDate, selectedPark, [...current, rideId]);
      }
    },
    [selectedDate, selectedPark, currentSchedule, updateDaySchedule]
  );

  const removeRide = useCallback(
    (rideId) => {
      if (!selectedPark) return;
      const newRides = currentSchedule.filter((id) => id !== rideId);
      if (newRides.length === 0) {
        // Keep the park assignment even with no rides
        updateDaySchedule(selectedDate, selectedPark, []);
      } else {
        updateDaySchedule(selectedDate, selectedPark, newRides);
      }
    },
    [selectedDate, selectedPark, currentSchedule, updateDaySchedule]
  );

  const moveRide = useCallback(
    (index, direction) => {
      if (!selectedPark) return;
      const current = [...currentSchedule];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= current.length) return;
      [current[index], current[newIndex]] = [current[newIndex], current[index]];
      updateDaySchedule(selectedDate, selectedPark, current);
    },
    [selectedDate, selectedPark, currentSchedule, updateDaySchedule]
  );

  const handleOptimize = useCallback(() => {
    if (!selectedPark || !currentSchedule.length) return;
    const optimized = optimizeSchedule(
      currentSchedule,
      selectedPark,
      hoursEntry,
      walkingTimes,
      rideDetails,
      allRides
    );
    updateDaySchedule(selectedDate, selectedPark, optimized);
  }, [selectedDate, selectedPark, currentSchedule, hoursEntry, walkingTimes, rideDetails, allRides, updateDaySchedule]);

  // === Smart Plan state ===
  const [assistantMode, setAssistantMode] = useState(null); // null | "form" | "preview"
  const [assistantPrefs, setAssistantPrefs] = useState({
    startTime: "09:00",
    endTime: "14:00",
    thrillPref: "All",
    typePref: [],
    maxHeight: 0,
    strategy: "headliners",
  });
  const [generatedPlan, setGeneratedPlan] = useState([]);

  // Reset assistant mode when date or park changes
  useEffect(() => {
    setAssistantMode(null);
    setGeneratedPlan([]);
  }, [selectedDate, selectedPark]);

  // Update default times when park hours change
  useEffect(() => {
    if (hoursEntry) {
      setAssistantPrefs((prev) => ({
        ...prev,
        startTime: hoursEntry.open,
        endTime: hoursEntry.close,
      }));
    }
  }, [hoursEntry]);

  // Ride types available at selected park
  const parkRideTypes = useMemo(() => {
    if (!selectedPark) return [];
    const types = new Set();
    allRides.forEach((r) => {
      if (r.park === selectedPark) types.add(r.type);
    });
    return [...types].sort();
  }, [selectedPark, allRides]);

  const toggleTypePref = useCallback((type) => {
    setAssistantPrefs((prev) => {
      const arr = prev.typePref;
      return {
        ...prev,
        typePref: arr.includes(type) ? arr.filter((t) => t !== type) : [...arr, type],
      };
    });
  }, []);

  const handleGenerate = useCallback(() => {
    if (!selectedPark) return;
    const plan = generatePlan(
      selectedPark,
      assistantPrefs,
      allRides,
      rideDetails,
      walkingTimes
    );
    setGeneratedPlan(plan);
    setAssistantMode("preview");
  }, [selectedPark, assistantPrefs, allRides, rideDetails, walkingTimes]);

  const previewTimeline = useMemo(() => {
    if (!generatedPlan.length || !selectedPark) {
      return { entries: [], totalTime: 0, endTimeStr: "", startTimeStr: "", overflow: false };
    }
    const customHours = { open: assistantPrefs.startTime, close: assistantPrefs.endTime };
    return buildTimeline(generatedPlan, selectedPark, customHours, walkingTimes, rideDetails, allRides);
  }, [generatedPlan, selectedPark, assistantPrefs.startTime, assistantPrefs.endTime, walkingTimes, rideDetails, allRides]);

  const handleAcceptPlan = useCallback(() => {
    if (!generatedPlan.length || !selectedPark) return;
    onAddToList(generatedPlan);
    updateDaySchedule(selectedDate, selectedPark, generatedPlan);
    setAssistantMode(null);
    setGeneratedPlan([]);
  }, [generatedPlan, selectedPark, selectedDate, onAddToList, updateDaySchedule]);

  const prevMonth = () => {
    setViewMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const nextMonth = () => {
    setViewMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  // Track which ride entry we're on for move buttons
  let rideIndex = -1;

  return (
    <>
      <div
        className={`panel-backdrop ${open ? "open" : ""}`}
        onClick={onClose}
        style={{ zIndex: 900 }}
      />
      <aside className={`schedule-panel ${open ? "open" : ""}`}>
        <div className="panel-header">
          <h2 className="panel-title">Schedule</h2>
          <button className="modal-close panel-close-btn" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Calendar */}
        <div className="schedule-calendar">
          <div className="schedule-cal-header">
            <button className="schedule-cal-nav" onClick={prevMonth} aria-label="Previous month">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="schedule-cal-month">
              {MONTH_NAMES[viewMonth.month]} {viewMonth.year}
            </span>
            <button className="schedule-cal-nav" onClick={nextMonth} aria-label="Next month">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          <div className="schedule-cal-grid">
            {DAY_HEADERS.map((d) => (
              <div key={d} className="schedule-cal-day-header">{d}</div>
            ))}
            {calendarDays.map((day) => {
              const isToday = day.dateStr === todayStr;
              const isSelected = day.dateStr === selectedDate;
              const hasSchedule = !!schedules[day.dateStr];
              return (
                <button
                  key={day.dateStr}
                  className={[
                    "schedule-cal-day",
                    day.otherMonth && "other-month",
                    isToday && "today",
                    isSelected && "selected",
                    hasSchedule && "has-schedule",
                  ].filter(Boolean).join(" ")}
                  onClick={() => setSelectedDate(day.dateStr)}
                >
                  {day.date.getDate()}
                  {hasSchedule && <span className="schedule-cal-dot" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="panel-body">
          {/* Selected date header */}
          <div className="schedule-date-header">
            {formatDateHeader(selectedDate)}
          </div>

          {parkNames.length === 0 ? (
            <div className="panel-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <p>No rides to schedule</p>
              <span>Add rides to My List first, then schedule them here</span>
            </div>
          ) : (
            <>
              {/* Park selector for this day */}
              <div className="schedule-park-select">
                <label>Park</label>
                <select
                  value={selectedPark || ""}
                  onChange={(e) => handleParkChange(e.target.value || null)}
                >
                  <option value="">Select a park...</option>
                  {parkNames.map((park) => (
                    <option key={park} value={park}>{park}</option>
                  ))}
                </select>
              </div>

              {/* Park hours & optimize */}
              {selectedPark && hoursEntry && (
                <div className="schedule-header-info">
                  <div className="schedule-hours">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    {hoursEntry.open} - {hoursEntry.close}
                  </div>
                  <div className="schedule-header-actions">
                    {currentSchedule.length > 1 && (
                      <button className="schedule-optimize-btn" onClick={handleOptimize}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
                        </svg>
                        Optimize
                      </button>
                    )}
                    <button
                      className="schedule-smartplan-btn"
                      onClick={() => setAssistantMode("form")}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Smart Plan
                    </button>
                  </div>
                </div>
              )}

              {/* Smart Plan Form */}
              {selectedPark && assistantMode === "form" && (
                <div className="sp-form">
                  <div className="sp-form-header">
                    <h3 className="sp-form-title">Smart Plan</h3>
                    <p className="sp-form-subtitle">Tell me your preferences...</p>
                  </div>

                  <div className="sp-field">
                    <label className="sp-label">Time Window</label>
                    <div className="sp-time-row">
                      <input
                        type="time"
                        className="sp-time-input"
                        value={assistantPrefs.startTime}
                        onChange={(e) => setAssistantPrefs((p) => ({ ...p, startTime: e.target.value }))}
                      />
                      <span className="sp-time-sep">to</span>
                      <input
                        type="time"
                        className="sp-time-input"
                        value={assistantPrefs.endTime}
                        onChange={(e) => setAssistantPrefs((p) => ({ ...p, endTime: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="sp-field">
                    <label className="sp-label">Thrill Level</label>
                    <div className="sp-chips">
                      {["All", "Low", "Moderate", "High"].map((level) => (
                        <button
                          key={level}
                          className={`sp-chip ${assistantPrefs.thrillPref === level ? "active" : ""}`}
                          onClick={() => setAssistantPrefs((p) => ({ ...p, thrillPref: level }))}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sp-field">
                    <label className="sp-label">Ride Types</label>
                    <div className="sp-chips">
                      {parkRideTypes.map((type) => (
                        <button
                          key={type}
                          className={`sp-chip ${assistantPrefs.typePref.includes(type) ? "active" : ""}`}
                          onClick={() => toggleTypePref(type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <span className="sp-hint">None selected = all included</span>
                  </div>

                  <div className="sp-field">
                    <label className="sp-label">Max Height Requirement</label>
                    <select
                      className="sp-select"
                      value={assistantPrefs.maxHeight}
                      onChange={(e) => setAssistantPrefs((p) => ({ ...p, maxHeight: Number(e.target.value) }))}
                    >
                      <option value={0}>No limit</option>
                      <option value={36}>36" (91 cm)</option>
                      <option value={40}>40" (102 cm)</option>
                      <option value={44}>44" (112 cm)</option>
                      <option value={48}>48" (122 cm)</option>
                      <option value={52}>52" (132 cm)</option>
                    </select>
                  </div>

                  <div className="sp-field">
                    <label className="sp-label">Strategy</label>
                    <div className="sp-chips">
                      <button
                        className={`sp-chip ${assistantPrefs.strategy === "headliners" ? "active" : ""}`}
                        onClick={() => setAssistantPrefs((p) => ({ ...p, strategy: "headliners" }))}
                      >
                        Hit the Headliners
                      </button>
                      <button
                        className={`sp-chip ${assistantPrefs.strategy === "maxrides" ? "active" : ""}`}
                        onClick={() => setAssistantPrefs((p) => ({ ...p, strategy: "maxrides" }))}
                      >
                        Maximize Rides
                      </button>
                    </div>
                  </div>

                  <div className="sp-actions">
                    <button className="sp-btn sp-btn-cancel" onClick={() => setAssistantMode(null)}>
                      Cancel
                    </button>
                    <button className="sp-btn sp-btn-generate" onClick={handleGenerate}>
                      Generate Plan
                    </button>
                  </div>
                </div>
              )}

              {/* Smart Plan Preview */}
              {selectedPark && assistantMode === "preview" && (
                <div className="sp-preview">
                  {generatedPlan.length === 0 ? (
                    <div className="sp-empty">
                      <p>No rides match your preferences</p>
                      <span>Try widening your filters or extending the time window</span>
                      <button className="sp-btn sp-btn-cancel" onClick={() => setAssistantMode("form")} style={{ marginTop: "1rem" }}>
                        Back
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="sp-preview-header">
                        <h3 className="sp-preview-title">Your Plan</h3>
                        <span className="sp-preview-stats">
                          {generatedPlan.length} rides, ~{Math.round(previewTimeline.totalTime)} min
                        </span>
                      </div>

                      <div className="schedule-timeline">
                        {previewTimeline.entries.map((entry, i) => {
                          if (entry.type === "walk") {
                            return (
                              <div key={`walk-${i}`} className="schedule-walk-block">
                                <div className="schedule-walk-line" />
                                <div className="schedule-walk-info">
                                  Walk to {entry.toArea} ({entry.duration}m)
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div
                              key={`ride-${entry.rideId}`}
                              className={`schedule-ride-block ${entry.overflow ? "overflow" : ""}`}
                            >
                              <div className="schedule-ride-time">{entry.startTimeStr}</div>
                              <div className="schedule-ride-content">
                                <div className="schedule-ride-name">{entry.name}</div>
                                <div className="schedule-ride-chips">
                                  <span className="schedule-chip schedule-chip-wait">
                                    {entry.waitTime}m wait
                                  </span>
                                  <span className="schedule-chip schedule-chip-duration">
                                    {entry.rideDuration}m ride
                                  </span>
                                  <span className="schedule-chip schedule-chip-area">{entry.area}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        <div className="schedule-summary">
                          <span>Total: ~{Math.round(previewTimeline.totalTime)} min</span>
                          <span>Ends: {previewTimeline.endTimeStr}</span>
                        </div>
                      </div>

                      <div className="sp-actions">
                        <button className="sp-btn sp-btn-cancel" onClick={() => setAssistantMode("form")}>
                          Back
                        </button>
                        <button className="sp-btn sp-btn-cancel" onClick={handleGenerate}>
                          Regenerate
                        </button>
                        <button className="sp-btn sp-btn-accept" onClick={handleAcceptPlan}>
                          Accept
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Normal view: Timeline + Available Rides */}
              {assistantMode === null && (
                <>
                  {/* Timeline */}
                  {selectedPark && currentSchedule.length > 0 && (
                    <div className="schedule-timeline">
                      {timeline.entries.map((entry, i) => {
                        if (entry.type === "walk") {
                          return (
                            <div key={`walk-${i}`} className="schedule-walk-block">
                              <div className="schedule-walk-line" />
                              <div className="schedule-walk-info">
                                Walk to {entry.toArea} ({entry.duration}m)
                              </div>
                            </div>
                          );
                        }

                        rideIndex++;
                        const currentRideIndex = rideIndex;

                        return (
                          <div
                            key={`ride-${entry.rideId}`}
                            className={`schedule-ride-block ${entry.overflow ? "overflow" : ""}`}
                          >
                            <div className="schedule-ride-time">{entry.startTimeStr}</div>
                            <div className="schedule-ride-content">
                              <div className="schedule-ride-name">{entry.name}</div>
                              <div className="schedule-ride-chips">
                                <span className="schedule-chip schedule-chip-wait">
                                  {entry.waitTime}m wait
                                </span>
                                <span className="schedule-chip schedule-chip-duration">
                                  {entry.rideDuration}m ride
                                </span>
                                <span className="schedule-chip schedule-chip-area">{entry.area}</span>
                              </div>
                            </div>
                            <div className="schedule-ride-actions">
                              <button
                                className="schedule-move-btn"
                                onClick={() => moveRide(currentRideIndex, -1)}
                                disabled={currentRideIndex === 0}
                                aria-label="Move up"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18 15l-6-6-6 6" />
                                </svg>
                              </button>
                              <button
                                className="schedule-move-btn"
                                onClick={() => moveRide(currentRideIndex, 1)}
                                disabled={currentRideIndex === currentSchedule.length - 1}
                                aria-label="Move down"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M6 9l6 6 6-6" />
                                </svg>
                              </button>
                              <button
                                className="schedule-remove-btn"
                                onClick={() => removeRide(entry.rideId)}
                                aria-label={`Remove ${entry.name}`}
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                  <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Summary */}
                      <div className="schedule-summary">
                        <span>Total: ~{Math.round(timeline.totalTime)} min</span>
                        <span>Ends: {timeline.endTimeStr}</span>
                        {timeline.overflow && (
                          <span className="schedule-overflow-warning">Past park close!</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Available rides to add */}
                  {selectedPark && availableRides.length > 0 && (
                    <div className="schedule-available">
                      <h3 className="schedule-available-title">Available Rides</h3>
                      {availableRides.map((ride) => (
                        <div key={ride.id} className="schedule-available-item">
                          <div className="schedule-available-info">
                            <span className="schedule-available-name">{ride.name}</span>
                            <span className="schedule-available-meta">
                              {rideDetails[ride.id]?.avgWaitTime || 0}m avg wait · {ride.area}
                            </span>
                          </div>
                          <button
                            className="schedule-add-btn"
                            onClick={() => addRide(ride.id)}
                            aria-label={`Add ${ride.name}`}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedPark && currentSchedule.length === 0 && availableRides.length === 0 && (
                    <div className="panel-empty">
                      <p>All rides scheduled!</p>
                    </div>
                  )}
                </>
              )}

              {!selectedPark && (
                <div className="panel-empty" style={{ padding: "2rem" }}>
                  <p>Select a park to start planning this day</p>
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}
