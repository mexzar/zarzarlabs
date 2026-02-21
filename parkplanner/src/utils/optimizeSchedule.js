import { getWalkingTime } from "../data/walkingTimes";

// Parse "HH:MM" to minutes since midnight
function parseTime(str) {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
}

// Format minutes since midnight to "h:mm AM/PM"
function formatTime(minutes) {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

// Get crowd multiplier based on time of day
// Early morning: 0.5x, midday peak: 1.3x, evening: 0.7x
function crowdMultiplier(minutesSinceMidnight) {
  const hour = minutesSinceMidnight / 60;
  if (hour < 10) return 0.5;
  if (hour < 11) return 0.7;
  if (hour < 14) return 1.3;
  if (hour < 16) return 1.1;
  if (hour < 18) return 0.9;
  return 0.7;
}

// Parse ride duration string ("M:SS" or "Self-paced" / "Continuous") to minutes
function parseDuration(durationStr) {
  if (!durationStr || durationStr === "Self-paced" || durationStr === "Continuous") return 5;
  const parts = durationStr.split(":");
  if (parts.length === 2) {
    return parseInt(parts[0]) + parseInt(parts[1]) / 60;
  }
  return 5;
}

/**
 * Build a timeline from an ordered list of ride IDs.
 * Returns { entries: [...], totalTime, endTimeStr, startTimeStr, overflow }
 */
export function buildTimeline(rideIds, parkName, hoursEntry, walkingTimesData, rideDetailsMap, ridesData) {
  if (!rideIds.length || !hoursEntry) {
    return { entries: [], totalTime: 0, endTimeStr: "", startTimeStr: "", overflow: false };
  }

  const openMin = parseTime(hoursEntry.open);
  const closeMin = parseTime(hoursEntry.close);
  let currentTime = openMin;
  const entries = [];
  let prevArea = null;

  for (const rideId of rideIds) {
    const ride = ridesData.find((r) => r.id === rideId);
    if (!ride) continue;

    const details = rideDetailsMap[rideId] || {};
    const area = ride.area;

    // Add walking time if changing areas
    if (prevArea && prevArea !== area) {
      const walkMin = getWalkingTime(parkName, prevArea, area);
      if (walkMin > 0) {
        entries.push({
          type: "walk",
          fromArea: prevArea,
          toArea: area,
          duration: walkMin,
          startTime: currentTime,
          startTimeStr: formatTime(currentTime),
        });
        currentTime += walkMin;
      }
    }

    const baseWait = details.avgWaitTime || 0;
    const adjustedWait = Math.round(baseWait * crowdMultiplier(currentTime));
    const rideDuration = Math.ceil(parseDuration(details.duration));
    const totalRideTime = adjustedWait + rideDuration;

    entries.push({
      type: "ride",
      rideId,
      name: ride.name,
      area,
      waitTime: adjustedWait,
      rideDuration,
      totalTime: totalRideTime,
      startTime: currentTime,
      startTimeStr: formatTime(currentTime),
      endTime: currentTime + totalRideTime,
      endTimeStr: formatTime(currentTime + totalRideTime),
      overflow: currentTime >= closeMin,
    });

    currentTime += totalRideTime;
    prevArea = area;
  }

  return {
    entries,
    totalTime: currentTime - openMin,
    startTimeStr: formatTime(openMin),
    endTimeStr: formatTime(currentTime),
    overflow: currentTime > closeMin,
  };
}

/**
 * Auto-generate a ride plan based on user preferences.
 * Returns an optimized array of ride IDs that fit within the time window.
 */
export function generatePlan(
  parkName, prefs, ridesData, rideDetailsMap, walkingTimesData
) {
  const { startTime, endTime, thrillPref, typePref, maxHeight, strategy } = prefs;

  const availableMinutes = parseTime(endTime) - parseTime(startTime);
  if (availableMinutes <= 0) return [];

  const customHours = { open: startTime, close: endTime };

  // 1. Filter candidates — all rides at this park matching preferences
  const candidates = ridesData.filter((r) => {
    if (r.park !== parkName) return false;
    if (thrillPref !== "All" && r.thrill !== thrillPref) return false;
    if (typePref.length > 0 && !typePref.includes(r.type)) return false;
    if (maxHeight > 0) {
      const details = rideDetailsMap[r.id];
      if (details?.height) {
        const match = details.height.match(/(\d+)/);
        if (match && parseInt(match[1]) > maxHeight) return false;
      }
    }
    return true;
  });

  if (candidates.length === 0) return [];

  // 2. Score candidates by strategy
  const scored = candidates.map((r) => {
    const details = rideDetailsMap[r.id] || {};
    const avgWait = details.avgWaitTime || 0;
    const duration = parseDuration(details.duration);
    const totalTime = avgWait + Math.ceil(duration);
    const thrillBonus = r.thrill === "High" ? 20 : r.thrill === "Moderate" ? 10 : 0;

    let score;
    if (strategy === "headliners") {
      score = avgWait * 2 + thrillBonus;
    } else {
      // "maxrides" — favor short rides
      score = (totalTime > 0 ? 100 / totalTime : 10) + avgWait * 0.1 + thrillBonus * 0.3;
    }

    return { id: r.id, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // 3. Greedy selection — add rides while they fit in the time window
  const selected = [];

  for (const { id } of scored) {
    const tentative = [...selected, id];
    const optimized = optimizeSchedule(tentative, parkName, customHours, walkingTimesData, rideDetailsMap, ridesData);
    const timeline = buildTimeline(optimized, parkName, customHours, walkingTimesData, rideDetailsMap, ridesData);

    if (timeline.totalTime <= availableMinutes) {
      selected.push(id);
    }
  }

  if (selected.length === 0) return [];

  // 4. Return final optimized order
  return optimizeSchedule(selected, parkName, customHours, walkingTimesData, rideDetailsMap, ridesData);
}

/**
 * Optimize the order of rides to minimize total time and maximize early low-crowd benefits.
 *
 * Strategy:
 * 1. Score each ride by wait time (higher wait = higher priority for early scheduling)
 * 2. Group rides by area
 * 3. Pick the area cluster with the highest priority ride first
 * 4. Within each area cluster, order by wait time descending
 * 5. Use nearest-neighbor to pick the next area
 */
export function optimizeSchedule(rideIds, parkName, hoursEntry, walkingTimesData, rideDetailsMap, ridesData) {
  if (rideIds.length <= 1) return rideIds;

  // Group rides by area
  const areaGroups = {};
  for (const id of rideIds) {
    const ride = ridesData.find((r) => r.id === id);
    if (!ride) continue;
    const area = ride.area;
    if (!areaGroups[area]) areaGroups[area] = [];
    areaGroups[area].push(id);
  }

  // Sort rides within each area by wait time descending (high-wait first)
  for (const area of Object.keys(areaGroups)) {
    areaGroups[area].sort((a, b) => {
      const waitA = rideDetailsMap[a]?.avgWaitTime || 0;
      const waitB = rideDetailsMap[b]?.avgWaitTime || 0;
      return waitB - waitA;
    });
  }

  // Score each area by its max wait time (priority for early scheduling)
  const areaPriorities = {};
  for (const [area, ids] of Object.entries(areaGroups)) {
    areaPriorities[area] = Math.max(...ids.map((id) => rideDetailsMap[id]?.avgWaitTime || 0));
  }

  // Pick the first area: the one with the highest priority ride
  const areaOrder = Object.keys(areaGroups);
  const sortedAreas = [...areaOrder].sort((a, b) => areaPriorities[b] - areaPriorities[a]);

  // Use nearest-neighbor starting from the highest-priority area
  const orderedAreas = [sortedAreas[0]];
  const remaining = new Set(sortedAreas.slice(1));

  while (remaining.size > 0) {
    const lastArea = orderedAreas[orderedAreas.length - 1];
    let nearest = null;
    let nearestDist = Infinity;

    for (const area of remaining) {
      const dist = getWalkingTime(parkName, lastArea, area);
      // Bias towards high-priority areas that are close
      const adjustedDist = dist - areaPriorities[area] * 0.05;
      if (adjustedDist < nearestDist) {
        nearestDist = adjustedDist;
        nearest = area;
      }
    }

    orderedAreas.push(nearest);
    remaining.delete(nearest);
  }

  // Flatten: areas in order, rides within each area sorted by wait time desc
  const result = [];
  for (const area of orderedAreas) {
    result.push(...areaGroups[area]);
  }

  return result;
}
