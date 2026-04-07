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
  
  // 3D 景深随机化 (优化模糊度)
  const depth = Math.random(); // 0(远) ~ 1(近)
  const size = 100 + (depth * 100); 
  const blur = (1 - depth) * 1.5; // 最大模糊度降为 1.5px
  const opacity = 0.5 + (depth * 0.5); 
  const zIndex = Math.floor(depth * 10);
  
  div.style.width = size + 'px';
  div.style.height = size + 'px';
  div.style.left = (Math.random() * 80 + 5) + '%';
  div.style.top = (Math.random() * 70 + 10) + '%';
  div.style.opacity = opacity;
  div.style.filter = `blur(${blur}px)`;
  div.style.zIndex = zIndex;
  div.style.animationDelay = (Math.random() * -20) + 's'; 
  
  // 点击展开/收起逻辑
  div.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = div.classList.contains('expanded');
    // 先收起所有其他的
    document.querySelectorAll('.bubble.expanded').forEach(b => b.classList.remove('expanded'));
    if (!isExpanded) div.classList.add('expanded');
  });
  
  container.appendChild(div);
}

// 点击背景收起气泡
window.addEventListener('click', () => {
  document.querySelectorAll('.bubble.expanded').forEach(b => b.classList.remove('expanded'));
});

// 2.2 字数监控
const msgInput = document.getElementById('msg-input');
const charCount = document.getElementById('char-count');
msgInput.addEventListener('input', () => {
  charCount.innerText = `${msgInput.value.length}/150`;
});

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

// 4. 背景氛围气泡
function spawnAmbientBubbles() {
  const ambientContainer = document.getElementById('ambient-bubbles');
  setInterval(() => {
    const b = document.createElement('div');
    b.className = 'ambient-bubble';
    const size = 5 + Math.random() * 25;
    b.style.width = size + 'px';
    b.style.height = size + 'px';
    b.style.left = Math.random() * 100 + '%';
    b.style.animationDuration = (8 + Math.random() * 12) + 's';
    ambientContainer.appendChild(b);
    
    // 定时清理旧气泡，防止 DOM 爆炸
    setTimeout(() => b.remove(), 20000);
  }, 400);
}

// 启动环境气泡
spawnAmbientBubbles();
