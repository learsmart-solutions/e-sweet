import React from "react";
import containerImg from "../assets/layers/container.png";
import awningImg from "../assets/layers/awning.png";
import neonImg from "../assets/layers/neon.png";

const buildingsLeft = [
  { left: -10, width: 95, height: 250, lit: false },
  { left: 55, width: 88, height: 300, lit: true },
  { left: 125, width: 100, height: 280, lit: false },
];

const buildingsRight = [
  { left: 1215, width: 80, height: 250, lit: true },
  { left: 1275, width: 85, height: 300, lit: false },
  { left: 1355, width: 95, height: 255, lit: true },
];

const bulbs = [
  [255, 300],
  [330, 320],
  [405, 333],
  [480, 342],
  [555, 349],
  [700, 354],
  [845, 345],
  [920, 333],
  [995, 320],
  [1070, 307],
  [1150, 296],
];

const dust = [
  { left: 280, width: 90, height: 40, dx: -46 },
  { left: 360, width: 70, height: 34, dx: -28 },
  { left: 450, width: 110, height: 46, dx: 22 },
  { left: 560, width: 84, height: 38, dx: -34 },
  { left: 660, width: 120, height: 50, dx: 18 },
  { left: 780, width: 96, height: 42, dx: 38 },
  { left: 890, width: 110, height: 46, dx: -20 },
  { left: 1000, width: 80, height: 36, dx: 32 },
  { left: 1100, width: 70, height: 32, dx: 44 },
];

const PlantTall = ({ style }) => (
  <div className="es-prop es-plant" style={style}>
    {[
      [-58, 68],
      [-34, 92],
      [-10, 104],
      [14, 98],
      [38, 84],
      [60, 66],
    ].map(([rotate, height]) => (
      <span
        key={rotate}
        className="es-leaf"
        style={{ "--r": `${rotate}deg`, "--h": `${height}px` }}
      />
    ))}
    <span className="es-pot" />
  </div>
);

const PlantRound = ({ style }) => (
  <div className="es-prop es-plant" style={style}>
    <span
      className="es-bush"
      style={{ width: 62, height: 62, bottom: 56, marginLeft: -24 }}
    />
    <span
      className="es-bush"
      style={{ width: 50, height: 50, bottom: 70, marginLeft: 16 }}
    />
    <span
      className="es-bush"
      style={{ width: 54, height: 54, bottom: 44, marginLeft: 2 }}
    />
    <span className="es-pot" style={{ width: 52, height: 48 }} />
  </div>
);

const Stool = ({ style }) => (
  <div className="es-prop es-stool" style={style}>
    <span className="es-seat" />
    <span className="es-leg left" />
    <span className="es-leg right" />
    <span className="es-stretcher" />
  </div>
);

const MenuBoard = ({ style }) => (
  <div className="es-prop es-menu" style={style}>
    <div className="es-menu-board">
      <p className="es-menu-title">TODAY</p>
      {[
        ["Jollof", "3.5k"],
        ["Suya", "2.5k"],
        ["Zobo", "800"],
      ].map(([item, price]) => (
        <div key={item} className="es-menu-row">
          <span>{item}</span>
          <span>{price}</span>
        </div>
      ))}
    </div>
    <div className="es-menu-stand" />
  </div>
);

const KitchenScene = () => {
  return (
    <>
      {/* BACKDROP */}
      <div className="es-backdrop">
        <div className="es-sky" />
        <div className="es-stars" />
        <div className="es-horizon" />

        {[...buildingsLeft, ...buildingsRight].map((building, index) => (
          <div
            key={index}
            className={`es-building${building.lit ? " is-lit" : ""}`}
            style={{
              left: building.left,
              width: building.width,
              height: building.height,
            }}
          />
        ))}

        <div className="es-ground" />
        <div className="es-road" aria-hidden="true">
          <span className="es-curb" />
          <span className="es-road-line" />
        </div>
      </div>

      <div className="es-container-shadow" />

      {/* CONTAINER + ATTACHED PIECES */}
      <div className="es-container-group">
        <div className="es-cable" />
        <div className="es-hook" />

        <img
          src={containerImg}
          alt=""
          className="es-container"
          draggable="false"
        />

        <div className="es-awning-patch" />
        <img src={awningImg} alt="" className="es-awning" draggable="false" />

        <div className="es-neon-cover" />
        <img src={neonImg} alt="" className="es-neon" draggable="false" />
        <div className="es-neon-glow" />

        <div className="es-lamp-glow" style={{ left: 310, top: 230 }} />
        <div className="es-lamp-glow" style={{ left: 780, top: 230 }} />

        {bulbs.map(([x, y], index) => (
          <span
            key={`${x}-${y}`}
            className="es-bulb-glow"
            style={{
              left: x - 29,
              top: y - 29,
              animationDelay: `${1.95 + index * 0.045}s`,
            }}
          />
        ))}

        <div className="es-band" />
        <div className="es-plaque">E&apos;SWEET&apos;S KITCHEN</div>
      </div>

      {/* PROPS */}
      <PlantTall
        style={{
          left: 106,
          top: 544,
          width: 104,
          height: 156,
          "--delay": "2.42s",
        }}
      />

      <PlantRound
        style={{
          left: 1244,
          top: 558,
          width: 88,
          height: 142,
          "--delay": "2.56s",
        }}
      />

      <Stool
        style={{
          left: 532,
          top: 638,
          width: 64,
          height: 62,
          "--delay": "2.26s",
        }}
      />

      <Stool
        style={{
          left: 840,
          top: 638,
          width: 64,
          height: 62,
          "--delay": "2.34s",
        }}
      />

      <MenuBoard
        style={{
          left: 1288,
          top: 548,
          width: 132,
          "--delay": "2.48s",
        }}
      />

      {/* DUST */}
      {dust.map((puff, index) => (
        <span
          key={index}
          className="es-dust"
          style={{
            left: puff.left,
            width: puff.width,
            height: puff.height,
            "--dx": `${puff.dx}px`,
          }}
        />
      ))}
    </>
  );
};

export default KitchenScene;
