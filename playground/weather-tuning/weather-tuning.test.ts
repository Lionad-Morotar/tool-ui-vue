import { describe, it, expect } from "vitest";

/**
 * Weather Tuning Parameter Types
 * Based on the WeatherWidget effects system
 */
interface WeatherParameter {
  name: string;
  type: "number" | "boolean" | "select";
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  defaultValue: unknown;
  category: "celestial" | "cloud" | "rain" | "lightning" | "snow" | "post";
}

interface WeatherTuningState {
  parameters: Record<string, unknown>;
  overrides: Record<string, unknown>;
  timestamp: number;
}

/**
 * Mock parameter definitions for testing
 * These represent the parameters that would be tunable in the playground
 */
const PARAMETER_DEFINITIONS: WeatherParameter[] = [
  // Celestial parameters
  { name: "timeOfDay", type: "number", min: 0, max: 1, step: 0.01, defaultValue: 0.5, category: "celestial" },
  { name: "starDensity", type: "number", min: 0, max: 1, step: 0.1, defaultValue: 0.8, category: "celestial" },
  { name: "skyBrightness", type: "number", min: 0, max: 2, step: 0.1, defaultValue: 1.0, category: "celestial" },

  // Cloud parameters
  { name: "coverage", type: "number", min: 0, max: 1, step: 0.05, defaultValue: 0.5, category: "cloud" },
  { name: "density", type: "number", min: 0, max: 1, step: 0.05, defaultValue: 0.6, category: "cloud" },
  { name: "windSpeed", type: "number", min: 0, max: 2, step: 0.1, defaultValue: 0.1, category: "cloud" },

  // Rain parameters
  { name: "rainIntensity", type: "number", min: 0, max: 1, step: 0.1, defaultValue: 0.5, category: "rain" },
  { name: "rainSpeed", type: "number", min: 0.1, max: 3, step: 0.1, defaultValue: 1.0, category: "rain" },
  { name: "glassIntensity", type: "number", min: 0, max: 1, step: 0.1, defaultValue: 0.3, category: "rain" },

  // Lightning parameters
  { name: "lightningEnabled", type: "boolean", defaultValue: true, category: "lightning" },
  { name: "flashIntensity", type: "number", min: 0, max: 2, step: 0.1, defaultValue: 1.0, category: "lightning" },

  // Snow parameters
  { name: "snowIntensity", type: "number", min: 0, max: 1, step: 0.1, defaultValue: 0.6, category: "snow" },
  { name: "snowFallSpeed", type: "number", min: 0.1, max: 2, step: 0.1, defaultValue: 0.5, category: "snow" },
  { name: "flakeSize", type: "number", min: 0.1, max: 2, step: 0.1, defaultValue: 0.8, category: "snow" },

  // Post-processing parameters
  { name: "bloomIntensity", type: "number", min: 0, max: 2, step: 0.1, defaultValue: 0.5, category: "post" },
  { name: "haze", type: "number", min: 0, max: 1, step: 0.1, defaultValue: 0.1, category: "post" },
];

/**
 * Helper functions for weather tuning
 */
function hasAnyTuningDelta(state: WeatherTuningState): boolean {
  return Object.keys(state.overrides).length > 0;
}

function listUpdatedParams(state: WeatherTuningState): string[] {
  return Object.keys(state.overrides);
}

function resolveParams(state: WeatherTuningState, defs: WeatherParameter[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const def of defs) {
    result[def.name] = state.overrides[def.name] ?? state.parameters[def.name] ?? def.defaultValue;
  }
  return result;
}

function getParameterDefinitionsByCategory(defs: WeatherParameter[], category: WeatherParameter["category"]): WeatherParameter[] {
  return defs.filter(d => d.category === category);
}

function validateParamValue(def: WeatherParameter, value: unknown): boolean {
  if (def.type === "number" && typeof value === "number") {
    if (def.min !== undefined && value < def.min) return false;
    if (def.max !== undefined && value > def.max) return false;
    return true;
  }
  if (def.type === "boolean" && typeof value === "boolean") return true;
  if (def.type === "select" && def.options?.includes(String(value))) return true;
  return false;
}

function exportToolUIConfig(state: WeatherTuningState): string {
  return JSON.stringify({
    version: "1.0",
    type: "weather-tuning",
    parameters: state.overrides,
    exportedAt: Date.now(),
  });
}

