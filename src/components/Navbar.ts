import { appState, AppTab } from '../state';
import { CLINIC_INFO } from '../constants';

export function renderNavbar(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'kdc-nav-container';

  // 1. Top Header (matches mockup directly with mobile enhancements)
  const topHeader = document.createElement('header');
  topHeader.className = 'kdc-top-header';
  topHeader.innerHTML = `
    <div class="kdc-header-inner">
      <a href="#" class="kdc-brand-lockup" id="kdc-logo-home">
        ${appState.settings.customLogoUrl ? `
          <img src="${appState.settings.customLogoUrl}" class="kdc-brand-logo-img" alt="Clinic Logo" style="height: 48px; max-width: 140px; object-fit: contain;" />
        ` : `
          <!-- Dental Tooth SVG Logo with KDC -->
          <svg class="kdc-brand-logo-img" viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 8C32 8 20 20 20 38C20 54 26 62 34 82C37 89 45 88 47 80C49 72 50 64 50 64C50 64 51 72 53 80C55 88 63 89 66 82C74 62 80 54 80 38C80 20 68 8 50 8Z" fill="var(--kdc-teal-primary)"/>
            <path d="M50 14C35 14 26 24 26 40C26 52 31 60 38 77C40 81 44 80 45 74C47 67 48 58 50 58C52 58 53 67 55 74C56 80 60 81 62 77C69 60 74 52 74 40C74 24 65 14 50 14Z" fill="#ffffff" opacity="0.95"/>
            <text x="50" y="44" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="16" fill="var(--kdc-teal-dark)" text-anchor="middle">KDC</text>
          </svg>
        `}
        <div>
          <div class="kdc-brand-title">${appState.settings.chamberName}</div>
          <div class="kdc-brand-tagline">${appState.settings.tagline}</div>
        </div>
      </a>

      <!-- Desktop Nav Links (Hidden on Mobile) -->
      <nav class="kdc-header-nav">
        <a class="kdc-nav-link" id="nav-link-home">হোম</a>
        <a class="kdc-nav-link" id="nav-link-about">এবাউট</a>
        <a class="kdc-nav-link" id="nav-link-contact">কন্টাক্ট</a>
        <a class="kdc-nav-link" id="nav-link-settings" style="color: var(--kdc-teal-primary); font-weight: 700; cursor: pointer;">⚙️ সেটিংস</a>
      </nav>

      <!-- Header Actions: Desktop Socials + Mobile Controls -->
      <div class="kdc-header-actions">
        <!-- Desktop Socials -->
        <div class="kdc-social-links">
          <!-- Facebook -->
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="kdc-social-icon" title="ফেসবুক পেজ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7v-3h3V9.5C10 6.46 11.8 5 14.5 5c1.3 0 2.6.2 2.6.2v3h-1.5c-1.5 0-2 .93-2 1.88V12h3.4l-.5 3h-2.9v6.8c4.56-.93 8-4.96 8-9.8z"/>
            </svg>
          </a>
          <!-- Instagram -->
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="kdc-social-icon" title="ইনস্টাগ্রাম">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <!-- WhatsApp direct chat -->
          <a href="${CLINIC_INFO.whatsapp}" target="_blank" rel="noopener noreferrer" class="kdc-social-icon whatsapp" title="সরাসরি হোয়াটসঅ্যাপে চ্যাট করুন">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </a>
        </div>

        <!-- Mobile Header Quick Contact & Hamburger Button -->
        <div class="kdc-mobile-header-actions">
          <a href="tel:${CLINIC_INFO.phoneClean}" class="kdc-mobile-call-btn" title="হটলাইনে কল করুন">
            <span class="material-symbols-rounded">call</span>
          </a>
          <button class="kdc-mobile-menu-btn" id="btn-mobile-menu-toggle" aria-label="মোবাইল মেনু খুলুন">
            <span class="material-symbols-rounded">${appState.isMobileDrawerOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // 2. Secondary Application Menu Bar (All Clinic Functionalities)
  const menuBar = document.createElement('div');
  menuBar.className = 'kdc-main-menubar';

  const tabs: { key: AppTab; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'ড্যাশবোর্ড', icon: 'dashboard' },
    { key: 'prescription', label: 'ডিজিটাল প্রেসক্রিপশন ও A4 প্রিন্ট', icon: 'prescriptions' },
    { key: 'patients', label: 'রোগী ও মেডিকেল রেকর্ড', icon: 'group' },
    { key: 'medicines', label: 'ঔষধ এন্ট্রি ও ডাটাবেজ', icon: 'medication' },
    { key: 'settings', label: 'কাস্টমাইজেশন ও সেটিংস', icon: 'settings_suggest' },
  ];

  menuBar.innerHTML = `
    <div class="kdc-menubar-inner">
      <div class="kdc-menu-tabs">
        ${tabs
          .map(
            (t) => `
          <button class="kdc-menu-tab-btn ${appState.currentTab === t.key ? 'active' : ''}" data-tab="${t.key}">
            <span class="material-symbols-rounded">${t.icon}</span>
            <span>${t.label}</span>
          </button>
        `
          )
          .join('')}
      </div>

      <div class="kdc-role-switcher-wrapper">
        <button class="kdc-role-badge-btn" id="btn-switch-role" title="অ্যাক্সেস কন্ট্রোল ও রোল পরিবর্তন">
          <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">badge</span>
          <span>${appState.currentUser.name}</span>
          <span class="material-symbols-rounded" style="font-size: 16px; color: #64748b;">expand_more</span>
        </button>
      </div>
    </div>
  `;

  // 3. Mobile Slide-Out Drawer (Appears when hamburger is tapped)
  const mobileDrawer = document.createElement('div');
  mobileDrawer.className = `kdc-mobile-drawer ${appState.isMobileDrawerOpen ? 'open' : ''}`;
  mobileDrawer.innerHTML = `
    <div class="kdc-mobile-drawer-header">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary); font-size: 28px;">dentistry</span>
        <div>
          <div style="font-weight: 800; color: #0f172a; font-size: 16px;">${appState.settings.chamberName}</div>
          <div style="font-size: 12px; color: #64748b;">${appState.settings.doctorName} · ${appState.settings.doctorDegree}</div>
        </div>
      </div>
      <button class="kdc-mobile-drawer-close" id="btn-close-mobile-drawer">
        <span class="material-symbols-rounded">close</span>
      </button>
    </div>

    <div class="kdc-mobile-drawer-user">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-size: 11.5px; color: #64748b;">বর্তমান ইউজার:</div>
          <div style="font-weight: 700; color: var(--kdc-teal-dark); font-size: 14px;">${appState.currentUser.name}</div>
        </div>
        <button class="kdc-btn kdc-btn-secondary kdc-btn-sm" id="btn-mobile-switch-role">
          <span class="material-symbols-rounded">sync_alt</span>
          <span>রোল পরিবর্তন</span>
        </button>
      </div>
    </div>

    <div class="kdc-mobile-drawer-nav">
      <div class="kdc-drawer-section-title">ক্লিনিক ম্যানেজমেন্ট মেনু</div>
      ${tabs.map(t => `
        <button class="kdc-mobile-drawer-item ${appState.currentTab === t.key ? 'active' : ''}" data-tab="${t.key}">
          <span class="material-symbols-rounded">${t.icon}</span>
          <span>${t.label}</span>
          ${appState.currentTab === t.key ? '<span class="material-symbols-rounded" style="margin-left: auto; font-size: 18px;">check</span>' : ''}
        </button>
      `).join('')}
    </div>

    <div class="kdc-mobile-drawer-contact">
      <div class="kdc-drawer-section-title">যোগাযোগ ও তথ্য</div>
      <a href="tel:${appState.settings.phoneClean}" class="kdc-drawer-contact-item">
        <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">phone</span>
        <span>হটলাইন: ${appState.settings.phone}</span>
      </a>
      <a href="${appState.settings.whatsapp}" target="_blank" rel="noopener noreferrer" class="kdc-drawer-contact-item">
        <span class="material-symbols-rounded" style="color: #25d366;">chat</span>
        <span>সরাসরি হোয়াটসঅ্যাপ চ্যাট</span>
      </a>
      <div class="kdc-drawer-contact-item" id="btn-drawer-about">
        <span class="material-symbols-rounded" style="color: #0284c7;">info</span>
        <span>চেম্বার সময়সূচী ও লোকেশন</span>
      </div>
    </div>
  `;

  // 4. Mobile Sticky Bottom Navigation Bar (4 core quick tabs + menu)
  const bottomBar = document.createElement('nav');
  bottomBar.className = 'kdc-mobile-bottom-bar kdc-no-print';
  bottomBar.innerHTML = `
    <button class="kdc-bottom-tab ${appState.currentTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
      <span class="material-symbols-rounded">dashboard</span>
      <span class="kdc-bottom-tab-label">হোম</span>
    </button>

    <button class="kdc-bottom-tab ${appState.currentTab === 'prescription' ? 'active' : ''}" data-tab="prescription">
      <span class="material-symbols-rounded">prescriptions</span>
      <span class="kdc-bottom-tab-label">প্রেসক্রিপশন</span>
    </button>

    <button class="kdc-bottom-tab ${appState.currentTab === 'patients' ? 'active' : ''}" data-tab="patients">
      <span class="material-symbols-rounded">group</span>
      <span class="kdc-bottom-tab-label">রোগী</span>
    </button>

    <button class="kdc-bottom-tab ${appState.currentTab === 'settings' ? 'active' : ''}" data-tab="settings">
      <span class="material-symbols-rounded">settings_suggest</span>
      <span class="kdc-bottom-tab-label">সেটিংস</span>
    </button>

    <button class="kdc-bottom-tab ${appState.isMobileDrawerOpen ? 'active' : ''}" id="btn-bottom-bar-menu">
      <span class="material-symbols-rounded">menu</span>
      <span class="kdc-bottom-tab-label">মেনু</span>
    </button>
  `;

  // Backdrop for mobile drawer
  const backdrop = document.createElement('div');
  backdrop.className = `kdc-mobile-drawer-backdrop ${appState.isMobileDrawerOpen ? 'open' : ''}`;

  // Event handlers
  topHeader.querySelector('#kdc-logo-home')?.addEventListener('click', (e) => {
    e.preventDefault();
    appState.setTab('dashboard');
  });

  topHeader.querySelector('#btn-mobile-menu-toggle')?.addEventListener('click', () => {
    appState.toggleMobileDrawer();
  });

  topHeader.querySelector('#nav-link-home')?.addEventListener('click', () => appState.setTab('dashboard'));
  topHeader.querySelector('#nav-link-about')?.addEventListener('click', () => appState.openModal('about_contact'));
  topHeader.querySelector('#nav-link-contact')?.addEventListener('click', () => appState.openModal('about_contact'));
  topHeader.querySelector('#nav-link-settings')?.addEventListener('click', () => appState.setTab('settings'));

  menuBar.querySelectorAll('.kdc-menu-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab') as AppTab;
      if (tab) appState.setTab(tab);
    });
  });

  menuBar.querySelector('#btn-switch-role')?.addEventListener('click', () => {
    appState.openModal('role_switch');
  });

  // Mobile Drawer Events
  mobileDrawer.querySelector('#btn-close-mobile-drawer')?.addEventListener('click', () => {
    appState.toggleMobileDrawer(false);
  });

  backdrop.addEventListener('click', () => {
    appState.toggleMobileDrawer(false);
  });

  mobileDrawer.querySelector('#btn-mobile-switch-role')?.addEventListener('click', () => {
    appState.toggleMobileDrawer(false);
    appState.openModal('role_switch');
  });

  mobileDrawer.querySelectorAll('.kdc-mobile-drawer-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab') as AppTab;
      if (tab) {
        appState.setTab(tab);
      }
    });
  });

  mobileDrawer.querySelector('#btn-drawer-about')?.addEventListener('click', () => {
    appState.toggleMobileDrawer(false);
    appState.openModal('about_contact');
  });

  // Bottom Bar Events
  bottomBar.querySelectorAll('.kdc-bottom-tab').forEach(btn => {
    if (btn.id === 'btn-bottom-bar-menu') {
      btn.addEventListener('click', () => {
        appState.toggleMobileDrawer();
      });
    } else {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab') as AppTab;
        if (tab) {
          appState.setTab(tab);
        }
      });
    }
  });

  container.appendChild(topHeader);
  container.appendChild(menuBar);
  container.appendChild(mobileDrawer);
  container.appendChild(backdrop);
  container.appendChild(bottomBar);

  return container;
}
