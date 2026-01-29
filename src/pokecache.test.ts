import { Cache } from "./pokecache.js";
import { test, expect } from "vitest";

test.concurrent.each([
  {
    key: "https://example.com",
    val: "testdata",
    interval: 500,
  },
  {
    key: "https://example.com/path",
    val: "moretestdata",
    interval: 1000,
  },
])("Test Caching $interval ms", async ({ key, val, interval }) => {
  const cache = new Cache(interval);

  cache.add(key, val);
  const cached = cache.get(key);
  expect(cached).toBe(val);

  // Wait for the interval plus enough time for the reap loop to run
  await new Promise((resolve) => setTimeout(resolve, interval * 2 + 100));
  const reaped = cache.get(key);
  expect(reaped).toBe(undefined);

  cache.stopReapLoop();
});

test("Cache returns undefined for missing keys", () => {
  const cache = new Cache(1000);
  const result = cache.get("nonexistent");
  expect(result).toBe(undefined);
  cache.stopReapLoop();
});

test("Cache can store and retrieve objects", () => {
  const cache = new Cache(1000);
  const obj = { name: "pikachu", id: 25 };
  cache.add("pokemon", obj);
  const cached = cache.get<typeof obj>("pokemon");
  expect(cached).toEqual(obj);
  cache.stopReapLoop();
});
