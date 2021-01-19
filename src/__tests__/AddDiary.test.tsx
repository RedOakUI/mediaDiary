import { render } from "@testing-library/react";
import React from "react";
import Welcome from "../components/Welcome";

test("[Welcome] Render Page", () => {
  const { getByText } = render(<Welcome />);
  getByText("mediaDiary");
});
