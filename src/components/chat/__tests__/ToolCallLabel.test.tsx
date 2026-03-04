import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallLabel } from "../ToolCallLabel";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

test("str_replace_editor with create command shows 'Created {path}'", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/components/Card.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolCallLabel toolInvocation={toolInvocation} />);

  expect(screen.getByText("Created /components/Card.jsx")).toBeDefined();
});

test("str_replace_editor with str_replace command shows 'Edited {path}'", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "2",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolCallLabel toolInvocation={toolInvocation} />);

  expect(screen.getByText("Edited /App.jsx")).toBeDefined();
});

test("str_replace_editor with insert command shows 'Edited {path}'", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "3",
    toolName: "str_replace_editor",
    args: { command: "insert", path: "/utils/helpers.js" },
    state: "result",
    result: "Success",
  };

  render(<ToolCallLabel toolInvocation={toolInvocation} />);

  expect(screen.getByText("Edited /utils/helpers.js")).toBeDefined();
});

test("str_replace_editor with view command shows 'Viewed {path}'", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "4",
    toolName: "str_replace_editor",
    args: { command: "view", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolCallLabel toolInvocation={toolInvocation} />);

  expect(screen.getByText("Viewed /App.jsx")).toBeDefined();
});

test("file_manager with rename command shows rename message", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "5",
    toolName: "file_manager",
    args: { command: "rename", path: "/old.jsx", new_path: "/new.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolCallLabel toolInvocation={toolInvocation} />);

  expect(screen.getByText("Renamed /old.jsx → /new.jsx")).toBeDefined();
});

test("file_manager with delete command shows 'Deleted {path}'", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "6",
    toolName: "file_manager",
    args: { command: "delete", path: "/temp.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolCallLabel toolInvocation={toolInvocation} />);

  expect(screen.getByText("Deleted /temp.jsx")).toBeDefined();
});

test("unknown tool name falls back to displaying raw tool name", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "7",
    toolName: "some_unknown_tool",
    args: {},
    state: "result",
    result: "Success",
  };

  render(<ToolCallLabel toolInvocation={toolInvocation} />);

  expect(screen.getByText("some_unknown_tool")).toBeDefined();
});

test("in-progress state shows spinner, completed state shows green dot", () => {
  const inProgress: ToolInvocation = {
    toolCallId: "8",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "call",
  };

  const { container, unmount } = render(
    <ToolCallLabel toolInvocation={inProgress} />
  );

  // Should have the spinning loader (svg with animate-spin class)
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  // Should NOT have the green dot
  expect(container.querySelector(".bg-emerald-500")).toBeNull();

  unmount();

  const completed: ToolInvocation = {
    toolCallId: "9",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };

  const { container: container2 } = render(
    <ToolCallLabel toolInvocation={completed} />
  );

  // Should have the green dot
  expect(container2.querySelector(".bg-emerald-500")).not.toBeNull();
  // Should NOT have the spinner
  expect(container2.querySelector(".animate-spin")).toBeNull();
});
