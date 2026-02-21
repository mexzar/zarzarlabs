// spotify.js - Spotify embed integration with in-app search

const SpotifyPlayer = (() => {
  let currentType = null;
  let currentId = null;
  let isLoaded = false;

  // Extract Spotify resource type and ID from various URL formats
  function parseSpotifyUrl(input) {
    input = input.trim();

    // Spotify URI: spotify:track:4uLU6hMCjMI75M1A2tKUQC
    let match = input.match(/^spotify:(track|album|playlist|episode|show):([a-zA-Z0-9]+)$/);
    if (match) return { type: match[1], id: match[2] };

    // Open URL: https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC
    match = input.match(/open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/);
    if (match) return { type: match[1], id: match[2] };

    // Embed URL: https://open.spotify.com/embed/track/...
    match = input.match(/open\.spotify\.com\/embed\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/);
    if (match) return { type: match[1], id: match[2] };

    return null;
  }

  function isSpotifyInput(input) {
    return parseSpotifyUrl(input) !== null;
  }

  function getEmbedUrl(type, id) {
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  }

  function load(urlOrUri) {
    const parsed = parseSpotifyUrl(urlOrUri);
    if (!parsed) return false;

    const iframe = document.getElementById('spotify-player');
    const placeholder = document.getElementById('spotify-placeholder');

    currentType = parsed.type;
    currentId = parsed.id;

    iframe.src = getEmbedUrl(parsed.type, parsed.id);
    iframe.style.display = 'block';
    placeholder.classList.add('hidden');
    isLoaded = true;

    return true;
  }

  // Search for songs using the iTunes Search API (free, no auth needed)
  async function search(query) {
    if (!query.trim()) return [];

    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=10`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Search failed');

    const data = await response.json();

    return data.results.map(track => ({
      name: track.trackName,
      artist: track.artistName,
      album: track.collectionName,
      artwork: track.artworkUrl100,
      previewUrl: track.previewUrl,
      // Build a Spotify search URL for this specific track
      spotifySearchUrl: `https://open.spotify.com/search/${encodeURIComponent(track.trackName + ' ' + track.artistName)}`,
    }));
  }

  function getIsLoaded() {
    return isLoaded;
  }

  function getCurrentInfo() {
    return { type: currentType, id: currentId };
  }

  function reset() {
    const iframe = document.getElementById('spotify-player');
    const placeholder = document.getElementById('spotify-placeholder');

    iframe.src = '';
    iframe.style.display = 'none';
    placeholder.classList.remove('hidden');
    currentType = null;
    currentId = null;
    isLoaded = false;
  }

  return { parseSpotifyUrl, isSpotifyInput, load, search, getIsLoaded, getCurrentInfo, reset };
})();
