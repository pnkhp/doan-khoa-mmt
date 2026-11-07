import { FAQ_DATA } from '../data/faqData.js';

const STOP_WORDS = new Set(
  'la gi cua va co cho toi minh ban oi ve nao nhung cac duoc the nao nhu mot hay xin hoi muon biet'.split(' ')
);

const SENSITIVE_QUERY_RE =
  /\b(dang ky|lien he|email|so dien thoai|hotline|facebook|fanpage|dia chi|gia ban|gia ao|bao nhieu tien|le phi|hoc phi|mien phi|mua ao|dat ao|lich|sap toi|khi nao|bao gio|o dau|dia diem|han chot|tuyen thanh vien)\b/;
const FACTUAL_OVERRIDE_RE = /\b(nang cap|thanh lap|lich su|da den|dia phuong)\b/;

export function normalizeText(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokenize(text) {
  return normalizeText(text)
    .split(' ')
    .filter(word => word && !STOP_WORDS.has(word));
}

function levenshtein(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const old = row[j];
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        previous + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      previous = old;
    }
  }
  return row[b.length];
}

export function findFaqAnswer(query) {
  const text = normalizeText(query);
  if (SENSITIVE_QUERY_RE.test(text) && !FACTUAL_OVERRIDE_RE.test(text)) return null;
  const input = tokenize(text);
  if (!input.length) return null;

  const ranked = FAQ_DATA.map(item => {
    const phrases = [item.question, ...(item.keywords || [])].map(normalizeText);
    if (phrases.includes(text)) return { item, score: 1 };
    const vocabulary = new Set(phrases.flatMap(tokenize));
    const coverage =
      input.reduce(
        (sum, word) =>
          sum +
          (vocabulary.has(word)
            ? 1
            : [...vocabulary].some(
                other =>
                  word.length >= 4 &&
                  other.length >= 4 &&
                  levenshtein(word, other) <= 1
              )
            ? 0.85
            : 0),
        0
      ) / input.length;
    const phraseMatch = (item.keywords || [])
      .map(normalizeText)
      .some(key => key.length >= 4 && ` ${text} `.includes(` ${key} `));
    return { item, score: coverage * 0.88 + (phraseMatch ? 0.1 : 0) };
  }).sort((a, b) => b.score - a.score);

  if (!ranked.length || ranked[0].score < 0.7) return null;
  if (
    ranked[0].score < 1 &&
    ranked[1] &&
    ranked[0].score - ranked[1].score < 0.035
  ) {
    return null;
  }
  return ranked[0].item;
}
