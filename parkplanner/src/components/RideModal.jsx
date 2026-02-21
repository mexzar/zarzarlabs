import { useEffect } from "react";
import RideImage from "./RideImage";
import rideDetails from "../data/rideDetails";

export default function RideModal({ ride, onClose, isInList, onToggle }) {
  const detail = rideDetails[ride.id] || {};

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const stats = [
    detail.duration && { label: "Duration", value: detail.duration },
    detail.speed && { label: "Speed", value: detail.speed },
    detail.height && { label: "Height Req.", value: detail.height },
    detail.opened && { label: "Opened", value: detail.opened },
  ].filter(Boolean);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="modal-hero">
          <RideImage ride={ride} large />
        </div>

        <div className="modal-body">
          <div className="modal-header">
            <h2 className="modal-title">{ride.name}</h2>
            <span className={`thrill-badge thrill-${ride.thrill.toLowerCase()}`}>
              {ride.thrill} Thrill
            </span>
          </div>

          <div className="modal-location">
            <span className={`resort-badge ${ride.resort === "Disney World" ? "disney" : "universal"}`}>
              {ride.resort}
            </span>
            <span className="modal-park">{ride.park}</span>
            <span className="modal-area">{ride.area}</span>
          </div>

          <div className="modal-tags">
            <span className="tag tag-type">{ride.type}</span>
          </div>

          {stats.length > 0 && (
            <div className="modal-stats">
              {stats.map((s) => (
                <div key={s.label} className="modal-stat">
                  <span className="modal-stat-value">{s.value}</span>
                  <span className="modal-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="modal-description">
            <p>{detail.details || ride.description}</p>
          </div>

          <button
            className={`modal-add-btn ${isInList ? "added" : ""}`}
            onClick={onToggle}
          >
            {isInList ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                In My List
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                Add to My List
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
