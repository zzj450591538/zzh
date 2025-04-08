function initFileBrowser() {
  const container = document.getElementById('file-browser-container');
  
  // 创建核心UI
  const ui = `
    <div class="file-browser">
      <div class="path-bar">
        <select class="root-selector">
          ${allowedPaths.map(p => `<option value="${p}">/${p}</option>`).join('')}
        </select>
        <button class="refresh-btn">⟳</button>
      </div>
      <div class="file-list scroll-container"></div>
      <div class="preview-pane"></div>
    </div>
  `;
  container.innerHTML = ui;

  // 文件点击处理
  container.querySelector('.file-list').addEventListener('click', async (e) => {
    const target = e.target.closest('.file-item');
    if (target) {
      const path = target.dataset.path;
      if (target.classList.contains('dir')) {
        await loadDirectory(path);
      } else {
        showPreview(path);
      }
    }
  });

  // 初始化加载模型目录
  loadDirectory('models');
}

// 加载目录内容
async function loadDirectory(path) {
  try {
    const response = await fetch('/file-browser/api?path=' + encodeURIComponent(path));
    const files = await response.json();
    
    const listHtml = files.map(item => `
      <div class="file-item ${item.type}" data-path="${path}/${item.name}">
        <span class="icon">${item.type === 'dir' ? '📁' : '📄'}</span>
        <span class="name">${item.name}</span>
        ${item.size ? `<span class="size">${formatSize(item.size)}</span>` : ''}
      </div>
    `).join('');
    
    document.querySelector('.file-list').innerHTML = listHtml;
    updatePathBar(path);
  } catch (error) {
    console.error('Directory load failed:', error);
  }
}

// 注册初始化
document.addEventListener('DOMContentLoaded', initFileBrowser);
