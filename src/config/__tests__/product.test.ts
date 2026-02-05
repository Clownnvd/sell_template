import { describe, it, expect } from "vitest";
import { product } from "../product";

describe("Product Config", () => {
  it("has correct name", () => {
    expect(product.name).toBe("King Template");
  });

  it("has price of $99", () => {
    expect(product.price).toBe(99);
    expect(product.priceInCents).toBe(9900);
  });

  it("has a features list", () => {
    expect(product.features).toBeInstanceOf(Array);
    expect(product.features.length).toBeGreaterThan(0);
  });

  it("has a slug", () => {
    expect(product.slug).toBe("king-template");
  });
});
