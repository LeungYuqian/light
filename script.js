// 模擬存儲用戶資料、聊天記錄等
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

// 進入聊天頁面
function enterChat() {
  document.getElementById('login-register').style.display = 'none';
  document.getElementById('setup-name').style.display = 'none';
  document.getElementById('chat-box').style.display = 'block';

  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML = '';
  chatHistory.forEach(msg => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${msg.username}: ${msg.message}`;
    messagesDiv.appendChild(messageElement);
  });

  // 滾動到最新消息
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// 登出功能
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  window.location.reload();
});

// 清除聊天功能
document.getElementById('clear-chat-btn').addEventListener('click', () => {
  chatHistory = [];
  localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  document.getElementById('messages').innerHTML = '';
});

// 登錄 / 註冊功能
document.getElementById('auth-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // 模擬用戶資料庫（使用 localStorage）
  let users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.username === username);

  if (user && user.password === password) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    enterChat();
  } else {
    document.getElementById('error-msg').textContent = '帳號或密碼錯誤！';
  }
});

// 註冊新帳號
document.getElementById('register-btn').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (!/^[a-zA-Z]{2}\d{5}$/.test(password)) {
    document.getElementById('error-msg').textContent = '密碼必須為兩個英文字母加五個數字！';
    return;
  }

  let users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.some(u => u.username === username)) {
    document.getElementById('error-msg').textContent = '帳號已存在！';
    return;
  }

  users.push({ username, password });
  localStorage.setItem('users', JSON.stringify(users));
  document.getElementById('error-msg').textContent = '註冊成功，請登錄！';
});

// 設置名稱頁
document.getElementById('setup-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const displayName = document.getElementById('display-name').value;
  const personalId = document.getElementById('personal-id').value;

  currentUser.displayName = displayName;
  currentUser.personalId = personalId;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  enterChat();
});

// 發送消息
document.getElementById('send-btn').addEventListener('click', () => {
  const message = document.getElementById('message-input').value;
  if (message.trim() !== '') {
    chatHistory.push({ username: currentUser.displayName || currentUser.username, message });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${currentUser.displayName || currentUser.username}: ${message}`;
    messagesDiv.appendChild(messageElement);
    document.getElementById('message-input').value = '';

    // 滾動到最新消息
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
});

// 初次進入頁面時的處理
if (currentUser) {
  enterChat();
} else {
  document.getElementById('login-register').style.display = 'block';
}

// PWA 安裝支持（添加到主畫面）
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installButton = document.createElement('button');
  installButton.textContent = '添加到主畫面';
  installButton.style.position = 'fixed';
  installButton.style.bottom = '20px';
  installButton.style.left = '20px';
  installButton.style.padding = '10px';
  installButton.style.backgroundColor = '#4caf50';
  installButton.style.color = 'white';
  installButton.style.border = 'none';
  installButton.style.borderRadius = '5px';
  installButton.style.cursor = 'pointer';
  
  installButton.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      console.log(choiceResult.outcome);
      deferredPrompt = null;
      installButton.remove();
    });
  });

  document.body.appendChild(installButton);
});
