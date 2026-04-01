import { useEffect, useRef, useState, useCallback } from "react";

interface UseMidiResult {
  isConnected: boolean;
  deviceName: string | null;
  error: string | null;
}

export function useMidi(
  onNoteOn: (note: number, velocity: number) => void
): UseMidiResult {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const onNoteOnRef = useRef(onNoteOn);
  onNoteOnRef.current = onNoteOn;

  const handleMidiMessage = useCallback((event: WebMidi.MIDIMessageEvent) => {
    const [status, note, velocity] = event.data!;
    // Note-on: status 0x90-0x9F with velocity > 0
    if ((status! & 0xf0) === 0x90 && velocity! > 0) {
      onNoteOnRef.current(note!, velocity!);
    }
  }, []);

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setError(
        "Web MIDI API not supported. Please use Chrome or Edge."
      );
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
      }
    };

    navigator.requestMIDIAccess({ sysex: false }).then(
      (access) => {
        midiAccess = access;
        attachInputs(access);

        access.onstatechange = () => {
          attachInputs(access);
        };
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

  return { isConnected, deviceName, error };
}
