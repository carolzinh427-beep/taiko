/* ==========================================================================
   TAIKÔ BEACH CLUB - APPLICATION SCRIPT
   Responsive Single-Site Engine (Desktop & Mobile)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initModals();
  initSwipeTouchNavigation();
});

/**
 * Mobile Drawer Menu Handler
 */
function initMobileDrawer() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      drawer.classList.toggle('open');
      const isOpen = drawer.classList.contains('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
      
      // Update hamburger icon to close X icon
      if (isOpen) {
        menuBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      } else {
        menuBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      }
    });
  }

  window.closeMobileDrawer = function() {
    if (drawer && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      if (menuBtn) {
        menuBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      }
    }
  };
}

/**
 * Modal Dialog Handler for Guest List, Table Reservation & Birthdays
 */
function initModals() {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalForm = document.getElementById('modalForm');
  const modalFeedback = document.getElementById('modalFeedback');
  const eventSelect = document.getElementById('eventSelect');

  // Open Modal function
  window.openBookingModal = function(type, defaultEventName = '') {
    modalOverlay.classList.add('open');
    modalFeedback.style.display = 'none';
    modalForm.reset();

    if (type === 'lista') {
      modalTitle.textContent = 'Nome na Lista VIP • Taikô';
      if (eventSelect && defaultEventName) {
        for (let i = 0; i < eventSelect.options.length; i++) {
          if (eventSelect.options[i].text.includes(defaultEventName) || eventSelect.options[i].value.includes(defaultEventName)) {
            eventSelect.selectedIndex = i;
            break;
          }
        }
      }
    } else if (type === 'mesa' || type === 'camarote') {
      modalTitle.textContent = 'Reserva de Camarote & Mesa';
    } else if (type === 'aniversario') {
      modalTitle.textContent = 'Comemore seu Aniversário VIP';
    } else {
      modalTitle.textContent = 'Atendimento Exclusivo Taikô';
    }
  };

  // Close modal
  function closeModal() {
    modalOverlay.classList.remove('open');
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Handle Form Submission
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('guestName')?.value || 'Convidado';
      const guestPhone = document.getElementById('guestPhone')?.value || '';
      const selectedEvent = document.getElementById('eventSelect')?.value || 'Agenda Semanal';
      const guestCount = document.getElementById('guestCount')?.value || '2';

      // Send to WhatsApp directly with customized message
      const encodedMsg = encodeURIComponent(
        `Olá Taikô Beach Club! Gostaria de confirmar solicitação:\n\n` +
        `• Nome: ${guestName}\n` +
        `• WhatsApp: ${guestPhone}\n` +
        `• Evento / Atração: ${selectedEvent}\n` +
        `• Quantidade de Pessoas: ${guestCount}\n\n` +
        `Aguardo confirmação da equipe de concierge!`
      );

      modalFeedback.style.display = 'block';
      modalFeedback.textContent = `Solicitação registrada para ${guestName}! Redirecionando para o WhatsApp...`;

      setTimeout(() => {
        window.open(`https://wa.me/5527999887766?text=${encodedMsg}`, '_blank');
        closeModal();
      }, 1000);
    });
  }
}

/**
 * Mobile swipe scroll buttons & touch enhancements for horizontal track
 */
function initSwipeTouchNavigation() {
  const track = document.getElementById('agendaGrid');
  if (!track) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', (e) => {
    // Only apply drag if container is scrollable (e.g. mobile/tablet)
    if (track.scrollWidth <= track.clientWidth) return;
    isDown = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.style.cursor = '';
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.style.cursor = '';
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });
}
