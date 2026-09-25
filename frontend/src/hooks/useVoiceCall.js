import { useState, useRef, useEffect, useCallback } from 'react';

export function useVoiceCall() {
  const [callState, setCallState] = useState('idle'); // 'idle' | 'connected' | 'ended'
  const [agentStatus, setAgentStatus] = useState('idle'); // 'idle' | 'listening' | 'transcribing' | 'thinking' | 'speaking'
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const [lastMetrics, setLastMetrics] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('en-US-AriaNeural');
  const [systemStatus, setSystemStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const sessionIdRef = useRef(`session_${Date.now()}`);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const continuousModeRef = useRef(continuousMode);
  continuousModeRef.current = continuousMode;

  // Fetch backend status
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/call/status');
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data);
      }
    } catch (err) {
      console.warn('Backend not yet reachable:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Call duration timer
  useEffect(() => {
    if (callState === 'connected') {
      setCallDuration(0);
      timerIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [callState]);

  // Play audio helper
  const playAgentAudio = useCallback((audioUrl) => {
    if (!audioUrl) return;
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    const audio = new Audio(audioUrl);
    audioPlayerRef.current = audio;
    setAgentStatus('speaking');

    audio.onended = () => {
      setAgentStatus('idle');
      // If continuous mode is enabled and call is still active, automatically start listening
      if (continuousModeRef.current && callState === 'connected') {
        setTimeout(() => {
          startRecording();
        }, 500);
      }
    };

    audio.onerror = (e) => {
      console.error('Audio playback error:', e);
      setAgentStatus('idle');
    };

    audio.play().catch((err) => {
      console.warn('Auto-play blocked or failed:', err);
      setAgentStatus('idle');
    });
  }, [callState]);

  // Start Call
  const startCall = async () => {
    sessionIdRef.current = `session_${Date.now()}`;
    setErrorMessage(null);
    setTranscript([]);
    setLastMetrics(null);
    setCallState('connected');
    setAgentStatus('idle');

    // Automatically send an initial greeting from the agent
    sendInitialGreeting();
  };

  const sendInitialGreeting = async () => {
    try {
      setAgentStatus('thinking');
      const res = await fetch('/api/call/text-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Hello',
          session_id: sessionIdRef.current,
          voice: selectedVoice,
        }),
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();

      setTranscript([
        {
          id: `msg_${Date.now()}`,
          sender: 'agent',
          text: data.agent_reply,
          audioUrl: data.audio_url,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setLastMetrics(data.metrics);
      playAgentAudio(data.audio_url);
    } catch (err) {
      console.error('Greeting error:', err);
      setAgentStatus('idle');
      setErrorMessage(`Could not connect: ${err.message}`);
    }
  };

  // End Call
  const endCall = () => {
    stopRecording();
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setCallState('ended');
    setAgentStatus('idle');
    setIsRecording(false);
  };

  // Start Recording microphone
  const startRecording = async () => {
    if (isRecording) return;
    try {
      setErrorMessage(null);
      // Stop current playback if speaking
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : '';
      }

      const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        if (audioBlob.size > 0) {
          await processVoiceTurn(audioBlob);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAgentStatus('listening');
    } catch (err) {
      console.error('Microphone access failed:', err);
      setErrorMessage(
        'Microphone access denied or not found. You can still test Voxora using the text input below!'
      );
      setAgentStatus('idle');
      setIsRecording(false);
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Process voice turn with backend
  const processVoiceTurn = async (audioBlob) => {
    try {
      setAgentStatus('transcribing');
      const formData = new FormData();
      formData.append('audio', audioBlob, 'caller_audio.webm');
      formData.append('session_id', sessionIdRef.current);
      formData.append('voice', selectedVoice);

      const res = await fetch('/api/call/voice-turn', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Server error' }));
        throw new Error(errorData.detail || `Server status ${res.status}`);
      }

      const data = await res.json();
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setTranscript((prev) => [
        ...prev,
        {
          id: `user_${Date.now()}`,
          sender: 'user',
          text: data.user_text,
          timestamp: timeStr,
        },
        {
          id: `agent_${Date.now()}`,
          sender: 'agent',
          text: data.agent_reply,
          audioUrl: data.audio_url,
          timestamp: timeStr,
        },
      ]);

      setLastMetrics(data.metrics);
      playAgentAudio(data.audio_url);
    } catch (err) {
      console.error('Voice turn error:', err);
      setErrorMessage(`Voice processing error: ${err.message}`);
      setAgentStatus('idle');
    }
  };

  // Send a text turn (for testing or browser speech recognition)
  const sendTextTurn = async (text) => {
    if (!text || !text.trim()) return;
    try {
      setErrorMessage(null);
      setAgentStatus('thinking');

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // Optimistically append user message
      setTranscript((prev) => [
        ...prev,
        {
          id: `user_${Date.now()}`,
          sender: 'user',
          text: text.trim(),
          timestamp: timeStr,
        },
      ]);

      const res = await fetch('/api/call/text-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          session_id: sessionIdRef.current,
          voice: selectedVoice,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Server error' }));
        throw new Error(errorData.detail || `Server status ${res.status}`);
      }

      const data = await res.json();

      setTranscript((prev) => [
        ...prev,
        {
          id: `agent_${Date.now()}`,
          sender: 'agent',
          text: data.agent_reply,
          audioUrl: data.audio_url,
          timestamp: timeStr,
        },
      ]);

      setLastMetrics(data.metrics);
      playAgentAudio(data.audio_url);
    } catch (err) {
      console.error('Text turn error:', err);
      setErrorMessage(`Turn error: ${err.message}`);
      setAgentStatus('idle');
    }
  };

  return {
    callState,
    agentStatus,
    callDuration,
    transcript,
    lastMetrics,
    isRecording,
    continuousMode,
    selectedVoice,
    systemStatus,
    errorMessage,
    setContinuousMode,
    setSelectedVoice,
    startCall,
    endCall,
    startRecording,
    stopRecording,
    sendTextTurn,
    playAgentAudio,
    fetchStatus,
  };
}
