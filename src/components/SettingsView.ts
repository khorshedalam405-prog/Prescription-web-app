import { appState } from '../state';
import { ClinicSettings } from '../types';
import { renderThemeSettings } from './ThemeSettings';

export function renderSettingsView(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'kdc-settings-view';

  const s = appState.settings;

  let activeTab: 'profile' | 'theme' | 'rx_format' = 'profile';

  function renderContent() {
    container.innerHTML = `
      <!-- Top Back Bar -->
      <div class="kdc-no-print" style="margin-bottom: 12px;">
        <button class="kdc-btn kdc-btn-secondary kdc-btn-sm btn-back-dashboard" style="display: inline-flex; align-items: center; gap: 6px;">
          <span class="material-symbols-rounded" style="font-size: 18px;">arrow_back</span>
          <span>হোম ড্যাশবোর্ডে ফিরে যান</span>
        </button>
      </div>

      <!-- Top Title Bar -->
      <div class="kdc-no-print" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;">
        <div>
          <h2 style="font-size: 24px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 10px;">
            <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary); font-size: 32px;">settings_suggest</span>
            <span>চেম্বার কাস্টমাইজেশন ও সিস্টেম সেটিংস (Site Customization)</span>
          </h2>
          <p style="font-size: 14px; color: #64748b; margin-top: 4px;">
            এখান থেকে আপনি সাইটের ডাক্তার নাম, থিম প্রাইমারি কালার, লোগো, চেম্বারের ঠিকানা, ফোন নম্বর এবং প্রেসক্রিপশন হেডার ডিজাইন কাস্টমাইজ করতে পারবেন।
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="kdc-btn kdc-btn-secondary" id="btn-reset-defaults">
            <span class="material-symbols-rounded">restart_alt</span>
            <span>ডিফল্ট সেটিংস রিস্টোর</span>
          </button>

          <button class="kdc-btn kdc-btn-primary" id="btn-save-all-settings" style="font-size: 15px; padding: 10px 22px;">
            <span class="material-symbols-rounded">save</span>
            <strong>সব পরিবর্তন সেভ করুন (Save Settings)</strong>
          </button>
        </div>
      </div>

      <!-- Settings Sub-Tabs -->
      <div class="kdc-card kdc-no-print" style="margin-bottom: 20px; padding: 12px 16px;">
        <div style="display: flex; gap: 8px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; overflow-x: auto;">
          <button class="kdc-btn ${activeTab === 'profile' ? 'kdc-btn-primary' : 'kdc-btn-secondary'}" id="tab-btn-profile" style="font-size: 14px; border-radius: 8px;">
            <span class="material-symbols-rounded">medical_services</span>
            <span>১. চেম্বার ও ডাক্তার প্রোফাইল</span>
          </button>

          <button class="kdc-btn ${activeTab === 'theme' ? 'kdc-btn-primary' : 'kdc-btn-secondary'}" id="tab-btn-theme" style="font-size: 14px; border-radius: 8px;">
            <span class="material-symbols-rounded">palette</span>
            <span>২. থিম কালার ও লোগো (Theme & Logo)</span>
          </button>

          <button class="kdc-btn ${activeTab === 'rx_format' ? 'kdc-btn-primary' : 'kdc-btn-secondary'}" id="tab-btn-rx-format" style="font-size: 14px; border-radius: 8px;">
            <span class="material-symbols-rounded">prescription</span>
            <span>৩. প্রেসক্রিপশন ফরম্যাট ও হেডার</span>
          </button>
        </div>
      </div>

      <!-- Theme Settings Panel Mount (shows when theme tab active) -->
      <div id="theme-settings-mount-container" style="display: ${activeTab === 'theme' ? 'block' : 'none'}; margin-bottom: 20px;"></div>

      <!-- Settings Content Form Panels -->
      <form id="settings-form" class="kdc-card kdc-no-print" style="padding: 24px; display: ${activeTab === 'theme' ? 'none' : 'block'};">
        
        <!-- ================= TAB 1: PROFILE ================= -->
        <div id="panel-profile" style="display: ${activeTab === 'profile' ? 'block' : 'none'};">
          <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; display: flex; align-items: center; gap: 8px;">
            <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">badge</span>
            <span>ডাক্তার ও চেম্বারের মূল পরিচিতি (Clinic & Doctor Identity)</span>
          </h3>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 6px;">ডাক্তারের নাম (বাংলা) *</label>
              <input type="text" id="set-doctorName" value="${s.doctorName}" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">যেমন: মোঃ খোরশেদ আলম</div>
            </div>

            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 6px;">ডাক্তারের নাম (English)</label>
              <input type="text" id="set-doctorNameEnglish" value="${s.doctorNameEnglish}" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
            </div>

            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 6px;">ডাক্তারের ডিগ্রী / শিক্ষাগত যোগ্যতা *</label>
              <input type="text" id="set-doctorDegree" value="${s.doctorDegree}" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">যেমন: ডেন্টিস্ট / বিডিএস (ঢাকা বিশ্ববিদ্যালয়)</div>
            </div>

            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 6px;">বিশেষজ্ঞতা ও পদবী</label>
              <input type="text" id="set-doctorDesignation" value="${s.doctorDesignation}" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
            </div>

            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 6px;">BMDC রেজিস্ট্রেশন নম্বর</label>
              <input type="text" id="set-bmdcRegNo" value="${s.bmdcRegNo}" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
            </div>

            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 6px;">চেম্বারের নাম (বাংলা) *</label>
              <input type="text" id="set-chamberName" value="${s.chamberName}" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
            </div>

            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 6px;">চেম্বারের স্লোগান / ট্যাগলাইন</label>
              <input type="text" id="set-tagline" value="${s.tagline}" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
            </div>

            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 6px;">চেম্বারের ঠিকানা (বাংলা)</label>
              <input type="text" id="set-chamberAddress" value="${s.chamberAddress}" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
            </div>

            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 6px;">যোগাযোগের ফোন নম্বর</label>
              <input type="text" id="set-phone" value="${s.phone}" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
            </div>

            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 6px;">হোয়াটসঅ্যাপ নম্বর URL</label>
              <input type="text" id="set-whatsapp" value="${s.whatsapp}" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
            </div>

            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 6px;">রোগী দেখার সময়সূচী</label>
              <input type="text" id="set-chamberTiming" value="${s.chamberTiming}" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
            </div>
          </div>
        </div>

        <!-- ================= TAB 2: PRESCRIPTION FORMAT ================= -->
        <div id="panel-rx_format" style="display: ${activeTab === 'rx_format' ? 'block' : 'none'};">
          <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; display: flex; align-items: center; gap: 8px;">
            <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">print</span>
            <span>A4 প্রেসক্রিপশন হেডার ও লেআউট কাস্টমাইজেশন</span>
          </h3>

          <!-- Layout Option Switcher -->
          <div style="margin-bottom: 20px;">
            <label style="font-weight: 700; display: block; margin-bottom: 8px;">হেডার ডিজাইন স্টাইল:</label>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
              <label style="border: 2px solid ${s.rxHeaderStyle === 'image_template' ? 'var(--kdc-teal-primary)' : '#e2e8f0'}; border-radius: 10px; padding: 14px; cursor: pointer; background: ${s.rxHeaderStyle === 'image_template' ? 'var(--kdc-teal-subtle)' : '#fff'}; display: flex; gap: 10px; align-items: flex-start;">
                <input type="radio" name="rxHeaderStyle" value="image_template" ${s.rxHeaderStyle === 'image_template' ? 'checked' : ''} style="margin-top: 4px;" />
                <div>
                  <div style="font-weight: 700; color: #0f172a;">ছবি প্রেসক্রিপশন ফরম্যাট (মোঃ খোরশেদ আলম)</div>
                  <div style="font-size: 12px; color: #64748b; margin-top: 2px;">উপরে বামে ডাক্তারের নাম ও ডানে নীল বক্সে চেম্বারের নাম সমন্বিত নিখুঁত প্যাড ডিজাইন।</div>
                </div>
              </label>

              <label style="border: 2px solid ${s.rxHeaderStyle === 'modern' ? 'var(--kdc-teal-primary)' : '#e2e8f0'}; border-radius: 10px; padding: 14px; cursor: pointer; background: ${s.rxHeaderStyle === 'modern' ? 'var(--kdc-teal-subtle)' : '#fff'}; display: flex; gap: 10px; align-items: flex-start;">
                <input type="radio" name="rxHeaderStyle" value="modern" ${s.rxHeaderStyle === 'modern' ? 'checked' : ''} style="margin-top: 4px;" />
                <div>
                  <div style="font-weight: 700; color: #0f172a;">মডার্ন টেক্সট হেডার প্যাড (Modern Digital Pad)</div>
                  <div style="font-size: 12px; color: #64748b; margin-top: 2px;">লোগো, পূর্ণাঙ্গ রেজিস্ট্রেশন ও ডিজিটাল ডিজাইন ব্যাকগ্রাউন্ড প্যাড।</div>
                </div>
              </label>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 6px;">বাম কলামের শিরোনাম ১</label>
              <input type="text" id="set-rxLeftColHeader1" value="${s.rxLeftColHeader1}" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
            </div>

            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 6px;">বাম কলামের শিরোনাম ২</label>
              <input type="text" id="set-rxLeftColHeader2" value="${s.rxLeftColHeader2}" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
            </div>

            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 6px;">বাম কলামের শিরোনাম ৩</label>
              <input type="text" id="set-rxLeftColHeader3" value="${s.rxLeftColHeader3}" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
            </div>

            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 6px;">ফুটার ফলো-আপ ভিজিট মেসেজ</label>
              <input type="text" id="set-rxNextVisitText" value="${s.rxNextVisitText}" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
            </div>

            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" id="set-rxShowLogo" ${s.rxShowLogo ? 'checked' : ''} />
                <span style="font-weight: 600;">প্রেসক্রিপশন হেডারে লোগো দেখান</span>
              </label>

              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" id="set-rxShowToothChartNote" ${s.rxShowToothChartNote ? 'checked' : ''} />
                <span style="font-weight: 600;">বাম কলামে FDI Tooth Diagram নোট দেখান</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Submit Button at bottom -->
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: flex-end; gap: 12px;">
          <button type="submit" class="kdc-btn kdc-btn-primary" style="font-size: 15px; padding: 12px 28px;">
            <span class="material-symbols-rounded">save</span>
            <span>কাস্টমাইজেশন পরিবর্তনসমূহ সেভ করুন</span>
          </button>
        </div>
      </form>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Mount ThemeSettings if theme tab is active
    const themeMount = container.querySelector('#theme-settings-mount-container');
    if (themeMount && activeTab === 'theme') {
      themeMount.appendChild(renderThemeSettings());
    }

    // Sub-tab switching
    container.querySelector('#tab-btn-profile')?.addEventListener('click', () => {
      activeTab = 'profile';
      renderContent();
    });
    container.querySelector('#tab-btn-theme')?.addEventListener('click', () => {
      activeTab = 'theme';
      renderContent();
    });
    container.querySelector('#tab-btn-rx-format')?.addEventListener('click', () => {
      activeTab = 'rx_format';
      renderContent();
    });

    // Form Save
    const form = container.querySelector('#settings-form') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveSettingsFromForm();
      });
    }

    container.querySelector('#btn-save-all-settings')?.addEventListener('click', () => {
      saveSettingsFromForm();
    });

    // Reset Defaults
    container.querySelector('#btn-reset-defaults')?.addEventListener('click', () => {
      if (confirm('আপনি কি সত্যিই সব সেটিংস মূল ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?')) {
        appState.resetSettingsToDefault();
      }
    });
  }

  function saveSettingsFromForm() {
    const getVal = (id: string) => (container.querySelector(`#${id}`) as HTMLInputElement | HTMLTextAreaElement)?.value || '';
    const getCheck = (id: string) => (container.querySelector(`#${id}`) as HTMLInputElement)?.checked ?? false;
    const getRadio = (name: string) => (container.querySelector(`input[name="${name}"]:checked`) as HTMLInputElement)?.value || 'image_template';

    const updated: Partial<ClinicSettings> = {
      doctorName: getVal('set-doctorName'),
      doctorNameEnglish: getVal('set-doctorNameEnglish'),
      doctorDegree: getVal('set-doctorDegree'),
      doctorDesignation: getVal('set-doctorDesignation'),
      bmdcRegNo: getVal('set-bmdcRegNo'),
      chamberName: getVal('set-chamberName'),
      tagline: getVal('set-tagline'),
      chamberAddress: getVal('set-chamberAddress'),
      phone: getVal('set-phone'),
      whatsapp: getVal('set-whatsapp'),
      chamberTiming: getVal('set-chamberTiming'),
      
      rxHeaderStyle: getRadio('rxHeaderStyle') as any,
      rxLeftColHeader1: getVal('set-rxLeftColHeader1'),
      rxLeftColHeader2: getVal('set-rxLeftColHeader2'),
      rxLeftColHeader3: getVal('set-rxLeftColHeader3'),
      rxNextVisitText: getVal('set-rxNextVisitText'),
      rxShowLogo: getCheck('set-rxShowLogo'),
      rxShowToothChartNote: getCheck('set-rxShowToothChartNote'),
    };

    appState.updateSettings(updated);
  }

  renderContent();
  container.querySelector('.btn-back-dashboard')?.addEventListener('click', () => {
    appState.setTab('dashboard');
  });

  return container;
}
