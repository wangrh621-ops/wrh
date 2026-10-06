const menuPanel = document.querySelector('.menu-panel');
const menuButton = document.querySelector('.menu-button');
const menuClose = document.querySelector('.menu-close');
menuButton.addEventListener('click', () => {
  menuPanel.classList.add('open');
  menuPanel.setAttribute('aria-hidden', 'false');
});
function closeMenu() {
  menuPanel.classList.remove('open');
  menuPanel.setAttribute('aria-hidden', 'true');
}
menuClose.addEventListener('click', closeMenu);
menuPanel.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

const lightbox = document.querySelector('.lightbox');
const lightboxContent = document.querySelector('.lightbox-content');
const lightboxCaption = document.querySelector('.lightbox-caption');
function showMedia({ src, title, video = false }) {
  lightboxContent.replaceChildren();
  const media = document.createElement(video ? 'video' : 'img');
  media.src = src;
  if (video) {
    media.controls = true;
    media.autoplay = true;
    media.playsInline = true;
    media.addEventListener('error', () => {
      const note = document.createElement('p');
      note.className = 'media-fallback';
      note.textContent = '当前浏览器无法预览这段视频，可下载原片后播放。';
      const download = document.createElement('a');
      download.href = src;
      download.download = title + (src.toLowerCase().endsWith('.mov') ? '.mov' : '.mp4');
      download.textContent = '下载视频 ↗';
      note.append(' ', download);
      lightboxContent.append(note);
    }, { once: true });
  } else media.alt = title;
  lightboxContent.append(media);
  lightboxCaption.textContent = title;
  lightbox.showModal();
}
document.querySelectorAll('.image-card').forEach((card) => card.addEventListener('click', () => {
  showMedia({ src: card.dataset.image, title: card.dataset.title });
}));
document.querySelectorAll('.video-card').forEach((card) => card.addEventListener('click', () => {
  showMedia({ src: card.dataset.video, title: card.dataset.title, video: true });
}));
document.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('close', () => {
  const video = lightboxContent.querySelector('video');
  if (video) video.pause();
  lightboxContent.replaceChildren();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  document.querySelectorAll('.video-card video').forEach((video) => {
    video.play().catch(() => {});
  });
}
