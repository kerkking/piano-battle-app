import { memo } from "react";

// Show 3 octaves: C3 (48) to B5 (83)
const START_NOTE = 48; // C3
const END_NOTE = 83;   // B5

// Semitone offsets within an octave that are white keys
const WHITE_OFFSETS = [0, 2, 4, 5, 7, 9, 11]; // C D E F G A B
// Black key semitone offsets and their position between white keys
// Each entry: [semitone offset, fraction gap after white key index in octave]
const BLACK_KEYS = [
  { offset: 1,  whiteIndex: 0 }, // C#  between C and D
  { offset: 3,  whiteIndex: 1 }, // D#  between D and E
  { offset: 6,  whiteIndex: 3 }, // F#  between F and G
  { offset: 8,  whiteIndex: 4 }, // G#  between G and A
  { offset: 10, whiteIndex: 5 }, // A#  between A and B
];

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const W = 14;   // white key width px
const WH = 56;  // white key height px
const BW = 9;   // black key width px
const BH = 35;  // black key height px

interface PianoKeyboardProps {
  pressedNotes: Set<number>;
}

export const PianoKeyboard = memo(function PianoKeyboard({ pressedNotes }: PianoKeyboardProps) {
  // Build list of all white keys in range
  const whiteKeys: { note: number; x: number }[] = [];
  let x = 0;
  for (let note = START_NOTE; note <= END_NOTE; note++) {
    const semitone = note % 12;
    if (WHITE_OFFSETS.includes(semitone)) {
      whiteKeys.push({ note, x });
      x += W;
    }
  }
  const totalWidth = x;

  // Build list of all black keys in range
  const blackKeys: { note: number; x: number }[] = [];
  let whiteCount = 0;
  for (let note = START_NOTE; note <= END_NOTE; note++) {
    const semitone = note % 12;
    if (WHITE_OFFSETS.includes(semitone)) {
      const octaveOffset = semitone;
      const bk = BLACK_KEYS.find((b) => b.whiteIndex === WHITE_OFFSETS.indexOf(octaveOffset));
      // Add black key that lives AFTER this white key (to the right)
      const blackNote = note + 1;
      if (blackNote <= END_NOTE) {
        const bs = blackNote % 12;
        if (!WHITE_OFFSETS.includes(bs)) {
          blackKeys.push({
            note: blackNote,
            x: whiteCount * W + W - BW / 2,
          });
        }
      }
      whiteCount++;
    }
  }
  void BLACK_KEYS; // used implicitly above

  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      left: 16,
      zIndex: 20,
      background: "rgba(0,0,0,0.55)",
      backdropFilter: "blur(10px)",
      borderRadius: 10,
      padding: "10px 12px 8px",
      userSelect: "none",
    }}>
      {/* Label */}
      <div style={{
        color: "rgba(255,255,255,0.5)",
        fontSize: 10,
        letterSpacing: 1,
        textTransform: "uppercase",
        marginBottom: 6,
        textAlign: "center",
      }}>
        Piano
      </div>

      {/* Keys */}
      <div style={{ position: "relative", width: totalWidth, height: WH }}>
        {/* White keys */}
        {whiteKeys.map(({ note, x }) => {
          const isPressed = pressedNotes.has(note);
          const noteName = NOTE_NAMES[note % 12]!;
          const isC = noteName === "C";
          return (
            <div
              key={note}
              title={`${noteName}${Math.floor(note / 12) - 1}`}
              style={{
                position: "absolute",
                left: x,
                top: 0,
                width: W - 1,
                height: WH,
                background: isPressed
                  ? "linear-gradient(180deg, #a78bfa 0%, #7c3aed 100%)"
                  : "linear-gradient(180deg, #f8f8f8 0%, #e0e0e0 100%)",
                borderRadius: "0 0 4px 4px",
                border: "1px solid #999",
                boxSizing: "border-box",
                transition: "background 0.05s ease",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: 3,
                boxShadow: isPressed
                  ? "inset 0 -2px 4px rgba(124,58,237,0.5)"
                  : "inset 0 -2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {/* Only label C notes to mark octaves */}
              {isC && (
                <span style={{
                  fontSize: 7,
                  color: isPressed ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.35)",
                  fontWeight: 600,
                  lineHeight: 1,
                }}>
                  {`C${Math.floor(note / 12) - 1}`}
                </span>
              )}
            </div>
          );
        })}

        {/* Black keys — rendered on top */}
        {blackKeys.map(({ note, x }) => {
          const isPressed = pressedNotes.has(note);
          return (
            <div
              key={note}
              title={`${NOTE_NAMES[note % 12]}${Math.floor(note / 12) - 1}`}
              style={{
                position: "absolute",
                left: x,
                top: 0,
                width: BW,
                height: BH,
                background: isPressed
                  ? "linear-gradient(180deg, #7c3aed 0%, #4c1d95 100%)"
                  : "linear-gradient(180deg, #222 0%, #111 100%)",
                borderRadius: "0 0 3px 3px",
                border: "1px solid #000",
                boxSizing: "border-box",
                zIndex: 2,
                transition: "background 0.05s ease",
                boxShadow: isPressed
                  ? "0 0 6px rgba(124,58,237,0.8)"
                  : "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
});
