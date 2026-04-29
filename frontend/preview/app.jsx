// app.jsx — root: tweaks panel, screen switcher, demo data wiring.

const { GameBoard, Settlement, CARD_BY_ID } = window;

// Defaults block — host can rewrite this on disk.
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "cardAbstraction": "mid",
  "boardLayout": "hybrid",
  "labelMode": "hanja",
  "accentTone": "muted",
  "animationIntensity": "full",
  "showHintBar": true
}/*EDITMODE-END*/;

const PLAYERS = {
  me: { name: "나",   color: "linear-gradient(135deg,#b89456,#d4b884)" },
  p2: { name: "준호", color: "linear-gradient(135deg,#a84235,#c46b5e)" },
  p3: { name: "지우", color: "linear-gradient(135deg,#3a6647,#6b8c75)" },
  p4: { name: "민서", color: "linear-gradient(135deg,#3b4a6b,#6a7a9c)" },
};

// Demo final captured state used by the settlement screen.
// Designed so "나" wins with 홍단 + 청단 dans for showcase.
const FINAL_CAPTURED = {
  me: {
    GWANG: ["1-G", "3-G", "8-G"],          // 삼광
    YEOL:  ["2-Y", "8-Y", "9-Y"],
    TTI:   ["1-T", "2-T", "3-T", "6-T", "9-T", "10-T"],  // 홍단(1,2,3) + 청단(6,9,10)
    PI:    ["1-P2", "11-P2", "11-P3", "5-P1", "5-P2"],
  },
  p2: {
    GWANG: ["12-G"],
    YEOL:  ["7-Y", "10-Y"],
    TTI:   ["7-T", "12-T"],
    PI:    ["4-P1", "4-P2", "7-P1", "7-P2", "12-P"],
  },
  p3: {
    GWANG: ["11-G"],
    YEOL:  [],
    TTI:   ["4-T"],                         // no 단
    PI:    ["3-P1", "3-P2", "6-P1", "6-P2", "8-P1", "8-P2", "10-P1", "10-P2"],
  },
  p4: {
    GWANG: [],
    YEOL:  ["4-Y", "5-Y", "6-Y"],
    TTI:   ["5-T"],
    PI:    ["1-P1", "2-P1", "2-P2", "9-P1", "9-P2", "11-P1", "10-P2".replace("10-P2","")].filter(Boolean),
  },
};

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = React.useState("board");

  // accent tone CSS override
  const accentToneStyle = React.useMemo(() => {
    if (t.accentTone === "muted") return {};
    if (t.accentTone === "vivid") return {
      "--accent-red": "#c8362a",
      "--accent-green": "#2f6c40",
      "--accent-gold": "#d8a04f",
    };
    if (t.accentTone === "single") return {
      "--accent-red": "#7a6650",
      "--accent-green": "#6e6a5e",
      // gold remains as the single accent
    };
    return {};
  }, [t.accentTone]);

  // Apply theme attribute on root
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.theme);
  }, [t.theme]);

  // Animation intensity respects prefers-reduced-motion if user picks 'auto'
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--anim-mult",
      t.animationIntensity === "minimal" ? "0.2" :
      t.animationIntensity === "mid" ? "0.7" : "1"
    );
  }, [t.animationIntensity]);

  return (
    <div style={accentToneStyle}>
      {screen === "board" ? (
        <GameBoard tweaks={t} onScreen={setScreen} screen={screen}/>
      ) : (
        <Settlement
          tweaks={t}
          onScreen={setScreen}
          capturedAll={FINAL_CAPTURED}
          players={PLAYERS}
        />
      )}

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="테마"/>
        <window.TweakRadio label="모드" value={t.theme}
                           options={["light", "dark"]}
                           onChange={v => setTweak("theme", v)}/>
        <window.TweakRadio label="포인트 컬러" value={t.accentTone}
                           options={["muted", "vivid", "single"]}
                           onChange={v => setTweak("accentTone", v)}/>

        <window.TweakSection label="카드"/>
        <window.TweakRadio label="추상화" value={t.cardAbstraction}
                           options={["minimal", "mid", "painterly"]}
                           onChange={v => setTweak("cardAbstraction", v)}/>
        <window.TweakRadio label="라벨" value={t.labelMode}
                           options={["hanja", "hangul", "none"]}
                           onChange={v => setTweak("labelMode", v)}/>

        <window.TweakSection label="보드"/>
        <window.TweakRadio label="레이아웃" value={t.boardLayout}
                           options={["grid", "hybrid", "free"]}
                           onChange={v => setTweak("boardLayout", v)}/>

        <window.TweakSection label="모션"/>
        <window.TweakRadio label="애니메이션" value={t.animationIntensity}
                           options={["minimal", "mid", "full"]}
                           onChange={v => setTweak("animationIntensity", v)}/>

        <window.TweakSection label="화면"/>
        <window.TweakRadio label="현재" value={screen}
                           options={["board", "settlement"]}
                           onChange={v => setScreen(v)}/>
      </window.TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
