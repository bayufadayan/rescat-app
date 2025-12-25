import React from "react";

type Props = {
    normalCount?: number;
    abnormalCount?: number;
    totalCount?: number;
    label?: string;
    avgConfidence?: number;
    size?: number;
    outerWidth?: number;
    innerWidth?: number;
};

const ScoreGauge: React.FC<Props> = ({
    normalCount = 0,
    abnormalCount = 0,
    totalCount = 0,
    label = "Sehat",
    avgConfidence = 0,
    size = 240,
    outerWidth = 14,
    innerWidth = 14,
}) => {
    const pct = totalCount > 0 ? Math.round((normalCount / totalCount) * 100) : 0;
    const edgeFeatherPct = 0;
    const tailPct = 100;
    const oversample = 2;
    const featherPx = 0.75;

    const wrapW = size;
    const wrapH = size;

    const paintBox = Math.round((size - 20) * oversample);
    const outerSize = paintBox;
    const innerSize = Math.round(outerSize - 2 * outerWidth * oversample);

    const ringMask = (w: number) =>
        `radial-gradient(farthest-side, transparent calc(100% - ${w * oversample + featherPx}px), #000 calc(100% - ${w * oversample}px))`;

    const outerBg = `conic-gradient(
        from -90deg,
        #0091F3 0% calc(${pct - edgeFeatherPct}%),
        rgba(0,145,243,0.85) ${pct}%,
        transparent calc(${pct + edgeFeatherPct}%),
        transparent 100%
    )`;

    const innerBg = `conic-gradient(
        from -90deg,
        rgba(105,194,254,0) 0% calc(${Math.max(0, pct - tailPct)}%),
        rgba(105,194,254,0.6) calc(${Math.max(0, pct - edgeFeatherPct)}%),
        #69C2FE ${pct}%,
        rgba(105,194,254,0.6) calc(${pct + edgeFeatherPct}%),
        transparent calc(${pct + edgeFeatherPct + 0.4}%),
        transparent 100%
    )`;

    return (
        <div
            className="bg-white rounded-full inline-grid place-items-center shadow-sm"
            style={{ width: wrapW, height: wrapH, position: "relative" }}
        >
            <div
                className="absolute inset-0 grid place-items-center"
                style={{ transform: `scale(${1 / oversample})`, transformOrigin: "center", willChange: "transform" }}
            >
                <div
                    className="absolute rounded-full rotate-[90deg]"
                    style={{
                        width: outerSize,
                        height: outerSize,
                        background: outerBg,
                        WebkitMaskImage: ringMask(outerWidth),
                        maskImage: ringMask(outerWidth),
                    }}
                />
                <div
                    className="absolute rounded-full rotate-[90deg]"
                    style={{
                        width: innerSize,
                        height: innerSize,
                        background: innerBg,
                        WebkitMaskImage: ringMask(innerWidth),
                        maskImage: ringMask(innerWidth),
                    }}
                />
            </div>

            <div className="absolute inset-0 grid place-items-center text-center select-none">
                <div className="leading-tight">
                    <div
                        className="font-extrabold"
                        style={{ fontSize: Math.round(size * 0.2), color: "#0f172a", lineHeight: 1 }}
                    >
                        {pct}%
                    </div>
                    <div
                        className="mt-2 font-semibold"
                        style={{ fontSize: Math.round(size * 0.075), color: "#0f172aB3" }}
                    >
                        Area Normal
                    </div>
                    <div
                        className="mt-1.5 font-normal"
                        style={{ fontSize: Math.round(size * 0.055), color: "#94a3b8" }}
                    >
                        Keyakinan: {(avgConfidence / 100).toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreGauge;
