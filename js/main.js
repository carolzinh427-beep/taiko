/* ==========================================================================
   TAIKÔ BEACH CLUB - APPLICATION SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initViewSwitchers();
  initModals();
  initSwipeTouchNavigation();
  initScrollLinks();
});

/**
 * Switch between Mockup Split-Screen, Full Desktop, and Mobile-Only views
 */
function initViewSwitchers() {
  const stage = document.getElementById('mockupStage');
  const btnSplit = document.getElementById('btnSplitView');
  const btnDesktop = document.getElementById('btnDesktopView');
  const btnMobile = document.getElementById('btnMobileView');
  const buttons = [btnSplit, btnDesktop, btnMobile];

  function setActiveButton(activeBtn) {
    buttons.forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    if (activeBtn) activeBtn.classList.add('active');
  }

  if (btnSplit) {
    btnSplit.addEventListener('click', () => {
      stage.className = 'mockup-stage view-split-screen';
      setActiveButton(btnSplit);
    });
  }

  if (btnDesktop) {
    btnDesktop.addEventListener('click', () => {
      stage.className = 'mockup-stage view-full-desktop';
      setActiveButton(btnDesktop);
    });
  }

  if (btnMobile) {
    btnMobile.addEventListener('click', () => {
      stage.className = 'mockup-stage view-full-mobile';
      setActiveButton(btnMobile);
    });
  }
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

      // Send to WhatsApp directly with customized message
      const encodedMsg = encodeURIComponent(
        `Olá Taikô Beach Club! Gostaria de confirmar solicitação:\n\n` +
        `• Nome: ${guestName}\n` +
        `• WhatsApp: ${guestPhone}\n` +
        `• Evento / Atração: ${selectedEvent}\n\n` +
        `Aguardo confirmação da equipe de concierge!`
      );

      modalFeedback.style.display = 'block';
      modalFeedback.textContent = `Solicitação registrada para ${guestName}! Redirecionando para o WhatsApp...`;

      setTimeout(() => {
        window.open(`https://wa.me/5527999887766?text=${encodedMsg}`, '_blank');
        closeModal();
      }, 1200);
    });
  }
}

/**
 * Mobile swipe scroll buttons & touch enhancements
 */
function initSwipeTouchNavigation() {
  const track = document.getElementById('mobileSwipeTrack');
  if (!track) return;

  // Horizontal mouse-drag support for desktop testing inside mobile frame
  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });
}

/**
 * Smooth in-viewport scroll for navigation links
 */
function initScrollLinks() {
  const desktopScroll = document.getElementById('desktopScrollContainer');
  const navLinks = document.querySelectorAll('.desktop-content-scroll a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl && desktopScroll) {
          e.preventDefault();
          const targetPosition = targetEl.offsetTop;
          desktopScroll.scrollTo({
            top: targetPosition - 70,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}
