// ─── Constants ───────────────────────────────────────
const WORKER_URL = 'https://sweet-disk-0439.toonayoga.workers.dev/'; // Your CF Worker URL

// ─── State ───────────────────────────────────────────
let startTime = 0;
let timerInterval = null;
let testIsActive = false;

// ─── DOM Elements ────────────────────────────────────
const co2Overlay = document.getElementById('co2-overlay');
const testBtn    = document.getElementById('test-btn');
const timerEl    = document.getElementById('timer');
const bubbleWorld = document.getElementById('bubble-world');
const bubbleContainer = document.getElementById('bubble-container');
const sendBtn    = document.getElementById('send-btn');
const msgInput   = document.getElementById('msg-input');

// ─── Phase 1: CO2 Test Logic ─────────────────────────
function updateTimer() {
  const diff = (Date.now() - startTime) / 1000;
  const mins = Math.floor(diff / 60);
  const secs = (diff % 60).toFixed(2);
  timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(5, '0')}`;
}

testBtn.addEventListener('mousedown', (e) => {
  e.preventDefault();
  testIsActive = true;
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 10);
});

window.addEventListener('mouseup', () => {
  if (testIsActive) {
    testIsActive = false;
    clearInterval(timerInterval);
    // Transition to Phase 2
    enterBubbleWorld();
  }
});

function enterBubbleWorld() {
  co2Overlay.classList.add('faded-out');
  bubbleWorld.classList.remove('hidden');
  loadBubbles();
}

// ─── Phase 2: Bubble Logic ───────────────────────────
async function loadBubbles() {
  try {
    const res = await fetch(WORKER_URL);
    const msgs = await res.json();
    bubbleContainer.innerHTML = ''; // Clear
    msgs.forEach(createBubble);
  } catch (e) {
    console.error('Failed to load bubbles:', e);
  }
}

function createBubble(msg) {
  const b = document.createElement('div');
  b.className = 'bubble';
  b.textContent = msg.content;
  
  // Random Position & Animation Delay
  const size = 150 + Math.random() * 80;
  b.style.width = `${size}px`;
  b.style.height = `${size}px`;
  b.style.left = `${Math.random() * 80 + 10}vw`;
  b.style.top = `${Math.random() * 70 + 10}vh`;
  b.style.animation = `bubbleFloat ${15 + Math.random() * 10}s infinite ease-in-out`;
  b.style.animationDelay = `${Math.random() * 5}s`;
  
  bubbleContainer.appendChild(b);
}

// ─── Send Logic ──────────────────────────────────────
sendBtn.addEventListener('click', async () => {
  const content = msgInput.value.trim();
  if (!content) return;
  
  // Create temp local bubble for feedback
  createBubble({ content });
  msgInput.value = '';

  try {
    await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, name: 'Anonymous' })
    });
  } catch (e) {
    console.error('Failed to save content:', e);
  }
});