function importToolUIConfig(json: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(json);
    if (parsed.type === "weather-tuning" && parsed.parameters) {
      return parsed.parameters;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * TEST-PLAYGROUND-01..11: Weather Tuning Tests
 */
describe("Weather Tuning", () => {
  const baseState: WeatherTuningState = {
    parameters: {},
    overrides: {},
    timestamp: Date.now(),
  };

  /**
   * TEST-PLAYGROUND-01: Has Any Tuning Delta
   */
  describe("hasAnyTuningDelta", () => {
    it("should return false when no overrides exist", () => {
      const state = { ...baseState, overrides: {} };
      expect(hasAnyTuningDelta(state)).toBe(false);
    });

    it("should return true when overrides exist", () => {
      const state = { ...baseState, overrides: { rainIntensity: 0.8 } };
      expect(hasAnyTuningDelta(state)).toBe(true);
    });

    it("should detect multiple parameter overrides", () => {
      const state = {
        ...baseState,
        overrides: { rainIntensity: 0.8, cloudCoverage: 0.9 },
      };
      expect(hasAnyTuningDelta(state)).toBe(true);
    });
  });

  /**
   * TEST-PLAYGROUND-02: List Updated Params
   */
  describe("listUpdatedParams", () => {
    it("should return empty array when no overrides", () => {
      const state = { ...baseState, overrides: {} };
      expect(listUpdatedParams(state)).toEqual([]);
    });

    it("should list single updated parameter", () => {
      const state = { ...baseState, overrides: { rainIntensity: 0.8 } };
      expect(listUpdatedParams(state)).toEqual(["rainIntensity"]);
    });

    it("should list multiple updated parameters", () => {
      const state = {
        ...baseState,
        overrides: { rainIntensity: 0.8, snowIntensity: 0.5, bloomIntensity: 1.2 },
      };
      const params = listUpdatedParams(state);
      expect(params).toContain("rainIntensity");
      expect(params).toContain("snowIntensity");
      expect(params).toContain("bloomIntensity");
      expect(params).toHaveLength(3);
    });
  });

  /**
   * TEST-PLAYGROUND-03: Parameter Definitions Coverage
   */
  describe("parameter definitions coverage", () => {
    it("should have definitions for all weather categories", () => {
      const categories = new Set(PARAMETER_DEFINITIONS.map(d => d.category));
      expect(categories).toContain("celestial");
      expect(categories).toContain("cloud");
      expect(categories).toContain("rain");
      expect(categories).toContain("lightning");
      expect(categories).toContain("snow");
      expect(categories).toContain("post");
    });

    it("should have unique parameter names", () => {
      const names = PARAMETER_DEFINITIONS.map(d => d.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it("should have valid ranges for number parameters", () => {
      for (const def of PARAMETER_DEFINITIONS) {
        if (def.type === "number") {
          expect(def.min).toBeDefined();
          expect(def.max).toBeDefined();
          expect(def.min).toBeLessThan(def.max!);
        }
      }
    });

    it("should have default values for all parameters", () => {
      for (const def of PARAMETER_DEFINITIONS) {
        expect(def.defaultValue).toBeDefined();
      }
    });
  });

  /**
   * TEST-PLAYGROUND-04: Rain Parameter Ranges
   */
  describe("rain parameter ranges", () => {
    const rainParams = getParameterDefinitionsByCategory(PARAMETER_DEFINITIONS, "rain");

    it("should have rain intensity between 0 and 1", () => {
      const intensity = rainParams.find(p => p.name === "rainIntensity");
      expect(intensity).toBeDefined();
      expect(intensity?.min).toBe(0);
      expect(intensity?.max).toBe(1);
    });

    it("should have valid rain speed range", () => {
      const speed = rainParams.find(p => p.name === "rainSpeed");
      expect(speed).toBeDefined();
      expect(speed?.min).toBeGreaterThan(0);
      expect(speed?.max).toBeGreaterThan(speed?.min!);
    });

    it("should have glass intensity between 0 and 1", () => {
      const glass = rainParams.find(p => p.name === "glassIntensity");
      expect(glass).toBeDefined();
      expect(glass?.min).toBe(0);
      expect(glass?.max).toBe(1);
    });
  });

  /**
   * TEST-PLAYGROUND-05: Recover Repo Overrides
   */
  describe("recover repo overrides", () => {
    it("should recover overrides from saved state", () => {
      const savedOverrides = { rainIntensity: 0.9, skyBrightness: 1.5 };
      const state: WeatherTuningState = {
        ...baseState,
        parameters: { rainIntensity: 0.5 },
        overrides: savedOverrides,
      };

      const resolved = resolveParams(state, PARAMETER_DEFINITIONS);
      expect(resolved.rainIntensity).toBe(0.9); // Override takes precedence
      expect(resolved.skyBrightness).toBe(1.5);
    });

    it("should fall back to defaults when parameter missing", () => {
      const state: WeatherTuningState = {
        ...baseState,
        parameters: {},
        overrides: {},
      };

      const resolved = resolveParams(state, PARAMETER_DEFINITIONS);
      const rainDef = PARAMETER_DEFINITIONS.find(d => d.name === "rainIntensity");
      expect(resolved.rainIntensity).toBe(rainDef?.defaultValue);
    });
  });

  /**
   * TEST-PLAYGROUND-06: Resolve Params
   */
  describe("resolveParams", () => {
    it("should resolve all parameters with defaults", () => {
      const state = { ...baseState, parameters: {}, overrides: {} };
      const resolved = resolveParams(state, PARAMETER_DEFINITIONS);

      for (const def of PARAMETER_DEFINITIONS) {
        expect(resolved[def.name]).toBeDefined();
        expect(resolved[def.name]).toBe(def.defaultValue);
      }
    });

    it("should apply parameter overrides", () => {
      const state = {
        ...baseState,
        overrides: { rainIntensity: 0.9, cloudCoverage: 0.8 },
      };
      const resolved = resolveParams(state, PARAMETER_DEFINITIONS);

      expect(resolved.rainIntensity).toBe(0.9);
    });

    it("should merge parameters and overrides correctly", () => {
      const state: WeatherTuningState = {
        parameters: { starDensity: 0.5 },
        overrides: { rainIntensity: 0.8 },
        timestamp: Date.now(),
      };
      const resolved = resolveParams(state, PARAMETER_DEFINITIONS);

      expect(resolved.starDensity).toBe(0.5); // From parameters
      expect(resolved.rainIntensity).toBe(0.8); // From overrides
      expect(resolved.skyBrightness).toBe(1.0); // From default
    });
  });

  /**
   * TEST-PLAYGROUND-07: Snow Fall Speed Range
   */
  describe("snow fall speed range", () => {
    const snowParams = getParameterDefinitionsByCategory(PARAMETER_DEFINITIONS, "snow");

    it("should have snow fall speed within valid range", () => {
      const fallSpeed = snowParams.find(p => p.name === "snowFallSpeed");
      expect(fallSpeed).toBeDefined();
      expect(fallSpeed?.min).toBe(0.1);
      expect(fallSpeed?.max).toBe(2);
    });

    it("should validate snow speed values", () => {
      const fallSpeedDef = snowParams.find(p => p.name === "snowFallSpeed")!;

      expect(validateParamValue(fallSpeedDef, 0.5)).toBe(true);
      expect(validateParamValue(fallSpeedDef, 0.05)).toBe(false); // Below min
      expect(validateParamValue(fallSpeedDef, 2.5)).toBe(false); // Above max
    });

    it("should have snow intensity between 0 and 1", () => {
      const intensity = snowParams.find(p => p.name === "snowIntensity");
      expect(intensity).toBeDefined();
      expect(intensity?.min).toBe(0);
      expect(intensity?.max).toBe(1);
    });
  });

  /**
   * TEST-PLAYGROUND-08: Studio Timestamp
   */
  describe("studio timestamp", () => {
    it("should generate valid timestamp", () => {
      const state: WeatherTuningState = {
        ...baseState,
        timestamp: Date.now(),
      };

      expect(state.timestamp).toBeGreaterThan(0);
      expect(typeof state.timestamp).toBe("number");
    });

    it("should have millisecond precision", () => {
      const before = Date.now();
      const state: WeatherTuningState = {
        ...baseState,
        timestamp: Date.now(),
      };
      const after = Date.now();

      expect(state.timestamp).toBeGreaterThanOrEqual(before);
      expect(state.timestamp).toBeLessThanOrEqual(after);
    });
  });

  /**
   * TEST-PLAYGROUND-09: Tool UI Export
   */
  describe("exportToolUIConfig", () => {
    it("should export configuration as JSON", () => {
      const state: WeatherTuningState = {
        ...baseState,
        overrides: { rainIntensity: 0.8, snowIntensity: 0.5 },
      };

      const exported = exportToolUIConfig(state);
      const parsed = JSON.parse(exported);

      expect(parsed.type).toBe("weather-tuning");
      expect(parsed.parameters).toEqual(state.overrides);
      expect(parsed.version).toBe("1.0");
      expect(parsed.exportedAt).toBeDefined();
    });

    it("should include all override parameters in export", () => {
      const state: WeatherTuningState = {
        ...baseState,
        overrides: {
          rainIntensity: 0.9,
          cloudCoverage: 0.7,
          bloomIntensity: 1.2,
        },
      };

      const exported = exportToolUIConfig(state);
      const parsed = JSON.parse(exported);

      expect(Object.keys(parsed.parameters)).toHaveLength(3);
      expect(parsed.parameters.rainIntensity).toBe(0.9);
      expect(parsed.parameters.cloudCoverage).toBe(0.7);
      expect(parsed.parameters.bloomIntensity).toBe(1.2);
    });
  });

  /**
   * TEST-PLAYGROUND-10: Tool UI Import
   */
  describe("importToolUIConfig", () => {
    it("should import valid configuration", () => {
      const config = {
        version: "1.0",
        type: "weather-tuning",
        parameters: { rainIntensity: 0.8 },
        exportedAt: Date.now(),
      };

      const imported = importToolUIConfig(JSON.stringify(config));
      expect(imported).toEqual({ rainIntensity: 0.8 });
    });

    it("should return null for invalid JSON", () => {
      const imported = importToolUIConfig("not valid json");
      expect(imported).toBeNull();
    });

    it("should return null for wrong type", () => {
      const config = {
        version: "1.0",
        type: "wrong-type",
        parameters: { rainIntensity: 0.8 },
      };

      const imported = importToolUIConfig(JSON.stringify(config));
      expect(imported).toBeNull();
    });

    it("should return null for missing parameters", () => {
      const config = {
        version: "1.0",
        type: "weather-tuning",
      };

      const imported = importToolUIConfig(JSON.stringify(config));
      expect(imported).toBeNull();
    });

    it("should maintain round-trip consistency", () => {
      const originalState: WeatherTuningState = {
        ...baseState,
        overrides: { rainIntensity: 0.75, snowIntensity: 0.6 },
      };

      // Export then import
      const exported = exportToolUIConfig(originalState);
      const imported = importToolUIConfig(exported);

      expect(imported).toEqual(originalState.overrides);
    });
  });

  /**
   * TEST-PLAYGROUND-11: Workflow State
   */
  describe("workflow state", () => {
    it("should track parameter changes", () => {
      const state: WeatherTuningState = {
        ...baseState,
        parameters: {},
        overrides: {},
      };

      // Simulate parameter changes
      state.overrides["rainIntensity"] = 0.8;
      expect(hasAnyTuningDelta(state)).toBe(true);

      state.overrides["snowIntensity"] = 0.5;
      expect(listUpdatedParams(state)).toHaveLength(2);
    });

    it("should support state transitions", () => {
      let state: WeatherTuningState = { ...baseState, overrides: {} };

      // Initial state - no changes
      expect(hasAnyTuningDelta(state)).toBe(false);

      // Modified state
      state = { ...state, overrides: { rainIntensity: 0.8 } };
      expect(hasAnyTuningDelta(state)).toBe(true);

      // Reset to default
      state = { ...state, overrides: {} };
      expect(hasAnyTuningDelta(state)).toBe(false);
    });

    it("should preserve parameter history in exports", () => {
      const state: WeatherTuningState = {
        ...baseState,
        overrides: {
          rainIntensity: 0.9,
          cloudCoverage: 0.8,
          bloomIntensity: 1.5,
        },
      };

      const exported = exportToolUIConfig(state);
      const parsed = JSON.parse(exported);

      expect(parsed.parameters.rainIntensity).toBe(0.9);
      expect(parsed.parameters.cloudCoverage).toBe(0.8);
      expect(parsed.parameters.bloomIntensity).toBe(1.5);
    });
  });
});
