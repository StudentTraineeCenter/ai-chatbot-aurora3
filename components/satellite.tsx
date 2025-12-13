"use client";

import cx from "classnames";
import { format } from "date-fns";

type SatellitePosition = {
  satlatitude: number;
  satlongitude: number;
  sataltitude: number;
  azimuth: number;
  elevation: number;
  ra: number;
  dec: number;
  timestamp: number;
  eclipsed: boolean;
};

type SatelliteData = {
  info: {
    satname: string;
    satid: number;
    transactionscount: number;
  };
  positions: SatellitePosition[];
  observerLocation?: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
};

const SatelliteIcon = ({ size = 32 }: { size?: number }) => (
  <svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
    <path
      d="M12 2L15 8L21 9L16 14L17.5 20L12 17L6.5 20L8 14L3 9L9 8L12 2Z"
      fill="currentColor"
    />
  </svg>
);

export function Satellite({ satelliteData }: { satelliteData: SatelliteData }) {
  const currentPosition = satelliteData.positions[0];
  const isVisible = currentPosition.elevation > 0;

  return (
    <div
      className={cx(
        "relative flex w-full flex-col gap-6 overflow-hidden rounded-3xl p-6 shadow-lg backdrop-blur-sm",
        "bg-gradient-to-br from-slate-800 via-slate-900 to-black"
      )}
    >
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-blue-400">
              <SatelliteIcon size={24} />
            </div>
            <div>
              <div className="font-semibold text-lg text-white">
                {satelliteData.info.satname}
              </div>
              <div className="text-white/60 text-xs">
                NORAD ID: {satelliteData.info.satid}
              </div>
            </div>
          </div>
          <div
            className={cx(
              "rounded-full px-3 py-1 font-medium text-xs",
              isVisible
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            )}
          >
            {isVisible ? "Visible" : "Below Horizon"}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="mb-1 text-white/60 text-xs">Altitude</div>
            <div className="font-semibold text-white text-xl">
              {currentPosition.sataltitude.toFixed(0)} km
            </div>
          </div>

          <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="mb-1 text-white/60 text-xs">Elevation</div>
            <div className="font-semibold text-white text-xl">
              {currentPosition.elevation.toFixed(1)}°
            </div>
          </div>

          <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="mb-1 text-white/60 text-xs">Azimuth</div>
            <div className="font-semibold text-white text-xl">
              {currentPosition.azimuth.toFixed(1)}°
            </div>
          </div>

          <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="mb-1 text-white/60 text-xs">Status</div>
            <div className="font-semibold text-white text-xl">
              {currentPosition.eclipsed ? "🌑 Eclipse" : "☀️ Sunlit"}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
          <div className="mb-3 font-medium text-sm text-white/80">
            Current Position
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Latitude:</span>
              <span className="font-mono text-white">
                {currentPosition.satlatitude.toFixed(4)}°
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Longitude:</span>
              <span className="font-mono text-white">
                {currentPosition.satlongitude.toFixed(4)}°
              </span>
            </div>
            {satelliteData.observerLocation && (
              <>
                <div className="my-2 border-white/10 border-t" />
                <div className="text-white/60 text-xs">Observer Location</div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Latitude:</span>
                  <span className="font-mono text-white">
                    {satelliteData.observerLocation.latitude.toFixed(4)}°
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Longitude:</span>
                  <span className="font-mono text-white">
                    {satelliteData.observerLocation.longitude.toFixed(4)}°
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-between text-white/60 text-xs">
          <div>
            Updated:{" "}
            {format(
              new Date(currentPosition.timestamp * 1000),
              "MMM d, h:mm:ss a"
            )}
          </div>
          <div>{satelliteData.positions.length} positions tracked</div>
        </div>
      </div>
    </div>
  );
}
