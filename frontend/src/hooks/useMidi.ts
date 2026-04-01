import { useEffect, useRef, useState, useCallback } from "react";

interface UseMidiResult {
  isConnected: boolean;
  deviceName: string | null;
  error: string | null;
  pressedNotes: Set<number>;
}

export function useMidi(
  onNoteOn: (note: number, velocity: number) => void
): UseMidiResult {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pressedNotes, setPressedNotes] = useState<Set<number>>(new Set());
  const onNoteOnRef = useRef(onNoteOn);
  onNoteOnRef.current = onNoteOn;

  const handleMidiMessage = useCallback((event: WebMidi.MIDIMessageEvent) => {
    const [status, note, velocity] = event.data!;
    const statusType = status! & 0xf0;

    // Note-on: 0x90 with velocity > 0
    if (statusType === 0x90 && velocity! > 0) {
      setPressedNotes((prev) => new Set(prev).add(note!));
      onNoteOnRef.current(note!, velocity!);
    }

    // Note-off: 0x80 OR 0x90 with velocity 0
    if (statusType === 0x80 || (statusType === 0x90 && velocity === 0)) {
      setPressedNotes((prev) => {
        const next = new Set(prev);
        next.delete(note!);
        return next;
      });
    }
  }, []);

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setError("Web MIDI API not supported. Please use Chrome or Edge.");
      return;
    }

    let midiAccess: WebMidi.MIDIAccess | null = null;

    const attachInputs = (access: WebMidi.MIDIAccess) => {
      let found = false;
      access.inputs.forEach((input) => {
        input.onmidimessage = handleMidiMessage;
        if (!found) {
          setDeviceName(input.name ?? "MIDI Device");
          setIsConnected(true);
          found = true;
        }
      });
      if (!found) {
        setIsConnected(false);
        setDeviceName(null);
        setPressedNotes(new Set());
      }
    };

    navigator.requestMIDIAccess({ sysex: false }).then(
      (access) => {
        midiAccess = access;
        attachInputs(access);
        access.onstatechange = () => attachInputs(access);
      },
      (err) => {
        setError(`MIDI access denied: ${err.message}`);
      }
    );

    return () => {
      if (midiAccess) {
        midiAccess.inputs.forEach((input) => {
          input.onmidimessage = null;
        });
      }
    };
  }, [handleMidiMessage]);

  return { isConnected, deviceName, error, pressedNotes };
}
