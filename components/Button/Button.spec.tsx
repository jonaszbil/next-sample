import { fireEvent, render, screen } from "@testing-library/react";
import Button from "./Button";
import "@testing-library/jest-dom";

describe("Button", () => {
  test("Can be rendered", () => {
    render(<Button />);
    const btnElement = screen.getByRole("button");
    expect(btnElement).toBeInTheDocument();
  });

  test("Can contain text", () => {
    render(<Button>Example</Button>);
    const btnElement = screen.getByRole("button");
    expect(btnElement).toHaveTextContent("Example");
  });

  test("Can be given a custom class", () => {
    render(<Button className="testing" />);
    const btnElement = screen.getByRole("button");
    expect(btnElement).toHaveClass("testing");
  });

  test("Executes onClick callback when clicked", () => {
    const mockFn = jest.fn();
    render(<Button onClick={mockFn} />);
    const btnElement = screen.getByRole("button");
    fireEvent.click(btnElement);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("Can be disabled", () => {
    render(<Button disabled />)
    const btnElement = screen.getByRole("button");
    expect(btnElement).toBeDisabled();
  });

  test("Doesn't execute onClick callback if disabled", () => {
    const mockFn = jest.fn();
    render(<Button disabled onClick={mockFn} />)
    const btnElement = screen.getByRole("button");
    fireEvent.click(btnElement);
    expect(mockFn).toHaveBeenCalledTimes(0);
  })
});
