// lyrics.js - Lyrics display and auto-scroll

const LyricsManager = (() => {
  let lines = [];
  let scrollInterval = null;
  let currentLineIndex = 0;

  const inputEl = () => document.getElementById('lyrics-input');
  const displayEl = () => document.getElementById('lyrics-display');

  function parse(text) {
    lines = text.split('\n').filter(line => line.trim().length > 0);
    return lines;
  }

  function render() {
    const display = displayEl();
    display.innerHTML = '';

    lines.forEach((line, i) => {
      const div = document.createElement('div');
      div.className = 'lyrics-line';
      div.textContent = line;
      div.dataset.index = i;
      display.appendChild(div);
    });
  }

  function highlightLine(index) {
    const display = displayEl();
    const allLines = display.querySelectorAll('.lyrics-line');

    allLines.forEach(el => el.classList.remove('active'));

    if (index >= 0 && index < allLines.length) {
      allLines[index].classList.add('active');
      // Scroll the line into view
      allLines[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    currentLineIndex = index;
  }

  function startAutoScroll(durationSeconds) {
    if (lines.length === 0 || durationSeconds <= 0) return;

    const input = inputEl();
    const display = displayEl();
    input.style.display = 'none';
    display.style.display = 'block';

    render();
    currentLineIndex = 0;
    highlightLine(0);

    const intervalMs = (durationSeconds * 1000) / lines.length;

    scrollInterval = setInterval(() => {
      currentLineIndex++;
      if (currentLineIndex < lines.length) {
        highlightLine(currentLineIndex);
      } else {
        stopAutoScroll();
      }
    }, intervalMs);
  }

  function stopAutoScroll() {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
  }

  function reset() {
    stopAutoScroll();
    currentLineIndex = 0;
    const input = inputEl();
    const display = displayEl();
    input.style.display = '';
    display.style.display = 'none';
  }

  function hasLyrics() {
    const text = inputEl().value.trim();
    return text.length > 0;
  }

  function loadFromInput() {
    const text = inputEl().value.trim();
    if (text) {
      parse(text);
      return true;
    }
    return false;
  }

  return { parse, render, highlightLine, startAutoScroll, stopAutoScroll, reset, hasLyrics, loadFromInput };
})();
