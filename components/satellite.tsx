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

type VisibleSatellite = {
  satid: number;
  satname: string;
  intDesignator: string;
  launchDate: string;
};

type SatellitePositionData = {
  type: "satellite-positions";
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

type VisibleSatellitesData = {
  type: "visible-satellites";
  count: number;
  satellites: VisibleSatellite[];
  observerLocation?: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
};

type SatelliteData = SatellitePositionData | VisibleSatellitesData;

const SatelliteIcon = ({ size = 32 }: { size?: number }) => (
  <svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
    <path
      d="M12 2L15 8L21 9L16 14L17.5 20L12 17L6.5 20L8 14L3 9L9 8L12 2Z"
      fill="currentColor"
    />
  </svg>
);

function VisibleSatellitesList({ data }: { data: VisibleSatellitesData }) {
  return (
    <div
      className={cx(
        "relative flex w-full flex-col gap-6 overflow-hidden rounded-3xl p-6 shadow-2xl",
        "border border-white/10 bg-black/60 backdrop-blur-md"
      )}
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-slate-950/90 to-black/80 backdrop-blur-sm" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              <SatelliteIcon size={24} />
            </div>
            <div>
              <div className="font-semibold text-lg text-white drop-shadow-lg">
                Visible Satellites
              </div>
              <div className="text-cyan-200/80 text-xs">
                {data.count} satellites currently visible
              </div>
            </div>
          </div>
        </div>

        {data.observerLocation && (
          <div className="mb-4 rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-4 shadow-lg backdrop-blur-md">
            <div className="mb-2 font-medium text-cyan-300 text-sm">
              Observer Location
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Latitude:</span>
                <span className="font-mono text-cyan-200">
                  {data.observerLocation.latitude.toFixed(4)}°
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Longitude:</span>
                <span className="font-mono text-cyan-200">
                  {data.observerLocation.longitude.toFixed(4)}°
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {data.satellites.slice(0, 10).map((sat) => (
            <div
              className="rounded-xl border border-slate-700/50 bg-slate-950/70 p-3 shadow-md backdrop-blur-md transition-colors hover:border-cyan-500/50"
              key={sat.satid}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm text-white">
                    {sat.satname}
                  </div>
                  <div className="text-slate-400 text-xs">
                    NORAD ID: {sat.satid}
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-slate-400">Launched</div>
                  <div className="text-cyan-200">{sat.launchDate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.satellites.length > 10 && (
          <div className="mt-4 text-center text-slate-400 text-xs">
            + {data.satellites.length - 10} more satellites
          </div>
        )}
      </div>
    </div>
  );
}

function SatellitePositions({ data }: { data: SatellitePositionData }) {
  const currentPosition = data.positions[0];
  const isVisible = currentPosition.elevation > 0;

  return (
    <div
      className={cx(
        "relative flex w-full flex-col gap-6 overflow-hidden rounded-3xl p-6 shadow-2xl",
        "border border-white/10 bg-black/60 backdrop-blur-md"
      )}
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-slate-950/90 to-black/80 backdrop-blur-sm" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              <SatelliteIcon size={24} />
            </div>
            <div>
              <div className="font-semibold text-lg text-white drop-shadow-lg">
                {data.info.satname}
              </div>
              <div className="text-cyan-200/80 text-xs">
                NORAD ID: {data.info.satid}
              </div>
            </div>
          </div>
          <div
            className={cx(
              "rounded-full px-3 py-1 font-medium text-xs shadow-lg",
              isVisible
                ? "border border-emerald-400/50 bg-emerald-500/30 text-emerald-300"
                : "border border-rose-400/50 bg-rose-500/30 text-rose-300"
            )}
          >
            {isVisible ? "Visible" : "Below Horizon"}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-cyan-500/20 bg-slate-950/70 p-4 shadow-lg backdrop-blur-md">
            <div className="mb-1 text-slate-400 text-xs">Altitude</div>
            <div className="font-semibold text-white text-xl drop-shadow-md">
              {currentPosition.sataltitude.toFixed(0)} km
            </div>
          </div>

          <div className="rounded-xl border border-cyan-500/20 bg-slate-950/70 p-4 shadow-lg backdrop-blur-md">
            <div className="mb-1 text-slate-400 text-xs">Elevation</div>
            <div className="font-semibold text-white text-xl drop-shadow-md">
              {currentPosition.elevation.toFixed(1)}°
            </div>
          </div>

          <div className="rounded-xl border border-cyan-500/20 bg-slate-950/70 p-4 shadow-lg backdrop-blur-md">
            <div className="mb-1 text-slate-400 text-xs">Azimuth</div>
            <div className="font-semibold text-white text-xl drop-shadow-md">
              {currentPosition.azimuth.toFixed(1)}°
            </div>
          </div>

          <div className="rounded-xl border border-cyan-500/20 bg-slate-950/70 p-4 shadow-lg backdrop-blur-md">
            <div className="mb-1 text-slate-400 text-xs">Status</div>
            <div className="font-semibold text-white text-xl drop-shadow-md">
              {currentPosition.eclipsed ? "🌑 Eclipse" : "☀️ Sunlit"}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-4 shadow-lg backdrop-blur-md">
          <div className="mb-3 font-medium text-cyan-300 text-sm">
            Current Position
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Latitude:</span>
              <span className="font-mono text-cyan-200">
                {currentPosition.satlatitude.toFixed(4)}°
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Longitude:</span>
              <span className="font-mono text-cyan-200">
                {currentPosition.satlongitude.toFixed(4)}°
              </span>
            </div>
            {data.observerLocation && (
              <>
                <div className="my-2 border-slate-700/50 border-t" />
                <div className="text-slate-400 text-xs">Observer Location</div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Latitude:</span>
                  <span className="font-mono text-cyan-200">
                    {data.observerLocation.latitude.toFixed(4)}°
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Longitude:</span>
                  <span className="font-mono text-cyan-200">
                    {data.observerLocation.longitude.toFixed(4)}°
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-between text-slate-400 text-xs">
          <div>
            Updated:{" "}
            {format(
              new Date(currentPosition.timestamp * 1000),
              "MMM d, h:mm:ss a"
            )}
          </div>
          <div>{data.positions.length} positions tracked</div>
        </div>
      </div>
    </div>
  );
}

export function Satellite({ satelliteData }: { satelliteData: SatelliteData }) {
  if (satelliteData.type === "visible-satellites") {
    return <VisibleSatellitesList data={satelliteData} />;
  }

  return <SatellitePositions data={satelliteData} />;
}
