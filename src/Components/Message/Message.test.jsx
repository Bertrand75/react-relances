import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import Message from "./Message.jsx";
import "@testing-library/jest-dom/extend-expect";

test("Apparition message", () => {
  render(<Message message={{ status: 200, content: "TestMessage" }}></Message>);
  const ulog = screen.getByText("TestMessage");
  expect(ulog).toBeInTheDocument();
});
