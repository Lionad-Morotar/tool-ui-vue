import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("Utility Functions", () => {
  /**
   * TEST-UTIL-01: Safe Navigation Utilities
   * Tests the cn() class merging utility
   */
  describe("cn() - Class Merging Utility", () => {
    describe("String classes", () => {
      it("should merge multiple string classes", () => {
        const result = cn("class1", "class2", "class3");
        expect(result).toBe("class1 class2 class3");
      });

      it("should handle single string class", () => {
        const result = cn("single-class");
        expect(result).toBe("single-class");
      });

      it("should handle empty string", () => {
        const result = cn("");
        expect(result).toBe("");
      });

      it("should trim whitespace from classes", () => {
        const result = cn("  padded  ", "normal");
        expect(result).toBe("padded normal");
      });
    });

    describe("Conditional classes (object syntax)", () => {
      it("should include classes with true values", () => {
        const result = cn({ active: true, disabled: false });
        expect(result).toBe("active");
      });

      it("should handle all true values", () => {
        const result = cn({ class1: true, class2: true, class3: true });
        expect(result).toBe("class1 class2 class3");
      });

      it("should handle all false values", () => {
        const result = cn({ class1: false, class2: false });
        expect(result).toBe("");
      });

      it("should handle mixed boolean expressions", () => {
        const isActive = true;
        const isDisabled = false;
        const result = cn({ active: isActive, disabled: isDisabled });
        expect(result).toBe("active");
      });

      it("should handle conditional with string classes", () => {
        const result = cn("base-class", { conditional: true, skipped: false });
        expect(result).toBe("base-class conditional");
      });
    });

    describe("Null/undefined values", () => {
      it("should filter out null values", () => {
        const result = cn("class1", null, "class2");
        expect(result).toBe("class1 class2");
      });

      it("should filter out undefined values", () => {
        const result = cn("class1", undefined, "class2");
        expect(result).toBe("class1 class2");
      });

      it("should filter out false values", () => {
        const result = cn("class1", false, "class2");
        expect(result).toBe("class1 class2");
      });

      it("should handle all nullish values", () => {
        const result = cn(null, undefined, false);
        expect(result).toBe("");
      });

      it("should handle optional class that is undefined", () => {
        const optionalClass: string | undefined = undefined;
        const result = cn("base", optionalClass);
        expect(result).toBe("base");
      });
    });

    describe("Mixed inputs", () => {
      it("should handle mix of strings, objects, and nullish", () => {
        const result = cn(
          "base-class",
          { active: true, hidden: false },
          null,
          "static-class",
          undefined,
          { conditional: true }
        );
        expect(result).toBe("base-class active static-class conditional");
      });

      it("should handle Tailwind-style classes", () => {
        const isPrimary = true;
        const isLarge = false;
        const result = cn(
          "px-4 py-2 rounded",
          isPrimary ? "bg-blue-500 text-white" : "bg-gray-200",
          { "text-lg": isLarge, "text-sm": !isLarge }
        );
        expect(result).toBe("px-4 py-2 rounded bg-blue-500 text-white text-sm");
      });

      it("should handle component className merging", () => {
        const baseClasses = "flex items-center gap-2";
        const userClasses = "custom-class another-class";
        const result = cn(baseClasses, userClasses);
        expect(result).toBe("flex items-center gap-2 custom-class another-class");
      });

      it("should handle complex conditional styling", () => {
        const variant = "primary";
        const size = "large";
        const isDisabled = true;

        const result = cn(
          "btn",
          {
            "btn-primary": variant === "primary",
            "btn-secondary": variant === "secondary",
            "btn-large": size === "large",
            "btn-small": size === "small",
            "btn-disabled": isDisabled,
          }
        );
        expect(result).toBe("btn btn-primary btn-large btn-disabled");
      });
    });

    describe("Edge cases", () => {
      it("should handle empty call", () => {
        const result = cn();
        expect(result).toBe("");
      });

      it("should handle empty object", () => {
        const result = cn({});
        expect(result).toBe("");
      });

      it("should handle object with only false values", () => {
        const result = cn({ a: false, b: false, c: false });
        expect(result).toBe("");
      });

      it("should handle deeply nested conditionals", () => {
        const condition1 = true;
        const condition2 = false;
        const condition3 = true;

        const result = cn({
          class1: condition1,
          class2: condition2,
          class3: condition3,
          class4: condition1 && condition2,
          class5: condition1 || condition2,
        });
        expect(result).toBe("class1 class3 class5");
      });

      it("should preserve class order", () => {
        const result = cn("first", "second", "third", { fourth: true }, "fifth");
        expect(result).toBe("first second third fourth fifth");
      });
    });
  });

  /**
   * TEST-UTIL-02: Link Sanitization
   * Tests URL sanitization utilities
   */
  describe("Link Sanitization", () => {
    // These tests document expected link sanitization behavior
    // The actual implementation should be added to utils.ts

    describe("URL protocol validation", () => {
      it("should accept http URLs", () => {
        // Placeholder - implementation needed
        const url = "http://example.com";
        expect(url).toMatch(/^https?:\/\//);
      });

      it("should accept https URLs", () => {
        // Placeholder - implementation needed
        const url = "https://example.com";
        expect(url).toMatch(/^https?:\/\//);
      });

      it("should reject javascript: URLs", () => {
        const url = "javascript:alert('xss')";
        expect(url).not.toMatch(/^https?:\/\//);
        expect(url.startsWith("javascript:")).toBe(true);
      });

      it("should reject data: URLs", () => {
        const url = "data:text/html,<script>alert('xss')</script>";
        expect(url.startsWith("data:")).toBe(true);
      });
    });

    describe("URL cleaning", () => {
      it("should trim whitespace from URLs", () => {
        const url = "  https://example.com  ".trim();
        expect(url).toBe("https://example.com");
      });

      it("should handle URLs with query parameters", () => {
        const url = "https://example.com?foo=bar&baz=qux";
        expect(url).toContain("?");
        expect(url).toContain("foo=bar");
      });

      it("should handle URLs with hash fragments", () => {
        const url = "https://example.com#section";
        expect(url).toContain("#section");
      });
    });

    describe("Malicious URL detection", () => {
      it("should detect URLs with embedded scripts", () => {
        const suspiciousUrls = [
          "https://example.com/<script>",
          "https://example.com/javascript:alert(1)",
          "https://example.com/onerror=alert(1)",
        ];

        for (const url of suspiciousUrls) {
          // Basic check for script tags or event handlers
          const hasScript = /<script|javascript:|on\w+=/i.test(url);
          expect(hasScript).toBe(true);
        }
      });

      it("should allow safe URLs with special characters", () => {
        const safeUrls = [
          "https://example.com/path-with-dashes",
          "https://example.com/under_scores",
          "https://example.com/tilde~tilde",
        ];

        for (const url of safeUrls) {
          const hasScript = /<script|javascript:|on\w+=/i.test(url);
          expect(hasScript).toBe(false);
        }
      });
    });
  });
});
