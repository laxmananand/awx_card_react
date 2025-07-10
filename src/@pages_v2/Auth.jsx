import React, { useState, useEffect } from "react";
import FeaturesComponent from "../components/registration/FeaturesComponent";

export const Auth = ({ children }) => {
  return (
    <>
      <div>
        <div
        id="parent-container-for-auth-component"
          className="d-flex w-100 gap-2 p-2"
          style={{
            minHeight: "100vh",
            overflowY: "auto",
            backgroundColor:"rgb(169, 192, 209)"
          }}
        >
          {/* Placeholder for features component */}
          <div
            className="w-50"
          >
            {/* <img src="/cover/auth-cover.svg" alt="" className="w-40" />
        <div className="w-75">
          <h1 className="text-uppercase fw-bold">
            Stay on top of all company spending in real-time
          </h1>
          <h5 className="text-secondary">
            through our corporate innovative payment platform.
          </h5>
        </div> */}

            <FeaturesComponent />
          </div>

          {/* Placeholder for auth child components */}
          <div className="w-50 bg-white" style={{borderRadius:60}}>{children}</div>
        </div>
      </div>
    </>
  );
};
