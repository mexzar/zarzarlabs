// pitch.js - Real-time pitch detection and visualization

const PitchDetector = (() => {
  const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // Map frequency to note name + octave
  function frequencyToNote(freq) {
    if (freq <= 0) return null;
    const noteNum = 12 * (Math.log2(freq / 440)) + 69;
    const rounded = Math.round(noteNum);
    const name = NOTE_NAMES[rounded % 12];
    const octave = Math.floor(rounded / 12) - 1;
    const centsOff = Math.round((noteNum - rounded) * 100);
    return { name, octave, full: `${name}${octave}`, cents: centsOff, midi: rounded };
  }

  // Autocorrelation-based pitch detection (YIN-inspired)
  function detectPitch(buffer, sampleRate) {
    const SIZE = buffer.length;
    const threshold = 0.15;

    // Check if signal has enough energy
    let rms = 0;
    for (let i = 0; i < SIZE; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1; // Too quiet

    // Autocorrelation
    const correlations = new Float32Array(SIZE);
    for (let lag = 0; lag < SIZE; lag++) {
      let sum = 0;
      for (let i = 0; i < SIZE - lag; i++) {
        sum += buffer[i] * buffer[i + lag];
      }
      correlations[lag] = sum;
    }

    // Find the first dip then the next peak
    let foundDip = false;
    let bestLag = -1;
    let bestCorr = 0;

    for (let lag = Math.floor(sampleRate / 1000); lag < Math.floor(sampleRate / 60); lag++) {
      const normalized = correlations[lag] / correlations[0];
      if (!foundDip && normalized < threshold) {
        foundDip = true;
      }
      if (foundDip && normalized > bestCorr) {
        bestCorr = normalized;
        bestLag = lag;
      }
      if (foundDip && normalized < bestCorr * 0.8) {
        break; // Past the peak
      }
    }

    if (bestLag === -1 || bestCorr < 0.3) return -1;
    return sampleRate / bestLag;
  }

  // Creates a pitch monitor instance bound to a canvas and note display
  function createMonitor(canvasId, noteDisplayId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const noteEl = document.getElementById(noteDisplayId);

    let audioContext = null;
    let analyser = null;
    let source = null;
    let animationId = null;
    let pitchHistory = [];
    const MAX_HISTORY = 150;

    // Note frequency guides for the canvas (C3 to C6)
    const guideNotes = [
      { name: 'C3', freq: 130.81 },
      { name: 'E3', freq: 164.81 },
      { name: 'G3', freq: 196.00 },
      { name: 'C4', freq: 261.63 },
      { name: 'E4', freq: 329.63 },
      { name: 'G4', freq: 392.00 },
      { name: 'C5', freq: 523.25 },
      { name: 'E5', freq: 659.25 },
      { name: 'C6', freq: 1046.50 },
    ];

    const MIN_FREQ = 80;
    const MAX_FREQ = 1100;

    function freqToY(freq) {
      if (freq <= 0) return canvas.height;
      const logMin = Math.log2(MIN_FREQ);
      const logMax = Math.log2(MAX_FREQ);
      const logFreq = Math.log2(freq);
      const ratio = (logFreq - logMin) / (logMax - logMin);
      return canvas.height - ratio * canvas.height;
    }

    function drawGrid() {
      ctx.strokeStyle = 'rgba(100, 100, 140, 0.2)';
      ctx.fillStyle = 'rgba(160, 160, 176, 0.4)';
      ctx.font = '10px monospace';
      ctx.lineWidth = 1;

      for (const note of guideNotes) {
        const y = freqToY(note.freq);
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillText(note.name, 4, y - 3);
      }
    }

    function drawPitch() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();

      if (pitchHistory.length < 2) return;

      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      const step = canvas.width / MAX_HISTORY;

      ctx.beginPath();
      let started = false;

      for (let i = 0; i < pitchHistory.length; i++) {
        const freq = pitchHistory[i];
        if (freq <= 0) {
          started = false;
          continue;
        }
        const x = i * step;
        const y = freqToY(freq);

        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Gradient stroke
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, 'rgba(233, 69, 96, 0.3)');
      gradient.addColorStop(0.7, 'rgba(233, 69, 96, 0.8)');
      gradient.addColorStop(1, '#e94560');
      ctx.strokeStyle = gradient;
      ctx.stroke();

      // Draw current position dot
      const lastValidIdx = pitchHistory.length - 1;
      const lastFreq = pitchHistory[lastValidIdx];
      if (lastFreq > 0) {
        const x = lastValidIdx * step;
        const y = freqToY(lastFreq);
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#e94560';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(233, 69, 96, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    function update() {
      if (!analyser) return;

      const buffer = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(buffer);

      const freq = detectPitch(buffer, audioContext.sampleRate);
      pitchHistory.push(freq);

      if (pitchHistory.length > MAX_HISTORY) {
        pitchHistory.shift();
      }

      if (freq > 0) {
        const note = frequencyToNote(freq);
        if (note) {
          const centsText = note.cents > 0 ? `+${note.cents}` : `${note.cents}`;
          noteEl.textContent = `${note.full} (${centsText}c)`;
          noteEl.style.color = Math.abs(note.cents) < 15 ? '#2ecc71' : '#e94560';
        }
      } else {
        noteEl.textContent = '--';
        noteEl.style.color = '#e94560';
      }

      drawPitch();
      animationId = requestAnimationFrame(update);
    }

    async function start(stream) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;

      source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      pitchHistory = [];
      update();
    }

    function stop() {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      if (source) {
        source.disconnect();
        source = null;
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
        audioContext = null;
      }
      analyser = null;
      noteEl.textContent = '--';
      noteEl.style.color = '#e94560';
    }

    function reset() {
      pitchHistory = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
    }

    // Initial draw
    drawGrid();

    return { start, stop, reset };
  }

  return { createMonitor, frequencyToNote, detectPitch };
})();
