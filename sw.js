const CACHE='cat-care-v1';const ASSETS=['./','./index.html','./manifest.json','./icon.svg'];self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(x=>{let y=x.clone();caches.open(CACHE).then(c=>c.put(e.request,y));return x}).catch(()=>caches.match('./')))));
// 預設的照護下拉選單項目
let careOptions = JSON.parse(localStorage.getItem('cat_care_options')) || [
  "🍚 餵食紀錄",
  "💧 飲水紀錄",
  "🚽 排泄紀錄",
  "💊 用藥提醒",
  "🩺 看診紀錄"
];

// 初始化與渲染自訂選項標籤
function renderCareItemTags() {
  const container = document.getElementById('care-items-tags');
  container.innerHTML = careOptions.map((item, index) => `
    <span class="badge bg-secondary d-flex align-items-center gap-1 p-2">
      ${item}
      <button type="button" class="btn-close btn-close-white" style="font-size: 0.5rem;" onclick="removeCareItem(${index})"></button>
    </span>
  `).join('');
  
  // 重新儲存至 localStorage
  localStorage.setItem('cat_care_options', JSON.stringify(careOptions));
  // 重新刷新貓咪卡片中的下拉選單
  renderCatCards();
}

// 新增照護選項
function addCustomCareItem() {
  const input = document.getElementById('new-care-item-input');
  const value = input.value.trim();
  if (value && !careOptions.includes(value)) {
    careOptions.push(value);
    input.value = '';
    renderCareItemTags();
  }
}

// 刪除照護選項
function removeCareItem(index) {
  careOptions.splice(index, 1);
  renderCareItemTags();
}

// 渲染「一貓一框」的貓咪照護卡片
function renderCatCards() {
  const container = document.getElementById('cat-cards-container');
  // 假設 catsData 為你既有的貓咪資料陣列
  container.innerHTML = catsData.map(cat => {
    // 生成下拉選單的 <option> HTML
    const optionsHTML = careOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('');

    return `
      <div class="card border-primary mb-3" id="cat-card-${cat.id}">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 class="m-0">🐱 ${cat.name}</h4>
          <span>🎂 生日: ${cat.birthday || '未設定'}</span>
        </div>
        <div class="card-body">
          <!-- 體重與基本資訊 -->
          <div class="row mb-3">
            <div class="col-md-6">
              <p><strong>⚖️ 最新體重：</strong> ${cat.weight ? cat.weight + ' kg' : '暫無紀錄'}</p>
              <p><strong>📝 貓咪備註：</strong> ${cat.note || '無'}</p>
            </div>
            
            <!-- 快速照護登記區（下拉式選單） -->
            <div class="col-md-6 bg-light p-3 rounded">
              <h6>⏰ 快速照護登記</h6>
              <div class="input-group mb-2">
                <select id="select-care-${cat.id}" class="form-select">
                  ${optionsHTML}
                </select>
                <button class="btn btn-success" onclick="logCareEvent('${cat.id}')">完成登記</button>
              </div>
            </div>
          </div>

          <!-- 該隻貓咪的今日照護完成狀態與歷史紀錄 -->
          <div class="mt-3">
            <h6>✅ 今日照護紀錄</h6>
            <ul class="list-group list-group-flush" id="today-logs-${cat.id}">
              <!-- 動態帶入該貓咪今日已完成的照護事項 -->
            </ul>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 處理照護事件登記
function logCareEvent(catId) {
  const select = document.getElementById(`select-care-${catId}`);
  const selectedAction = select.value;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. 將紀錄寫入該貓咪的資料結構中
  // 2. 更新 localStorage 並刷新 UI
  alert(`已成功為貓咪記錄：${selectedAction} (${timestamp})`);
  // 呼叫你的儲存與更新函式...
}

// 初始化執行
document.addEventListener('DOMContentLoaded', () => {
  renderCareItemTags();
});
