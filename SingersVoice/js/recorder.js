// recorder.js - Microphone recording with MediaRecorder API

const VoiceRecorder = (() => {
  let mediaRecorder = null;
  let audioChunks = [];
  let stream = null;
  let startTime = 0;
  let timerInterval = null;
  let lastBlob = null;
  let lastDuration = 0;

  async function requestMicrophone() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      return stream;
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        alert('Microphone access denied. Please allow microphone access to record.');
      } else {
        alert('Could not access microphone: ' + err.message);
      }
      throw err;
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function startTimer(timerEl) {
    startTime = Date.now();
    timerEl.textContent = '00:00';
    timerInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      timerEl.textContent = formatTime(elapsed);
    }, 500);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    lastDuration = (Date.now() - startTime) / 1000;
  }

  function start(existingStream, timerEl) {
    return new Promise(async (resolve, reject) => {
      try {
        const micStream = existingStream || await requestMicrophone();
        audioChunks = [];

        // Determine best supported MIME type
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : MediaRecorder.isTypeSupported('audio/webm')
            ? 'audio/webm'
            : 'audio/ogg';

        mediaRecorder = new MediaRecorder(micStream, { mimeType });

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          lastBlob = new Blob(audioChunks, { type: mimeType });
          resolve({
            blob: lastBlob,
            mimeType,
            duration: lastDuration,
            url: URL.createObjectURL(lastBlob),
          });
        };

        mediaRecorder.onerror = (e) => reject(e.error);

        mediaRecorder.start(250); // Collect data every 250ms
        if (timerEl) startTimer(timerEl);

        if (!existingStream) {
          stream = micStream;
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  function stop(timerEl) {
    if (timerEl) stopTimer();

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  }

  function isRecording() {
    return mediaRecorder && mediaRecorder.state === 'recording';
  }

  function getStream() {
    return stream;
  }

  function releaseStream() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
  }

  function getLastBlob() {
    return lastBlob;
  }

  function getLastDuration() {
    return lastDuration;
  }

  return {
    requestMicrophone,
    start,
    stop,
    isRecording,
    getStream,
    releaseStream,
    getLastBlob,
    getLastDuration,
    formatTime,
  };
})();
