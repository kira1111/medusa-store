// ======= ELEMENTOS =======
const grid        = document.getElementById('games-grid');
const searchInput = document.getElementById('search-input');
const countEl     = document.getElementById('game-count');
const noResults   = document.getElementById('no-results');
const noMsg       = document.getElementById('no-results-msg');

// ======= UTILITÁRIOS =======
function getCards() {
  return Array.from(grid.querySelectorAll('.game-card'));
}

function updateCount(visible) {
  countEl.textContent = visible === 1 ? '1 jogo' : `${visible} jogos`;
}

// ======= BUSCA =======
function filterGames(query) {
  const q = query.trim().toLowerCase();
  const cards = getCards();
  let visible = 0;

  cards.forEach(card => {
    const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
    const tag   = card.querySelector('.card-tag')?.textContent.toLowerCase()   || '';
    const match = !q || title.includes(q) || tag.includes(q);
    card.style.display = match ? '' : 'none';
    if (match) visible++;
  });

  updateCount(visible);

  if (cards.length === 0) {
    noResults.style.display = 'block';
    noMsg.innerHTML = 'Nenhum jogo cadastrado ainda.';
  } else if (visible === 0) {
    noResults.style.display = 'block';
    noMsg.innerHTML = `Nenhum jogo encontrado para "<strong>${query}</strong>".`;
  } else {
    noResults.style.display = 'none';
  }
}

searchInput.addEventListener('input', e => filterGames(e.target.value));

// ======= INICIALIZAÇÃO =======
(function init() {
  const cards = getCards();
  updateCount(cards.length);
  if (cards.length === 0) {
    noResults.style.display = 'block';
  }
  cards.forEach((card, i) => {
    card.style.animationDelay = `${i * 0.07}s`;
  });
})();

// ======= FEEDBACK =======
function sendFeedback() {
  const txt = document.getElementById('feedback-text');
  if (!txt.value.trim()) return;
  txt.value = '';
  showToast('✓ Sugestão recebida — obrigado!');
}

// ======= TOAST =======
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ======= MODAIS =======
function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function closeModalOnOverlay(event, id) {
  if (event.target.id === id) closeModal(id);
}

function openAbout()  { openModal('modal-about'); }
function openLogin()  { openModal('modal-login'); showLogin(); }

// ======= LOGIN / CADASTRO =======
function showLogin() {
  document.getElementById('login-form-view').style.display = '';
  document.getElementById('register-form-view').style.display = 'none';
}

function showRegister() {
  document.getElementById('login-form-view').style.display = 'none';
  document.getElementById('register-form-view').style.display = '';
}

function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value.trim();
  if (!email || !pass) { showToast('⚠ Preencha todos os campos.'); return; }
  closeModal('modal-login');
  showToast('✓ Login realizado — bem-vindo!');
  // Atualiza botão de login na topbar
  const btn = document.querySelector('.login-btn');
  if (btn) { btn.textContent = email.split('@')[0]; btn.style.color = 'var(--green)'; }
}

function handleRegister() {
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-pass').value.trim();
  if (!name || !email || !pass) { showToast('⚠ Preencha todos os campos.'); return; }
  closeModal('modal-login');
  showToast(`✓ Conta criada — olá, ${name}!`);
  const btn = document.querySelector('.login-btn');
  if (btn) { btn.textContent = name; btn.style.color = 'var(--green)'; }
}

// Fechar modal com ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal('modal-about');
    closeModal('modal-login');
  }
});