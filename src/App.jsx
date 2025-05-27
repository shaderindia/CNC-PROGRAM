import React, { useState } from "react";

function deg2rad(deg) {
  return (deg * Math.PI) / 180;
}

function getHoleCoordinates(pcd, holes, startAngle, centerX = 0, centerY = 0) {
  const coords = [];
  for (let i = 0; i < holes; i++) {
    const angle = deg2rad(startAngle + (360 / holes) * i);
    const x = centerX + (pcd / 2) * Math.cos(angle);
    const y = centerY + (pcd / 2) * Math.sin(angle);
    coords.push({ x, y });
  }
  return coords;
}

function generateCNCProgram(holes, startAngle, pcd) {
  return (
    `; CNC Loop Program for PCD Drilling\n` +
    `; Number of Holes: ${holes}\n` +
    `; Starting Angle: ${startAngle}°\n` +
    `; PCD: ${pcd}\n` +
    `#1=${holes}    (Number of Holes)\n` +
    `#2=${startAngle}    (Start Angle)\n` +
    `#3=${pcd}    (PCD)\n` +
    `#4=360/#1    (Angle Increment)\n` +
    `#5=0         (Loop Counter)\n` +
    `WHILE [#5 LT #1] DO1\n` +
    `    #6 = [#2 + #5*#4]   (Current Angle)\n` +
    `    #7 = COS[#6] * #3/2 (X Offset)\n` +
    `    #8 = SIN[#6] * #3/2 (Y Offset)\n` +
    `    G81 X[#7] Y[#8] ... (Drill Cycle)\n` +
    `    #5 = #5 + 1\n` +
    `END1\n`
  );
}

function App() {
  const [pcd, setPCD] = useState(100);
  const [holes, setHoles] = useState(6);
  const [startAngle, setStartAngle] = useState(0);
  const [showProgram, setShowProgram] = useState(false);

  const coords = getHoleCoordinates(pcd, holes, startAngle, 0, 0);

  // SVG drawing constants
  const svgSize = 300;
  const center = svgSize / 2;
  const scale = (svgSize * 0.4) / (pcd / 2);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "auto" }}>
      <h1>PCD Hole Coordinate Finder</h1>
      <label>
        Pitch Circle Diameter (PCD):{" "}
        <input
          type="number"
          value={pcd}
          min="1"
          onChange={e => setPCD(parseFloat(e.target.value))}
        /> mm
      </label>
      <br />
      <label>
        Number of Holes:{" "}
        <input
          type="number"
          value={holes}
          min="1"
          onChange={e => setHoles(parseInt(e.target.value, 10))}
        />
      </label>
      <br />
      <label>
        Starting Angle (deg):{" "}
        <input
          type="number"
          value={startAngle}
          min="0"
          max="360"
          onChange={e => setStartAngle(parseFloat(e.target.value))}
        />
      </label>
      <br />
      <button onClick={() => setShowProgram(!showProgram)}>
        {showProgram ? "Hide" : "Show"} CNC Parameter Program
      </button>
      <h2>Hole Coordinates</h2>
      <table border="1" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Hole</th>
            <th>X (mm)</th>
            <th>Y (mm)</th>
            <th>Angle (°)</th>
          </tr>
        </thead>
        <tbody>
          {coords.map(({ x, y }, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{x.toFixed(3)}</td>
              <td>{y.toFixed(3)}</td>
              <td>
                {(
                  (startAngle + (360 / holes) * i + 360) %
                  360
                ).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>2D Preview</h2>
      <svg width={svgSize} height={svgSize} style={{ border: "1px solid #ccc" }}>
        {/* Draw PCD Circle */}
        <circle
          cx={center}
          cy={center}
          r={pcd / 2 * scale}
          fill="none"
          stroke="#888"
        />
        {/* Draw Holes */}
        {coords.map(({ x, y }, i) => (
          <circle
            key={i}
            cx={center + x * scale}
            cy={center - y * scale}
            r={7}
            fill="#1976d2"
          >
            <title>
              Hole {i + 1}: ({x.toFixed(2)}, {y.toFixed(2)})
            </title>
          </circle>
        ))}
        {/* Draw center point */}
        <circle cx={center} cy={center} r={3} fill="#e53935" />
      </svg>

      {showProgram && (
        <>
          <h2>CNC Parameter Program (example, Fanuc style)</h2>
          <pre style={{ background: "#eee", padding: "1em" }}>
            {generateCNCProgram(holes, startAngle, pcd)}
          </pre>
        </>
      )}
    </div>
  );
}

export default App;
