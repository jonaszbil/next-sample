import { test, expect } from "@playwright/test";

test.describe("/hello", () => {
  test("Can GET /hello", async ({ request }) => {
    const resp = await request.get("/api/hello");
    expect(resp).toBeOK();
  });

  test("Response contains expected name", async ({ request }) => {
    const resp = await request.get("/api/hello");
    const data = await resp.json();
    expect(data.name).toEqual("John Doe");
  });
});
