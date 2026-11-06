import { appState } from '../state';
import { Patient } from '../types';

export function renderGlobalSearchBar(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'kdc-global-search-container kdc-no-print';

  const query = appState.globalSearchQuery.trim();
  const lowerQ = query.toLowerCase();

  // Filter patients by name, mobile number, or ID
  let matchedPatients: Patient[] = [];
  if (query) {
    matchedPatients = appState.patients.filter((p) => {
      const matchName = p.name.toLowerCase().includes(lowerQ);
      const matchPhone = p.phone.replace(/[^0-9]/g, '').includes(lowerQ.replace(/[^0-9]/g, '')) || p.phone.includes(lowerQ);
      const matchId = p.id.toLowerCase().includes(lowerQ);
      return matchName || matchPhone || matchId;
    });
  }

  const isNumeric = /^[0-9+]+$/.test(query);

  container.innerHTML = `
    <div class="kdc-global-search-card">
      <div class="kdc-search-input-wrapper">
        <span class="material-symbols-rounded kdc-search-icon">person_search</span>
        
        <input 
          type="text" 
          id="kdc-global-patient-search" 
          class="kdc-global-search-input" 
          value="${escapeHtml(query)}"
          placeholder="রোগীর নাম বা মোবাইল নম্বর দিয়ে খুঁজুন (যেমন: তানভীর, 01711, 01822, P-101)..." 
          autocomplete="off"
          spellcheck="false"
        />

        <div class="kdc-search-controls">
          ${query ? `
            <button type="button" class="kdc-search-clear-btn" id="btn-clear-global-search" title="সার্চ ক্লিয়ার করুন">
              <span class="material-symbols-rounded">close</span>
            </button>
          ` : `
            <span class="kdc-search-kbd-badge" title="কিবোর্ডে / অথবা Ctrl+K চাপুন">/</span>
          `}
        </div>
      </div>

      <!-- Quick Filter Pills -->
      <div class="kdc-search-quick-tags">
        <span class="kdc-search-tag-label">দ্রুত ফিল্টার:</span>
        <button type="button" class="kdc-search-tag-btn" data-search="তানভীর">তানভীর আহমেদ</button>
        <button type="button" class="kdc-search-tag-btn" data-search="01711">01711...</button>
        <button type="button" class="kdc-search-tag-btn" data-search="নাসরিন">নাসরিন সুলতানা</button>
        <button type="button" class="kdc-search-tag-btn" data-search="ডায়াবেটিস">ডায়াবেটিস অ্যালার্ট</button>
        <button type="button" class="kdc-search-tag-btn" data-search="01933">01933...</button>
      </div>

      <!-- Live Search Results Dropdown Overlay (appears when query is typed) -->
      ${query ? `
        <div class="kdc-global-search-results-panel" id="kdc-search-results-panel">
          <div class="kdc-search-results-header">
            <div>
              <span style="font-weight: 700; color: #0f172a;">অনুসন্ধানের ফলাফল: </span>
              <span class="tabular-nums" style="font-weight: 700; color: var(--kdc-teal-primary);">${matchedPatients.length} জন রোগী পাওয়া গেছে</span>
            </div>
            <span style="font-size: 11.5px; color: #64748b;">(ESC চেপে বন্ধ করুন)</span>
          </div>

          <div class="kdc-search-results-list">
            ${matchedPatients.length === 0 ? `
              <div class="kdc-search-empty-state">
                <span class="material-symbols-rounded" style="font-size: 40px; color: #94a3b8; margin-bottom: 6px;">search_off</span>
                <div style="font-size: 15px; font-weight: 700; color: #1e293b;">‘${escapeHtml(query)}’ দিয়ে কোনো রোগী পাওয়া যায়নি</div>
                <p style="font-size: 13px; color: #64748b; margin-top: 4px; max-width: 380px;">
                  নতুন রোগী হিসেবে রেজিস্টার করতে নিচের বাটনে চাপ দিন। আপনার দেওয়া নাম বা মোবাইল নম্বর স্বয়ংক্রিয়ভাবে ফর্মে যুক্ত হবে।
                </p>
                <button type="button" class="kdc-btn kdc-btn-primary" id="btn-quick-register-from-search" style="margin-top: 12px;">
                  <span class="material-symbols-rounded">person_add</span>
                  <span>+ ‘${escapeHtml(query)}’ নতুন রোগী হিসেবে নিবন্ধন করুন</span>
                </button>
              </div>
            ` : matchedPatients.map((p) => {
              const hasAlerts = p.medicalAlerts.diabetes || p.medicalAlerts.hypertension || p.medicalAlerts.drugAllergies.length > 0;
              return `
                <div class="kdc-search-result-row">
                  <div class="kdc-search-patient-main">
                    <div class="kdc-patient-avatar-badge">
                      ${p.gender === 'female' ? '👩' : '👨'}
                    </div>

                    <div style="flex: 1; min-width: 0;">
                      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span class="kdc-search-patient-name">${highlightMatch(p.name, query)}</span>
                        <span class="kdc-search-patient-id tabular-nums">${p.id}</span>
                        ${p.bloodGroup ? `<span class="kdc-badge-blood">${p.bloodGroup}</span>` : ''}
                      </div>

                      <div class="kdc-search-patient-meta">
                        <span class="tabular-nums" style="font-weight: 700; color: #0f172a;">
                          📱 ${highlightMatch(p.phone, query)}
                        </span>
                        <span>·</span>
                        <span class="tabular-nums" style="font-weight: 700; color: var(--kdc-teal-dark);">
                          🎂 ${p.age} বছর ${p.dateOfBirth ? `(DOB: ${p.dateOfBirth})` : ''}
                        </span>
                        <span>·</span>
                        <span>${p.gender === 'female' ? 'মহিলা' : 'পুরুষ'}</span>
                        ${p.address ? `<span>·</span><span style="color: #64748b;">${escapeHtml(p.address)}</span>` : ''}
                      </div>

                      <!-- Alerts & Billing line -->
                      <div style="display: flex; align-items: center; gap: 6px; margin-top: 4px; flex-wrap: wrap;">
                        ${p.medicalAlerts.diabetes ? `<span class="kdc-mini-alert alert-red">ডায়াবেটিস</span>` : ''}
                        ${p.medicalAlerts.hypertension ? `<span class="kdc-mini-alert alert-orange">উচ্চ রক্তচাপ</span>` : ''}
                        ${p.medicalAlerts.drugAllergies.length > 0 ? `<span class="kdc-mini-alert alert-yellow">এলার্জি: ${escapeHtml(p.medicalAlerts.drugAllergies.join(','))}</span>` : ''}
                        ${!hasAlerts ? `<span class="kdc-mini-alert alert-green">স্বাস্থ্য ঝুঁকি নেই</span>` : ''}

                        <span style="font-size: 11.5px; color: #475569; margin-left: auto;">
                          বকেয়া: <strong class="tabular-nums" style="color: ${p.dueAmount > 0 ? '#dc2626' : '#16a34a'};">${p.dueAmount > 0 ? `৳ ${p.dueAmount.toLocaleString()}` : 'পরিশোধিত'}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Quick Action Buttons for This Patient -->
                  <div class="kdc-search-row-actions">
                    <button type="button" class="kdc-btn kdc-btn-primary kdc-btn-sm btn-action-rx" data-patient-id="${p.id}" title="ডিজিটাল প্রেসক্রিপশন তৈরি ও প্রিন্ট করুন">
                      <span class="material-symbols-rounded">prescriptions</span>
                      <span>Rx প্রেসক্রিপশন</span>
                    </button>

                    <button type="button" class="kdc-btn kdc-btn-secondary kdc-btn-sm btn-action-profile" data-patient-id="${p.id}" title="রোগীর পূর্ণাঙ্গ রেকর্ড ও চিকিৎসা হিস্ট্রি দেখুন">
                      <span class="material-symbols-rounded">folder_open</span>
                      <span>ফাইল ও ইতিহাস</span>
                    </button>

                    <button type="button" class="kdc-btn kdc-btn-secondary kdc-btn-sm btn-action-book" data-patient-name="${escapeHtml(p.name)}" data-patient-phone="${escapeHtml(p.phone)}" title="নতুন অ্যাপয়েন্টমেন্ট শিডিউল করুন">
                      <span class="material-symbols-rounded">calendar_add_on</span>
                      <span>বুকিং</span>
                    </button>

                    <button type="button" class="kdc-btn kdc-btn-whatsapp kdc-btn-sm btn-action-wa" data-phone="${p.phone}" data-name="${escapeHtml(p.name)}" title="হোয়াটসঅ্যাপে সরাসরি যোগাযোগ করুন">
                      <span class="material-symbols-rounded">chat</span>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // --- Attach Handlers ---
  const inputEl = container.querySelector('#kdc-global-patient-search') as HTMLInputElement;

  inputEl?.addEventListener('input', (e) => {
    const val = (e.target as HTMLInputElement).value;
    appState.globalSearchQuery = val;
    appState.notify();
    // Maintain focus after re-render
    setTimeout(() => {
      const reInput = document.getElementById('kdc-global-patient-search') as HTMLInputElement;
      if (reInput) {
        reInput.focus();
        reInput.setSelectionRange(reInput.value.length, reInput.value.length);
      }
    }, 10);
  });

  // Clear button
  container.querySelector('#btn-clear-global-search')?.addEventListener('click', () => {
    appState.globalSearchQuery = '';
    appState.notify();
  });

  // Quick tags
  container.querySelectorAll('.kdc-search-tag-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const term = btn.getAttribute('data-search') || '';
      appState.globalSearchQuery = term;
      appState.notify();
    });
  });

  // Quick register button
  container.querySelector('#btn-quick-register-from-search')?.addEventListener('click', () => {
    const prefillData = isNumeric ? { phone: query } : { name: query };
    appState.globalSearchQuery = '';
    appState.openModalWithData('new_patient', prefillData);
  });

  // Patient Actions: Rx
  container.querySelectorAll('.btn-action-rx').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-patient-id');
      const targetP = appState.patients.find((p) => p.id === pid);
      if (targetP) {
        appState.globalSearchQuery = '';
        appState.createNewBlankPrescription(targetP);
      }
    });
  });

  // Patient Actions: Profile / Dossier
  container.querySelectorAll('.btn-action-profile').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-patient-id');
      if (pid) {
        appState.globalSearchQuery = '';
        appState.navigateToPatient(pid);
      }
    });
  });

  // Clicking anywhere on the patient main info in search results opens full dossier
  container.querySelectorAll('.kdc-search-patient-main').forEach((block) => {
    block.addEventListener('click', (e) => {
      const parentRow = block.closest('.kdc-search-result-row');
      const profileBtn = parentRow?.querySelector('.btn-action-profile');
      const pid = profileBtn?.getAttribute('data-patient-id');
      if (pid) {
        appState.globalSearchQuery = '';
        appState.navigateToPatient(pid);
      }
    });
    (block as HTMLElement).style.cursor = 'pointer';
  });

  // Patient Actions: Book
  container.querySelectorAll('.btn-action-book').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-patient-name') || '';
      const phone = btn.getAttribute('data-patient-phone') || '';
      appState.globalSearchQuery = '';
      appState.openModalWithData('new_patient', { name, phone });
    });
  });

  // Patient Actions: WhatsApp
  container.querySelectorAll('.btn-action-wa').forEach((btn) => {
    btn.addEventListener('click', () => {
      const phone = btn.getAttribute('data-phone') || '';
      const name = btn.getAttribute('data-name') || '';
      appState.sendWhatsAppReminder(phone, `আসসালামু আলাইকুম ${name}, খাদিজা ডেন্টাল কেয়ার থেকে আপনার সাথে যোগাযোগ করা হচ্ছে।`);
    });
  });

  return container;
}

// Global Keyboard Shortcut listener for `/` and `Ctrl+K`
let keyboardListenerAttached = false;
export function initGlobalSearchShortcuts() {
  if (keyboardListenerAttached) return;
  keyboardListenerAttached = true;

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    // If typing in another input or textarea, don't hijack unless it's Ctrl+K / Cmd+K
    const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
    const isTyping = targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select';

    if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !isTyping)) {
      e.preventDefault();
      const inputEl = document.getElementById('kdc-global-patient-search') as HTMLInputElement;
      if (inputEl) {
        inputEl.focus();
        inputEl.select();
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (e.key === 'Escape') {
      const inputEl = document.getElementById('kdc-global-patient-search') as HTMLInputElement;
      if (inputEl && appState.globalSearchQuery) {
        appState.globalSearchQuery = '';
        appState.notify();
      }
    }
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function highlightMatch(text: string, query: string): string {
  if (!query) return escapeHtml(text);
  const escapedText = escapeHtml(text);
  const escapedQuery = escapeHtml(query);
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  return escapedText.replace(regex, '<mark class="kdc-search-highlight">$1</mark>');
}
