import { useState, useMemo, useCallback, useEffect } from "react";
import rides, { resorts, parks, thrillLevels, rideTypes } from "./data/rides";
import rideDetails from "./data/rideDetails";
import parkHours from "./data/parkHours";
import walkingTimes from "./data/walkingTimes";
import RideImage from "./components/RideImage";
import RideModal from "./components/RideModal";
import RideListPanel from "./components/RideListPanel";
import SchedulePanel from "./components/SchedulePanel";
import "./App.css";

const themeOptions = [
  { id: "midnight", label: "Midnight", color: "#6366f1" },
  { id: "light", label: "Light", color: "#f0f0f2" },
  { id: "ocean", label: "Ocean", color: "#0ea5e9" },
  { id: "sunset", label: "Sunset", color: "#f59e0b" },
  { id: "enchanted", label: "Enchanted", color: "#a855f7" },
  { id: "aurora", label: "Aurora", color: "linear-gradient(135deg, #10b981, #06b6d4, #8b5cf6)" },
  { id: "neon", label: "Neon", color: "linear-gradient(135deg, #ec4899, #22d3ee, #facc15)" },
  { id: "tropical", label: "Tropical", color: "linear-gradient(135deg, #fb923c, #facc15, #2dd4bf)" },
];

function loadList() {
  try {
    const saved = localStorage.getItem("parkplanner-list");
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function App() {
  const [selectedResort, setSelectedResort] = useState("All");
  const [selectedPark, setSelectedPark] = useState("All");
  const [selectedThrill, setSelectedThrill] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRide, setSelectedRide] = useState(null);
  const [myList, setMyList] = useState(loadList);
  const [listOpen, setListOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("parkplanner-theme") || "midnight"
  );

  useEffect(() => {
    localStorage.setItem("parkplanner-list", JSON.stringify(myList));
  }, [myList]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("parkplanner-theme", theme);
  }, [theme]);

  const closeModal = useCallback(() => setSelectedRide(null), []);

  const isInList = useCallback((id) => myList.includes(id), [myList]);

  const toggleRide = useCallback((id, e) => {
    if (e) e.stopPropagation();
    setMyList((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  }, []);

  const clearList = useCallback(() => setMyList([]), []);

  const addMultipleToList = useCallback((ids) => {
    setMyList((prev) => {
      const existing = new Set(prev);
      const newIds = ids.filter((id) => !existing.has(id));
      return newIds.length ? [...prev, ...newIds] : prev;
    });
  }, []);

  const listRides = useMemo(
    () => myList.map((id) => rides.find((r) => r.id === id)).filter(Boolean),
    [myList]
  );

  const availableParks = useMemo(() => {
    if (selectedResort === "All") return Object.values(parks).flat();
    return parks[selectedResort] || [];
  }, [selectedResort]);

  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      if (selectedResort !== "All" && ride.resort !== selectedResort) return false;
      if (selectedPark !== "All" && ride.park !== selectedPark) return false;
      if (selectedThrill !== "All" && ride.thrill !== selectedThrill) return false;
      if (selectedType !== "All" && ride.type !== selectedType) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          ride.name.toLowerCase().includes(q) ||
          ride.description.toLowerCase().includes(q) ||
          ride.area.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedResort, selectedPark, selectedThrill, selectedType, searchQuery]);

  const groupedByPark = useMemo(() => {
    const groups = {};
    filteredRides.forEach((ride) => {
      const key = ride.park;
      if (!groups[key]) groups[key] = { resort: ride.resort, rides: [] };
      groups[key].rides.push(ride);
    });
    return groups;
  }, [filteredRides]);

  const handleResortChange = (resort) => {
    setSelectedResort(resort);
    setSelectedPark("All");
  };

  const clearFilters = () => {
    setSelectedResort("All");
    setSelectedPark("All");
    setSelectedThrill("All");
    setSelectedType("All");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedResort !== "All" ||
    selectedPark !== "All" ||
    selectedThrill !== "All" ||
    selectedType !== "All" ||
    searchQuery !== "";

  return (
    <div className="app">
      <header className="header">
        <div className="header-bg" />
        <div className="header-content">
          <h1 className="header-title">Park Planner</h1>
          <p className="header-subtitle">
            Every ride at Walt Disney World & Universal Orlando
          </p>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-number">{rides.length}</span>
              <span className="stat-label">Total Rides</span>
            </div>
            <div className="stat">
              <span className="stat-number">8</span>
              <span className="stat-label">Theme Parks</span>
            </div>
            <div className="stat">
              <span className="stat-number">2</span>
              <span className="stat-label">Resorts</span>
            </div>
          </div>
          <div className="theme-picker">
            {themeOptions.map((t) => (
              <button
                key={t.id}
                className={`theme-dot ${theme === t.id ? "active" : ""}`}
                style={{ "--dot-color": t.color }}
                onClick={() => setTheme(t.id)}
                aria-label={t.label}
                title={t.label}
              />
            ))}
          </div>
        </div>
      </header>

      <div className="filters-container">
        <div className="filters">
          <div className="search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search rides, areas, descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Resort</label>
              <select value={selectedResort} onChange={(e) => handleResortChange(e.target.value)}>
                <option value="All">All Resorts</option>
                {resorts.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Park</label>
              <select value={selectedPark} onChange={(e) => setSelectedPark(e.target.value)}>
                <option value="All">All Parks</option>
                {availableParks.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Thrill Level</label>
              <select value={selectedThrill} onChange={(e) => setSelectedThrill(e.target.value)}>
                <option value="All">All Levels</option>
                {thrillLevels.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Ride Type</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="All">All Types</option>
                {rideTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-info">
            <span className="results-count">
              Showing <strong>{filteredRides.length}</strong> of {rides.length} rides
            </span>
            {hasActiveFilters && (
              <button className="clear-btn" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Schedule button */}
      <button className="fab-schedule" onClick={() => setScheduleOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        Schedule
      </button>

      {/* Floating My List button */}
      <button className="fab-list" onClick={() => setListOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6M9 16h6" />
        </svg>
        My List
        {myList.length > 0 && <span className="fab-badge">{myList.length}</span>}
      </button>

      <main className="main">
        {Object.keys(groupedByPark).length === 0 ? (
          <div className="no-results">
            <h2>No rides found</h2>
            <p>Try adjusting your filters or search query.</p>
          </div>
        ) : (
          Object.entries(groupedByPark).map(([parkName, { resort, rides: parkRides }]) => (
            <section key={parkName} className="park-section">
              <div className="park-header">
                <h2 className="park-title">{parkName}</h2>
                <span className={`resort-badge ${resort === "Disney World" ? "disney" : "universal"}`}>
                  {resort}
                </span>
                <span className="park-count">{parkRides.length} rides</span>
              </div>
              <div className="rides-grid">
                {parkRides.map((ride) => (
                  <article
                    key={ride.id}
                    className={`ride-card ${resort === "Disney World" ? "disney" : "universal"} ${isInList(ride.id) ? "in-list" : ""}`}
                    onClick={() => setSelectedRide(ride)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter") setSelectedRide(ride); }}
                  >
                    <RideImage ride={ride} />
                    <div className="ride-card-body">
                      <div className="ride-card-top">
                        <h3 className="ride-name">{ride.name}</h3>
                        <span className={`thrill-badge thrill-${ride.thrill.toLowerCase()}`}>
                          {ride.thrill}
                        </span>
                      </div>
                      <div className="ride-tags">
                        <span className="tag tag-type">{ride.type}</span>
                        <span className="tag tag-area">{ride.area}</span>
                      </div>
                      <p className="ride-desc">{ride.description}</p>
                      <button
                        className={`add-btn ${isInList(ride.id) ? "added" : ""}`}
                        onClick={(e) => toggleRide(ride.id, e)}
                      >
                        {isInList(ride.id) ? (
                          <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                            In My List
                          </>
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                            Add to List
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <footer className="footer">
        <p>Park Planner &mdash; For planning purposes only. Ride availability may change.</p>
      </footer>

      {selectedRide && (
        <RideModal
          ride={selectedRide}
          onClose={closeModal}
          isInList={isInList(selectedRide.id)}
          onToggle={(e) => toggleRide(selectedRide.id, e)}
        />
      )}

      <RideListPanel
        open={listOpen}
        onClose={() => setListOpen(false)}
        rides={listRides}
        onRemove={(id) => toggleRide(id)}
        onClear={clearList}
        onRideClick={(ride) => { setListOpen(false); setSelectedRide(ride); }}
      />

      <SchedulePanel
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        myListRides={listRides}
        rideDetails={rideDetails}
        parkHours={parkHours}
        walkingTimes={walkingTimes}
        allRides={rides}
        onAddToList={addMultipleToList}
      />
    </div>
  );
}

export default App;
