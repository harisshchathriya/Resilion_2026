import React, { useState } from "react";
import "./StockPopup.css";

const StockPopup = ({ onClose }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // show success UI
    setSubmitted(true);

    // close popup AFTER success is visible
    setTimeout(() => {
      onClose(); // unmount popup
    }, 2500); // 👈 increased delay
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        {!submitted ? (
          <>
            <h3>Add Stock Request</h3>

            <form onSubmit={handleSubmit} className="popup-form">
              <input type="date" required />
              <input type="text" placeholder="Available Space" required />
              <input type="text" placeholder="Types of Goods Stored" required />
              <input type="text" placeholder="Required Stock" required />
              <input
                type="number"
                placeholder="Required Stock Quantity"
                required
              />

              <div className="popup-actions">
                <button type="submit" className="primary">
                  Submit
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          /* ✅ SUCCESS MESSAGE */
          <div className="success-box">
            <h3>✅ Submitted Successfully</h3>
            <p>Your stock request has been recorded.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockPopup;
