import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  FAQ_DATA,
  FAQ_FALLBACK,
  findFaqAnswer,
  SUGGESTED_FAQ_IDS,
} from '../data/faqData.js';

const SUGGESTED_CHIPS = SUGGESTED_FAQ_IDS.map(id =>
  FAQ_DATA.find(entry => entry.id === id)
).filter(Boolean);

const INITIAL_MESSAGE = {
  id: 'welcome',
  user: false,
  text: 'Xin chào! Chọn câu hỏi bên dưới hoặc nhập tên hoạt động để xem thông tin từ tài liệu của Đoàn Khoa.',
  section: null,
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const askQuestion = (rawQuestion, selectedItem = null) => {
    const trimmed = rawQuestion.trim().slice(0, 300);
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    const matched = selectedItem || findFaqAnswer(trimmed);
    setMessages(prev => {
      const next = [
        ...prev,
        { id: `u-${Date.now()}`, user: true, text: trimmed, section: null },
        {
          id: `a-${Date.now() + 1}`,
          user: false,
          text: matched ? matched.answer : FAQ_FALLBACK,
          section: matched ? matched.section : null,
        },
      ];
      return next.length > 40 ? next.slice(next.length - 40) : next;
    });
    setQuery('');
    inputRef.current?.focus();
  };

  const closeChat = () => {
    setOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  };

  return (
    <aside
      id="dk-chat"
      className="dk-chat"
      lang="vi"
      aria-label="Hỏi đáp Đoàn Khoa"
      onKeyDown={e => {
        if (e.key === 'Escape' && open) {
          e.preventDefault();
          closeChat();
        }
      }}
    >
      <AnimatePresence>
        {open ? (
          <motion.section
            id="dk-chat-panel"
            className="dk-chat__panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby="dk-chat-title"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 10 }
            }
            animate={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.97, y: 8 }
            }
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: 'bottom right' }}
          >
            <header className="dk-chat__header">
              <h2 id="dk-chat-title" className="dk-chat__title">
                Trợ lý Nhà Mạng
              </h2>
              <button
                type="button"
                className="dk-chat__close"
                aria-label="Đóng hộp hỏi đáp"
                onClick={closeChat}
              >
                ×
              </button>
            </header>

            <p className="dk-chat__note">
              Tra cứu FAQ từ tài liệu • Không phải chat AI trực tuyến. Câu hỏi chỉ xử lý trên thiết bị, không lưu khi tải lại.
            </p>

            <div
              ref={logRef}
              className="dk-chat__log"
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              aria-label="Nội dung hỏi đáp"
              tabIndex={0}
            >
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`dk-chat__message${
                    msg.user ? ' dk-chat__message--user' : ''
                  }`}
                >
                  <span className="dk-chat__speaker">
                    {msg.user ? 'Bạn' : 'Nhà Mạng'}
                  </span>
                  <p>{msg.text}</p>
                  {msg.section ? (
                    <span className="dk-chat__source">
                      Tham khảo: {msg.section}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            <div
              className="dk-chat__chips"
              role="group"
              aria-label="Câu hỏi gợi ý"
            >
              {SUGGESTED_CHIPS.map(item => (
                <button
                  key={item.id}
                  type="button"
                  className="dk-chat__chip"
                  onClick={() => askQuestion(item.question, item)}
                >
                  {item.question}
                </button>
              ))}
            </div>

            <form
              className="dk-chat__form"
              onSubmit={e => {
                e.preventDefault();
                askQuestion(query);
              }}
            >
              <label htmlFor="dk-chat-input" className="dk-chat__label">
                Câu hỏi của bạn
              </label>
              <input
                ref={inputRef}
                id="dk-chat-input"
                className="dk-chat__input"
                type="text"
                maxLength={300}
                autoComplete="off"
                placeholder="Ví dụ: Ngọn Đuốc Xanh là gì?"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button type="submit" className="dk-chat__send">
                Gửi
              </button>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <button
        ref={launcherRef}
        type="button"
        className="dk-chat__launcher"
        aria-expanded={open}
        aria-controls="dk-chat-panel"
        onClick={() => setOpen(prev => !prev)}
      >
        {open ? 'Đóng hỏi đáp' : 'Hỏi Đoàn Khoa'}
      </button>
    </aside>
  );
}
