import { useEffect } from "react";

export default function RideListPanel({ open, onClose, rides, onRemove, onClear, onRideClick }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleKey = (e) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", handleKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKey);
      };
    }
  }, [open, onClose]);

  const grouped = {};
  rides.forEach((ride) => {
    if (!grouped[ride.park]) grouped[ride.park] = [];
    grouped[ride.park].push(ride);
  });

  return (
    <>
      <div
        className={`panel-backdrop ${open ? "open" : ""}`}
        onClick={onClose}
      />
      <aside className={`list-panel ${open ? "open" : ""}`}>
        <div className="panel-header">
          <h2 className="panel-title">My Ride List</h2>
          <span className="panel-count">{rides.length} rides</span>
          <button className="modal-close panel-close-btn" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="panel-body">
          {rides.length === 0 ? (
            <div className="panel-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
              </svg>
              <p>Your list is empty</p>
              <span>Click "Add to List" on any ride to start planning</span>
            </div>
          ) : (
            <>
              {Object.entries(grouped).map(([park, parkRides]) => (
                <div key={park} className="panel-park-group">
                  <h3 className="panel-park-name">{park}</h3>
                  {parkRides.map((ride) => (
                    <div
                      key={ride.id}
                      className="panel-ride-item"
                      onClick={() => onRideClick(ride)}
                    >
                      <div className="panel-ride-info">
                        <span className="panel-ride-name">{ride.name}</span>
                        <span className="panel-ride-meta">
                          {ride.type}
                          <span className={`panel-thrill thrill-${ride.thrill.toLowerCase()}`}>
                            {ride.thrill}
                          </span>
                        </span>
                      </div>
                      <button
                        className="panel-remove-btn"
                        onClick={(e) => { e.stopPropagation(); onRemove(ride.id); }}
                        aria-label={`Remove ${ride.name}`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ))}

              <button className="panel-clear-btn" onClick={onClear}>
                Clear Entire List
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
