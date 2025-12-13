import { tool } from "ai";
import { z } from "zod";

const N2YO_API_KEY = "HZE5FN-D27FKL-HEXHMC-5MBR";

export const getSatellite = tool({
  description: "Get the current position of a satellite. You can search by satellite name (e.g., 'ISS', 'SPACE STATION', 'HUBBLE') or by NORAD ID. Requires observer coordinates (latitude/longitude) to calculate position relative to that location.",
  inputSchema: z.object({
    satelliteId: z.number().describe("NORAD satellite ID (e.g., 25544 for ISS)").optional(),
    satelliteName: z.string().describe("Satellite name to search for (e.g., 'ISS', 'SPACE STATION')").optional(),
    observerLat: z.number().min(-90).max(90).describe("Observer latitude in degrees"),
    observerLng: z.number().min(-180).max(180).describe("Observer longitude in degrees"),
    observerAlt: z.number().default(0).describe("Observer altitude in meters above sea level"),
    seconds: z.number().min(1).max(300).default(2).describe("Number of seconds to retrieve positions for (1-300)"),
  }),
  execute: async (input) => {
    let satId: number;

    // If satellite name is provided, search for it first
    if (input.satelliteName && !input.satelliteId) {
      try {
        const searchResponse = await fetch(
          `https://api.n2yo.com/rest/v1/satellite/search/name/${encodeURIComponent(input.satelliteName)}?apiKey=${N2YO_API_KEY}`
        );
        
        if (!searchResponse.ok) {
          return {
            error: `Failed to search for satellite "${input.satelliteName}"`,
          };
        }

        const searchData = await searchResponse.json();
        
        if (!searchData?.member || searchData.member.length === 0) {
          return {
            error: `No satellite found with name "${input.satelliteName}". Try using a NORAD ID instead.`,
          };
        }

        satId = searchData.member[0].satid;
      } catch (error) {
        return {
          error: `Error searching for satellite: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
      }
    } else if (input.satelliteId) {
      satId = input.satelliteId;
    } else {
      return {
        error: "Please provide either a satellite name or NORAD ID.",
      };
    }

    try {
      const response = await fetch(
        `https://api.n2yo.com/rest/v1/satellite/positions/${satId}/${input.observerLat}/${input.observerLng}/${input.observerAlt}/${input.seconds}&apiKey=${N2YO_API_KEY}`
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
        error: `Error fetching satellite data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
});
