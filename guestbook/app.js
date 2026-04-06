const API_URL = 'https://sweet-disk-0439.toonayoga.workers.dev/';
let startTime, timerId;

const testBtn = document.getElementById('test-btn');
const timerEl = document.getElementById('timer');
const overlay = document.getElementById('co2-overlay');
const bubbleWorld = document.getElementById('bubble-world');
const container = document.getElementById('bubble-container');

// 1. CO2 计时逻辑
const startTimer = () => {
  startTime = Date.now();
  timerId = setInterval(() => {
    timerEl.innerText = ((Date.now() - startTime)/1000).toFixed(2);
  }, 10);
};

const stopTimer = () => {
  if (!startTime) return;
  clearInterval(timerId);
  overlay.classList.add('fade-out');
  bubbleWorld.classList.remove('hidden');
  loadMessages();
  startTime = null;
};

// 支持桌面端与移动端长按
testBtn.addEventListener('mousedown', startTimer);
testBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startTimer(); });
window.addEventListener('mouseup', stopTimer);
window.addEventListener('touchend', stopTimer);

// 2. 加载接口数据并生成气泡
async function loadMessages() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    container.innerHTML = '';
    data.forEach(msg => createBubble(msg.content));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

function createBubble(text) {
  const div = document.createElement('div');
  div.className = 'bubble';
  div.innerText = text;
  
  // 随机大小、位置与动画延迟
  const size = 120 + Math.random() * 80;
  div.style.width = size + 'px';
  div.style.height = size + 'px';
  div.style.left = (Math.random() * 80 + 5) + '%';
  div.style.top = (Math.random() * 70 + 10) + '%';
  div.style.animationDelay = (Math.random() * -10) + 's'; // 负延迟让动画立即出现在随机阶段
  
  container.appendChild(div);
}

// 3. 发送新留言
document.getElementById('send-btn').addEventListener('click', async () => {
  const input = document.getElementById('msg-input');
  const content = input.value.trim();
  if (!content) return;

  createBubble(content); // 立即本地渲染，提升体验
  const oldVal = content;
  input.value = '';

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: oldVal })
    });
  } catch (e) {
    console.error('Send error:', e);
  }
});
