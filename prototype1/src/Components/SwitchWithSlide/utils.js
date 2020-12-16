import React from "react";
import { Route } from "react-router-dom";

export const animateSwitch = (CustomSwitch, AnimatorComponent) => ({
  updateStep,
  children,
}) => (
  <Route
    render={({ location }) => (
      <AnimatorComponent uniqKey={location.pathname} updateStep={updateStep}>
        <CustomSwitch location={location}>{children}</CustomSwitch>
      </AnimatorComponent>
    )}
  />
);
