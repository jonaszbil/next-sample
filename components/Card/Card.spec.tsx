import { fireEvent, render, screen } from "@testing-library/react";
import Card from "./Card";
import "@testing-library/jest-dom";

const testProps = {
  title: "One",
  text: "Sample card text",
  color: "bg-amber-600",
};

describe("Button", () => {
  test("Can be rendered", () => {
    render(<Card {...testProps} />);
    const card = screen.getByTestId("card");
    expect(card).toBeInTheDocument();
  });

  test("Contains the title", () => {
    render(<Card {...testProps} />);
    const title = screen.getByRole("heading");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(testProps.title);
  });

  test("Contains the card text", () => {
    render(<Card {...testProps} />);
    const paragraph = screen.getByTestId("card-text");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent(testProps.text);
  });

  test("Contains the button", () => {
    render(<Card {...testProps} />);
    const btn = screen.getByRole("button");
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent("Click me");
  });

  test("Button text changes when clicked", () => {
    render(<Card {...testProps} />);
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    expect(btn).toHaveTextContent("Clicked");
    fireEvent.click(btn);
    expect(btn).toHaveTextContent("Click me");
  });

  test("Color is applied as a Tailwind class", () => {
    render(<Card {...testProps} />);
    const card = screen.getByTestId("card");
    expect(card).toHaveClass(testProps.color);
  });
});
