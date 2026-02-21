// app.js - Main application logic, navigation, and feature wiring

(async () => {
  // === Tab Navigation ===
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });

  // === Initialize Storage ===
  await RecordingStorage.open();

  // === Pitch Monitors ===
  const singPitchMonitor = PitchDetector.createMonitor('sing-pitch-canvas', 'sing-current-note');
  const practicePitchMonitor = PitchDetector.createMonitor('practice-pitch-canvas', 'practice-current-note');

  // ===========================
  // SING ALONG MODE (Spotify)
  // ===========================
  const spotifyInput = document.getElementById('spotify-input');
  const spotifyGoBtn = document.getElementById('spotify-go-btn');
  const spotifyHint = document.getElementById('spotify-hint');
  const spotifyResults = document.getElementById('spotify-results');
  const singRecordBtn = document.getElementById('sing-record-btn');
  const singStopBtn = document.getElementById('sing-stop-btn');
  const singTimer = document.getElementById('sing-timer');
  const singStatus = document.getElementById('sing-status');

  let singRecordingPromise = null;
  let singMicStream = null;

  // Smart input: auto-detect Spotify URL vs search query
  function handleSpotifyInput() {
    const input = spotifyInput.value.trim();
    if (!input) return;

    if (SpotifyPlayer.isSpotifyInput(input)) {
      // It's a Spotify link — load it directly
      loadSpotifyTrack(input);
    } else {
      // It's a search query — search for songs
      searchSongs(input);
    }
  }

  function loadSpotifyTrack(url) {
    const success = SpotifyPlayer.load(url);
    if (!success) {
      singStatus.textContent = 'Could not load that Spotify link. Try a track, album, or playlist URL.';
      return;
    }
    spotifyResults.style.display = 'none';
    singRecordBtn.disabled = false;
    spotifyHint.textContent = 'Song loaded! Press play in the player, then hit Sing & Record.';
    singStatus.textContent = '';
  }

  async function searchSongs(query) {
    spotifyResults.style.display = 'block';
    spotifyResults.innerHTML = '<div class="results-loading">Searching...</div>';
    spotifyHint.textContent = '';

    try {
      const results = await SpotifyPlayer.search(query);

      if (results.length === 0) {
        spotifyResults.innerHTML = '<div class="results-loading">No results found. Try a different search.</div>';
        return;
      }

      spotifyResults.innerHTML = '';
      results.forEach(track => {
        const item = document.createElement('div');
        item.className = 'spotify-result-item';
        item.innerHTML = `
          <img src="${track.artwork}" alt="" />
          <div class="spotify-result-info">
            <div class="track-name">${escapeHtml(track.name)}</div>
            <div class="track-artist">${escapeHtml(track.artist)}</div>
          </div>
          <button class="result-load-btn">Open in Spotify</button>
        `;

        // Clicking "Open in Spotify" opens a pre-filled Spotify search for this exact track
        item.querySelector('.result-load-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          window.open(track.spotifySearchUrl, '_blank', 'noopener,noreferrer');
          spotifyHint.textContent = 'Copy the song link from Spotify and paste it here to load it.';
        });

        spotifyResults.appendChild(item);
      });
    } catch (err) {
      console.error('Search error:', err);
      spotifyResults.innerHTML = '<div class="results-loading">Search failed. Please try again.</div>';
    }
  }

  spotifyGoBtn.addEventListener('click', handleSpotifyInput);

  spotifyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSpotifyInput();
  });

  // Auto-load when a Spotify link is pasted
  spotifyInput.addEventListener('paste', (e) => {
    setTimeout(() => {
      const val = spotifyInput.value.trim();
      if (SpotifyPlayer.isSpotifyInput(val)) {
        loadSpotifyTrack(val);
      }
    }, 50);
  });

  singRecordBtn.addEventListener('click', startSingRecording);
  singStopBtn.addEventListener('click', stopSingRecording);

  async function startSingRecording() {
    try {
      // Get mic stream
      singMicStream = await VoiceRecorder.requestMicrophone();

      // Start pitch detection
      singPitchMonitor.start(singMicStream);

      // Start recording
      singRecordingPromise = VoiceRecorder.start(singMicStream, singTimer);

      // Start lyrics auto-scroll if lyrics are present
      if (LyricsManager.hasLyrics()) {
        LyricsManager.loadFromInput();
        LyricsManager.startAutoScroll(180); // Default 3 min scroll
      }

      // Update UI
      singRecordBtn.disabled = true;
      singRecordBtn.classList.add('recording');
      singStopBtn.disabled = false;
      singStatus.textContent = 'Recording... Play the song in the Spotify player and sing along!';
    } catch (err) {
      console.error('Failed to start sing recording:', err);
      singStatus.textContent = 'Failed to start recording';
    }
  }

  async function stopSingRecording() {
    // Stop recording
    VoiceRecorder.stop(singTimer);

    // Stop pitch detection
    singPitchMonitor.stop();

    // Stop lyrics scroll
    LyricsManager.stopAutoScroll();

    // Update UI
    singRecordBtn.disabled = false;
    singRecordBtn.classList.remove('recording');
    singStopBtn.disabled = true;
    singStatus.textContent = 'Recording stopped';

    try {
      const result = await singRecordingPromise;
      if (result && result.blob) {
        showSaveModal(result, 'sing-along');
      }
    } catch (err) {
      console.error('Recording error:', err);
    }

    // Release mic
    VoiceRecorder.releaseStream();
    singMicStream = null;

    // Reset lyrics
    LyricsManager.reset();
  }

  // ===========================
  // FREE PRACTICE MODE
  // ===========================
  const practiceRecordBtn = document.getElementById('practice-record-btn');
  const practiceStopBtn = document.getElementById('practice-stop-btn');
  const practiceTimer = document.getElementById('practice-timer');
  const practicePlayback = document.getElementById('practice-playback');
  const practiceAudio = document.getElementById('practice-audio');
  const practiceSaveBtn = document.getElementById('practice-save-btn');
  const practiceDiscardBtn = document.getElementById('practice-discard-btn');

  let practiceRecordingPromise = null;
  let practiceMicStream = null;
  let lastPracticeResult = null;

  practiceRecordBtn.addEventListener('click', startPracticeRecording);
  practiceStopBtn.addEventListener('click', stopPracticeRecording);
  practiceSaveBtn.addEventListener('click', () => {
    if (lastPracticeResult) {
      showSaveModal(lastPracticeResult, 'practice');
    }
  });
  practiceDiscardBtn.addEventListener('click', () => {
    practicePlayback.style.display = 'none';
    lastPracticeResult = null;
    if (practiceAudio.src) {
      URL.revokeObjectURL(practiceAudio.src);
      practiceAudio.src = '';
    }
  });

  async function startPracticeRecording() {
    try {
      practiceMicStream = await VoiceRecorder.requestMicrophone();
      practicePitchMonitor.start(practiceMicStream);
      practiceRecordingPromise = VoiceRecorder.start(practiceMicStream, practiceTimer);

      practiceRecordBtn.disabled = true;
      practiceRecordBtn.classList.add('recording');
      practiceStopBtn.disabled = false;
      practicePlayback.style.display = 'none';
    } catch (err) {
      console.error('Failed to start practice recording:', err);
    }
  }

  async function stopPracticeRecording() {
    VoiceRecorder.stop(practiceTimer);
    practicePitchMonitor.stop();

    practiceRecordBtn.disabled = false;
    practiceRecordBtn.classList.remove('recording');
    practiceStopBtn.disabled = true;

    try {
      lastPracticeResult = await practiceRecordingPromise;
      if (lastPracticeResult && lastPracticeResult.url) {
        practiceAudio.src = lastPracticeResult.url;
        practicePlayback.style.display = 'block';
      }
    } catch (err) {
      console.error('Practice recording error:', err);
    }

    VoiceRecorder.releaseStream();
    practiceMicStream = null;
  }

  // ===========================
  // SAVE MODAL
  // ===========================
  const saveModal = document.getElementById('save-modal');
  const recordingTitleInput = document.getElementById('recording-title');
  const modalSaveBtn = document.getElementById('modal-save-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');

  let pendingSaveData = null;

  function showSaveModal(recordingResult, source) {
    pendingSaveData = { ...recordingResult, source };
    recordingTitleInput.value = '';
    recordingTitleInput.placeholder = source === 'sing-along'
      ? 'Song name or title...'
      : 'Practice session title...';
    saveModal.style.display = 'flex';
    recordingTitleInput.focus();
  }

  modalSaveBtn.addEventListener('click', async () => {
    if (!pendingSaveData) return;

    const title = recordingTitleInput.value.trim() || 'Untitled Recording';
    try {
      await RecordingStorage.save({
        title,
        blob: pendingSaveData.blob,
        mimeType: pendingSaveData.mimeType,
        duration: pendingSaveData.duration,
        source: pendingSaveData.source,
      });

      saveModal.style.display = 'none';
      pendingSaveData = null;

      // If we're viewing recordings tab, refresh
      loadRecordings();
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save recording: ' + err.message);
    }
  });

  modalCancelBtn.addEventListener('click', () => {
    saveModal.style.display = 'none';
    pendingSaveData = null;
  });

  // Handle Enter key in modal
  recordingTitleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') modalSaveBtn.click();
  });

  // Close modal on background click
  saveModal.addEventListener('click', (e) => {
    if (e.target === saveModal) {
      saveModal.style.display = 'none';
      pendingSaveData = null;
    }
  });

  // ===========================
  // MY RECORDINGS
  // ===========================
  const recordingsList = document.getElementById('recordings-list');
  const recordingCount = document.getElementById('recording-count');

  async function loadRecordings() {
    try {
      const recordings = await RecordingStorage.getAll();
      recordingCount.textContent = recordings.length;

      if (recordings.length === 0) {
        recordingsList.innerHTML = `
          <div class="empty-state">
            <span class="empty-icon">&#127908;</span>
            <p>No recordings yet. Start singing to create your first recording!</p>
          </div>
        `;
        return;
      }

      recordingsList.innerHTML = '';

      recordings.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'recording-card';

        const date = new Date(rec.date);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const durationStr = VoiceRecorder.formatTime(rec.duration);
        const sourceLabel = rec.source === 'sing-along' ? 'Sing Along' : 'Practice';

        const blobUrl = URL.createObjectURL(rec.blob);

        card.innerHTML = `
          <div class="recording-info">
            <h4>${escapeHtml(rec.title)}</h4>
            <div class="recording-meta">
              <span>${dateStr}</span>
              <span>${durationStr}</span>
              <span>${sourceLabel}</span>
            </div>
          </div>
          <div class="recording-actions">
            <audio controls src="${blobUrl}" preload="none"></audio>
            <button class="btn btn-download" data-id="${rec.id}">Download</button>
            <button class="btn btn-danger" data-id="${rec.id}">Delete</button>
          </div>
        `;

        // Download handler
        card.querySelector('.btn-download').addEventListener('click', () => {
          const a = document.createElement('a');
          a.href = blobUrl;
          const ext = rec.mimeType.includes('webm') ? 'webm' : 'ogg';
          a.download = `${rec.title}.${ext}`;
          a.click();
        });

        // Delete handler
        card.querySelector('.btn-danger').addEventListener('click', async () => {
          if (confirm(`Delete "${rec.title}"?`)) {
            await RecordingStorage.remove(rec.id);
            URL.revokeObjectURL(blobUrl);
            loadRecordings();
          }
        });

        recordingsList.appendChild(card);
      });
    } catch (err) {
      console.error('Failed to load recordings:', err);
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Load recordings when switching to the tab
  document.querySelector('[data-tab="my-recordings"]').addEventListener('click', loadRecordings);

  // Initial load
  loadRecordings();
})();
