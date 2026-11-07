import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESOURCES_ROOT = path.resolve(__dirname, 'resources');

const STATIC_ASSET_DIRS = [
  'CHUỖI TRAINING',
  'GIẢI ĐẤU TFT',
  'GIỚI THIỆU ÁO KHOA',
  'HOLD THE FLAG',
  'HỘI THI CÁN BỘ ĐOÀN GIỎI',
  'images',
  'NC OPEN BADMINTON 2026',
  'NETSECDAY',
  'NEWBIE TO CREWBIE',
  'NGỌN ĐUỐC XANH',
  'THANH NIÊN TIÊN TIẾN LÀM THEO LỜI BÁC',
  'Thanh Tich',
  'TRUYỀN THÔNG TẾT',
  'VNU TOUR',
];

const MIME_MAP = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

function copyDirFiltered(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === 'XÓA') continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirFiltered(srcPath, destPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (!MIME_MAP[ext]) continue;
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function preserveOriginalAssetsPlugin() {
  return {
    name: 'preserve-original-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();
        let decodedPath;
        try {
          decodedPath = decodeURIComponent(req.url.split('?')[0]);
        } catch {
          return next();
        }
        const trimmed = decodedPath.replace(/^\/+/, '');
        const topSegment = trimmed.split('/')[0];
        if (!STATIC_ASSET_DIRS.includes(topSegment)) return next();

        const fullPath = path.resolve(RESOURCES_ROOT, trimmed);
        if (!fullPath.startsWith(RESOURCES_ROOT)) return next();
        if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) return next();

        const ext = path.extname(fullPath).toLowerCase();
        if (!MIME_MAP[ext]) return next();

        res.setHeader('Content-Type', MIME_MAP[ext]);
        fs.createReadStream(fullPath).pipe(res);
      });
    },
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      for (const dirName of STATIC_ASSET_DIRS) {
        const src = path.resolve(RESOURCES_ROOT, dirName);
        const dest = path.resolve(distDir, dirName);
        copyDirFiltered(src, dest);
      }
    },
  };
}

export default defineConfig({
  publicDir: false,
  plugins: [react(), preserveOriginalAssetsPlugin()],
});
