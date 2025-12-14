import { tool } from "ai";
import { z } from "zod";

const N2YO_API_KEY = "HZE5FN-D27FKL-HEXHMC-5MBR";

export const getSatellite = tool({
  description:
    "Get visible satellites at a location or track a specific satellite. When no satellite is specified, returns satellites that will be visible soon from the observer's location.",
  inputSchema: z.object({
    satelliteId: z
      .number()
      .describe(
        "NORAD satellite ID (e.g., 25544 for ISS). If not provided, returns visible satellites at the location."
      )
      .optional(),
    observerLat: z
      .number()
      .min(-90)
      .max(90)
      .describe("Observer latitude in degrees"),
    observerLng: z
      .number()
      .min(-180)
      .max(180)
      .describe("Observer longitude in degrees"),
    observerAlt: z
      .number()
      .default(0)
      .describe("Observer altitude in meters above sea level"),
    seconds: z
      .number()
      .min(1)
      .max(300)
      .default(2)
      .describe("Number of seconds to retrieve positions for (1-300)"),
  }),
  execute: async (input) => {
    try {
      // If no satellite ID provided, get visible satellites at location
      if (!input.satelliteId) {
        const response = await fetch(
          `https://api.n2yo.com/rest/v1/satellite/above/${input.observerLat}/${input.observerLng}/${input.observerAlt}/70/0&apiKey=${N2YO_API_KEY}`
        );

        if (!response.ok) {
          return {
            error: `Failed to fetch visible satellites (HTTP ${response.status})`,
          };
        }

        const data = await response.json();

        if (!data.above || data.above.length === 0) {
          return {
            error: "No visible satellites found at this location.",
          };
        }

        return {
          type: "visible-satellites",
          count: data.above.length,
          satellites: data.above.map((sat: any) => ({
            satid: sat.satid,
            satname: sat.satname,
            intDesignator: sat.intDesignator,
            launchDate: sat.launchDate,
          })),
          observerLocation: {
            latitude: input.observerLat,
            longitude: input.observerLng,
            altitude: input.observerAlt,
          },
        };
      }

      // If satellite ID is provided, get its positions
      const response = await fetch(
        `https://api.n2yo.com/rest/v1/satellite/positions/${input.satelliteId}/${input.observerLat}/${input.observerLng}/${input.observerAlt}/${input.seconds}&apiKey=${N2YO_API_KEY}`
      );

      if (!response.ok) {
        return {
          error: `Failed to fetch satellite position data (HTTP ${response.status})`,
        };
      }

      const data = await response.json();

      if (!data.positions || data.positions.length === 0) {
        return {
          error: "No position data available for this satellite.",
        };
      }

      return {
        type: "satellite-positions",
        info: data.info,
        positions: data.positions,
        observerLocation: {
          latitude: input.observerLat,
          longitude: input.observerLng,
          altitude: input.observerAlt,
        },
      };
    } catch (error) {
      return {
        error: `Error fetching satellite data: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});
