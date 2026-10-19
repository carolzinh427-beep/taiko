/* ==========================================================================
   TAIKÔ BEACH CLUB - APPLICATION SCRIPT
   Transitions, Mobile Vidralítico Drawer, VIP Modals & WhatsApp (5527995019111)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initModals();
  initSwipeTouchNavigation();
  initScrollAnimations();
});

/**
 * Mobile Drawer Menu Handler (Vidralítico glassmorphism on top right)
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
 * Scroll Animations & Section Transitions (Intersection Observer)
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Optional: keep observing or unobserve once in view
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    animatedElements.forEach((el) => el.classList.add('in-view'));
  }
}

/**
 * Modal Dialog Handler for Guest List, Table Reservation & Birthdays
 * Directs to official WhatsApp: 5527995019111
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
    if (!modalOverlay) return;
    modalOverlay.classList.add('open');
    if (modalFeedback) modalFeedback.style.display = 'none';
    if (modalForm) modalForm.reset();

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
      modalTitle.textContent = 'Reserva de Camarote & Lounge VIP';
    } else if (type === 'aniversario') {
      modalTitle.textContent = 'Comemore seu Aniversário VIP';
    } else {
      modalTitle.textContent = 'Atendimento Exclusivo Taikô';
    }
  };

  // Close modal
  function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('open');
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
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Handle Form Submission -> WhatsApp 5527995019111
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('guestName')?.value || 'Convidado';
      const guestPhone = document.getElementById('guestPhone')?.value || '';
      const selectedEvent = document.getElementById('eventSelect')?.value || 'Atendimento Geral';
      const guestCount = document.getElementById('guestCount')?.value || '2';

      // Official WhatsApp Number
      const whatsappNumber = '5527995019111';

      // Send to WhatsApp directly with customized message
      const encodedMsg = encodeURIComponent(
        `Olá Taikô Beach Club! Gostaria de confirmar solicitação:\n\n` +
        `• Nome: ${guestName}\n` +
        `• WhatsApp: ${guestPhone}\n` +
        `• Evento / Serviço: ${selectedEvent}\n` +
        `• Quantidade de Pessoas: ${guestCount}\n\n` +
        `Aguardo confirmação da equipe de concierge!`
      );

      if (modalFeedback) {
        modalFeedback.style.display = 'block';
        modalFeedback.textContent = `Solicitação registrada para ${guestName}! Redirecionando para o WhatsApp...`;
      }

      setTimeout(() => {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMsg}`, '_blank');
        closeModal();
      }, 900);
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
