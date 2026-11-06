/* Load with defer after faq-data.js. Pure local FAQ lookup: no network, no storage. */
(() => {
  'use strict';
  const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const stop = new Set('la gi cua va co cho toi minh ban oi ve nao nhung cac duoc the nao nhu mot hay xin hoi muon biet'.split(' '));
  const tokens = text => normalize(text).split(' ').filter(word => word && !stop.has(word));
  const fallback = 'Mình chưa có thông tin đủ chắc chắn trong tài liệu để trả lời câu này. Bạn có thể chọn câu hỏi gợi ý hoặc nêu tên hoạt động. Tài liệu hiện có không xác nhận lịch sắp tới, phí, đường dẫn đăng ký hay thông tin liên hệ; hãy kiểm tra thông báo chính thức của Đoàn Khoa trước khi tham gia.';
  function distance(a, b) {
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let previous = row[0]; row[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const old = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
        previous = old;
      }
    }
    return row[b.length];
  }
  function findAnswer(query) {
    const text = normalize(query);
    // Never turn a registration, price or future-date request into a generic factual answer.
    if (/\b(dang ky|lien he|email|so dien thoai|hotline|facebook|fanpage|dia chi|gia ban|gia ao|bao nhieu tien|le phi|hoc phi|mien phi|mua ao|dat ao|lich|sap toi|khi nao|bao gio|o dau|dia diem|han chot|tuyen thanh vien)\b/.test(text) && !/\b(nang cap|thanh lap|lich su|da den|dia phuong)\b/.test(text)) return null;
    const input = tokens(text);
    if (!input.length) return null;
    const data = Array.isArray(window.doanKhoaFAQ) ? window.doanKhoaFAQ : [];
    const ranked = data.map(item => {
      const phrases = [item.question, ...(item.keywords || [])].map(normalize);
      if (phrases.includes(text)) return { item, score: 1 };
      const vocabulary = new Set(phrases.flatMap(tokens));
      const coverage = input.reduce((sum, word) => sum + (vocabulary.has(word) ? 1 : [...vocabulary].some(other => word.length >= 4 && other.length >= 4 && distance(word, other) <= 1) ? 0.85 : 0), 0) / input.length;
      const phrase = (item.keywords || []).map(normalize).some(key => key.length >= 4 && (` ${text} `).includes(` ${key} `));
      return { item, score: coverage * 0.88 + (phrase ? 0.1 : 0) };
    }).sort((a, b) => b.score - a.score);
    if (!ranked.length || ranked[0].score < 0.7) return null;
    if (ranked[0].score < 1 && ranked[1] && ranked[0].score - ranked[1].score < 0.035) return null;
    return ranked[0].item;
  }
  // Small read-only testing/integration surface; does not expose conversation data.
  window.doanKhoaChat = Object.freeze({ normalize, findAnswer });
  function mount() {
    if (document.getElementById('dk-chat')) return;
    const create = (tag, className, text) => {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (text) element.textContent = text;
      return element;
    };
    const root = create('aside', 'dk-chat'); root.id = 'dk-chat'; root.lang = 'vi';
    root.setAttribute('aria-label', 'Hỏi đáp Đoàn Khoa');
    const launcher = create('button', 'dk-chat__launcher', 'Hỏi Đoàn Khoa'); launcher.type = 'button';
    launcher.setAttribute('aria-expanded', 'false'); launcher.setAttribute('aria-controls', 'dk-chat-panel');
    const panel = create('section', 'dk-chat__panel'); panel.id = 'dk-chat-panel'; panel.hidden = true;
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'false'); panel.setAttribute('aria-labelledby', 'dk-chat-title');
    const header = create('header', 'dk-chat__header');
    const heading = create('h2', 'dk-chat__title', 'Trợ lý Nhà Mạng'); heading.id = 'dk-chat-title';
    const close = create('button', 'dk-chat__close', '×'); close.type = 'button'; close.setAttribute('aria-label', 'Đóng hộp hỏi đáp');
    header.append(heading, close);
    const note = create('p', 'dk-chat__note', 'Tra cứu FAQ từ tài liệu • Không phải chat AI trực tuyến. Câu hỏi chỉ xử lý trên thiết bị, không lưu khi tải lại.');
    const log = create('div', 'dk-chat__log'); log.setAttribute('role', 'log'); log.setAttribute('aria-live', 'polite'); log.setAttribute('aria-relevant', 'additions'); log.setAttribute('aria-label', 'Nội dung hỏi đáp'); log.tabIndex = 0;
    const chips = create('div', 'dk-chat__chips'); chips.setAttribute('role', 'group'); chips.setAttribute('aria-label', 'Câu hỏi gợi ý');
    const form = create('form', 'dk-chat__form');
    const label = create('label', 'dk-chat__label', 'Câu hỏi của bạn'); label.htmlFor = 'dk-chat-input';
    const input = create('input', 'dk-chat__input'); input.id = 'dk-chat-input'; input.type = 'text'; input.maxLength = 300; input.autocomplete = 'off'; input.placeholder = 'Ví dụ: Ngọn Đuốc Xanh là gì?';
    const send = create('button', 'dk-chat__send', 'Gửi'); send.type = 'submit';
    form.append(label, input, send);
    panel.append(header, note, log, chips, form); root.append(panel, launcher); document.body.append(root);
    function message(text, user, item) {
      const bubble = create('div', `dk-chat__message${user ? ' dk-chat__message--user' : ''}`);
      bubble.append(create('span', 'dk-chat__speaker', user ? 'Bạn' : 'Nhà Mạng'), create('p', '', text));
      if (item) {
        // Attribution is text only: the widget never exposes document downloads.
        const source = create('span', 'dk-chat__source', `Tham khảo: ${item.section}`);
        bubble.append(source);
      }
      log.append(bubble);
      while (log.children.length > 40) log.firstElementChild.remove();
      log.scrollTop = log.scrollHeight;
    }
    function ask(question, selected) {
      const query = question.trim().slice(0, 300);
      if (!query) { input.focus(); return; }
      message(query, true);
      const answer = selected || findAnswer(query);
      message(answer ? answer.answer : fallback, false, answer);
      input.value = ''; input.focus();
    }
    const data = Array.isArray(window.doanKhoaFAQ) ? window.doanKhoaFAQ : [];
    ['cac-ban', 'ngon-duoc', 'netsec', 'newbie'].forEach(id => {
      const item = data.find(entry => entry.id === id);
      if (!item) return;
      const chip = create('button', 'dk-chat__chip', item.question); chip.type = 'button';
      chip.addEventListener('click', () => ask(item.question, item)); chips.append(chip);
    });
    function toggle(open) {
      panel.hidden = !open; launcher.setAttribute('aria-expanded', String(open));
      launcher.textContent = open ? 'Đóng hỏi đáp' : 'Hỏi Đoàn Khoa';
      if (open) { input.focus(); log.scrollTop = log.scrollHeight; } else launcher.focus();
    }
    launcher.addEventListener('click', () => toggle(panel.hidden));
    close.addEventListener('click', () => toggle(false));
    root.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !panel.hidden) { event.preventDefault(); event.stopPropagation(); toggle(false); }
    });
    // Non-modal dialog: Tab may leave normally; no focus trap or blocked page scrolling.
    form.addEventListener('submit', event => { event.preventDefault(); ask(input.value); });
    message('Chào bạn! Mình giúp tra cứu về Đoàn Khoa, các ban và 12 hoạt động. Bạn có thể gõ tiếng Việt có dấu hoặc không dấu, hoặc chọn gợi ý bên dưới.', false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
