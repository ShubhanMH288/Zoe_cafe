import React, { useEffect, useState } from "react";
import "./servicebar.css";

const ServiceBar = () => {
  const [service, setService] = useState("Take Away");

  useEffect(() => {
    const savedService = localStorage.getItem("orderType");
    if (savedService) {
      setService(savedService);
    } else {
      localStorage.setItem("orderType", "Take Away");
    }
  }, []);

  const handleChange = (e) => {
    const selectedService = e.target.value;
    setService(selectedService);
    localStorage.setItem("orderType", selectedService);
  };

  return (
    <div className="service-bar">
      <div className="service-box">
        <label htmlFor="service">Service</label>
        <select id="service" value={service} onChange={handleChange}>
          <option>Dine In</option>
          <option>Take Away</option>
          <option>Delivery</option>
        </select>
      </div>
    </div>
  );
};

export default ServiceBar;