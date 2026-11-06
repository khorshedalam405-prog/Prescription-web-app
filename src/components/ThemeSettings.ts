import { appState } from '../state';

// Helper function to update :root CSS variables in index.css dynamically
export function applyThemeToRoot(primaryColor: string, logoUrl?: string) {
  const root = document.documentElement;
  
  if (!primaryColor) primaryColor = '#0e8388';
  
  // Set primary color variable
  root.style.setProperty('--kdc-teal-primary', primaryColor);
  
  // Calculate dark, deep, light, and subtle variations
  const darkShade = adjustColor(primaryColor, -20);
  const deepShade = adjustColor(primaryColor, -40);
  const lightShade = hexToLightRgba(primaryColor, 0.12);
  const subtleShade = hexToLightRgba(primaryColor, 0.05);

  root.style.setProperty('--kdc-teal-dark', darkShade);
  root.style.setProperty('--kdc-teal-deep', deepShade);
  root.style.setProperty('--kdc-teal-light', lightShade);
  root.style.setProperty('--kdc-teal-subtle', subtleShade);

  if (logoUrl !== undefined) {
    if (logoUrl) {
      root.style.setProperty('--kdc-logo-path', `url("${logoUrl}")`);
    } else {
      root.style.removeProperty('--kdc-logo-path');
    }
  }
}

// Helper to darken or lighten a hex color
function adjustColor(hex: string, percent: number): string {
  let num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return '#0b686c';
  let r = (num >> 16) + Math.round(2.55 * percent);
  let g = ((num >> 8) & 0x00ff) + Math.round(2.55 * percent);
  let b = (num & 0x0000ff) + Math.round(2.55 * percent);

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return '#' + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

// Helper to calculate light RGBA background
function hexToLightRgba(hex: string, alpha: number): string {
  let num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return `rgba(230, 244, 248, ${alpha})`;
  let r = (num >> 16);
  let g = ((num >> 8) & 0x00ff);
  let b = (num & 0x0000ff);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const PRESET_THEME_COLORS = [
  { name: 'ক্লিনিক টিল (Default Teal)', hex: '#0e8388' },
  { name: 'মেডিকেল ব্লু (Medical Blue)', hex: '#0284c7' },
  { name: 'এমেরাল্ড গ্রিন (Emerald Green)', hex: '#059669' },
  { name: 'ইন্ডিগো ভায়োলেট (Indigo Violet)', hex: '#4f46e5' },
  { name: 'রয়েল পার্পল (Royal Purple)', hex: '#7c3aed' },
  { name: 'ক্রিমসন রোঝ (Crimson Rose)', hex: '#e11d48' },
  { name: 'ডার্ক স্ল্যাট (Dark Slate)', hex: '#334155' },
  { name: 'ওয়ার্ম এম্বার (Warm Amber)', hex: '#d97706' },
];

export function renderThemeSettings(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'kdc-theme-settings-component';

  let currentPrimary = appState.settings.primaryColor || appState.settings.themeColor || '#0e8388';
  let currentLogo = appState.settings.customLogoUrl || '';

  function render() {
    container.innerHTML = `
      <div class="kdc-card" style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
          <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
            <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary); font-size: 24px;">palette</span>
            <span>থিম থিম কাস্টমাইজেশন ও লোগো (Theme & Logo Settings)</span>
          </h3>

          <button type="button" class="kdc-btn kdc-btn-secondary kdc-btn-sm" id="btn-theme-reset-default">
            <span class="material-symbols-rounded" style="font-size: 16px;">restart_alt</span>
            <span>ডিফল্ট কালার রিস্টোর</span>
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
          
          <!-- Column 1: Primary Color Picker & Swatches -->
          <div>
            <label style="font-weight: 700; display: block; margin-bottom: 8px; color: #0f172a;">
              ১. প্রাইমারি কালার সিলেক্ট করুন (Primary Color Picker):
            </label>
            
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
              <input type="color" id="input-theme-color-picker" value="${currentPrimary}" style="width: 54px; height: 44px; border: 2px solid #cbd5e1; border-radius: 8px; cursor: pointer; padding: 2px; background: #fff;" />
              <input type="text" id="input-theme-color-hex" value="${currentPrimary}" placeholder="#0e8388" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: monospace; font-weight: 700; text-transform: uppercase;" />
            </div>

            <!-- Preset Swatches Grid -->
            <label style="font-size: 13px; font-weight: 600; color: #64748b; display: block; margin-bottom: 8px;">
              জনপ্রিয় প্রিসেট কালার প্যালেট:
            </label>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
              ${PRESET_THEME_COLORS.map(c => `
                <button type="button" class="btn-preset-color-swatch" data-hex="${c.hex}" title="${c.name}" style="height: 36px; background: ${c.hex}; border: 2px solid ${currentPrimary.toLowerCase() === c.hex.toLowerCase() ? '#0f172a' : 'transparent'}; border-radius: 6px; cursor: pointer; transition: transform 0.15s ease; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center;">
                  ${currentPrimary.toLowerCase() === c.hex.toLowerCase() ? '<span class="material-symbols-rounded" style="color: #fff; font-size: 18px;">check</span>' : ''}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Column 2: Logo Path & Image Upload -->
          <div>
            <label style="font-weight: 700; display: block; margin-bottom: 8px; color: #0f172a;">
              ২. কাস্টম লোগো পাথ / ইমেজ আপলোড (Logo Path):
            </label>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div>
                <input type="text" id="input-theme-logo-url" value="${currentLogo}" placeholder="ইমেজ ইউআরএল বা লোকাল পাথ (e.g. /src/bg.svg)" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13.5px;" />
                <div style="font-size: 11.5px; color: #64748b; margin-top: 2px;">ওয়েব ইউআরএল লিংক অথবা ডিভাইসের ছবি ফাইল।</div>
              </div>

              <div>
                <input type="file" id="input-theme-logo-file" accept="image/*" style="display: none;" />
                <button type="button" class="kdc-btn kdc-btn-secondary" id="btn-upload-logo-file" style="width: 100%; justify-content: center;">
                  <span class="material-symbols-rounded">upload_file</span>
                  <span>ডিভাইস থেকে লোগো আপলোড করুন</span>
                </button>
              </div>

              <!-- Live Logo Preview Box -->
              <div style="background: var(--kdc-teal-light); border: 1px dashed var(--kdc-teal-primary); border-radius: 8px; padding: 12px; display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 4px;">
                <div>
                  <div style="font-size: 12px; font-weight: 700; color: var(--kdc-teal-dark);">লোগো প্রিভিউ (Live Preview):</div>
                  <div style="font-size: 11px; color: #64748b;">ন্যাভবারে কিভাবে দেখাবে</div>
                </div>

                <div style="background: #fff; padding: 6px 12px; border-radius: 6px; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; min-width: 60px; min-height: 40px;">
                  ${currentLogo ? `
                    <img src="${currentLogo}" alt="Custom Logo" style="max-height: 36px; max-width: 120px; object-fit: contain;" />
                  ` : `
                    <svg width="28" height="28" viewBox="0 0 100 90" fill="none">
                      <path d="M50 8C32 8 20 20 20 38C20 54 26 62 34 82C37 89 45 88 47 80C49 72 50 64 50 64C50 64 51 72 53 80C55 88 63 89 66 82C74 62 80 54 80 38C80 20 68 8 50 8Z" fill="${currentPrimary}"/>
                      <path d="M50 14C35 14 26 24 26 40C26 52 31 60 38 77C40 81 44 80 45 74C47 67 48 58 50 58C52 58 53 67 55 74C56 80 60 81 62 77C69 60 74 52 74 40C74 24 65 14 50 14Z" fill="#ffffff"/>
                    </svg>
                  `}
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Submit & Live Save Action -->
        <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: flex-end; gap: 12px;">
          <button type="button" class="kdc-btn kdc-btn-primary" id="btn-theme-save-apply">
            <span class="material-symbols-rounded">palette</span>
            <span>থিম ও লোগো আপডেট সেভ করুন (Apply & Save)</span>
          </button>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const colorPicker = container.querySelector('#input-theme-color-picker') as HTMLInputElement;
    const colorHex = container.querySelector('#input-theme-color-hex') as HTMLInputElement;
    const logoUrlInput = container.querySelector('#input-theme-logo-url') as HTMLInputElement;
    const logoFileInput = container.querySelector('#input-theme-logo-file') as HTMLInputElement;

    // Real-time dynamic updates of CSS :root variables
    const updateDynamicPreview = (newHex: string, newLogoUrl: string) => {
      currentPrimary = newHex;
      currentLogo = newLogoUrl;
      applyThemeToRoot(newHex, newLogoUrl);
    };

    colorPicker?.addEventListener('input', (e) => {
      const hex = (e.target as HTMLInputElement).value;
      if (colorHex) colorHex.value = hex;
      updateDynamicPreview(hex, currentLogo);
    });

    colorHex?.addEventListener('input', (e) => {
      const hex = (e.target as HTMLInputElement).value;
      if (hex.length === 7 && hex.startsWith('#')) {
        if (colorPicker) colorPicker.value = hex;
        updateDynamicPreview(hex, currentLogo);
      }
    });

    logoUrlInput?.addEventListener('input', (e) => {
      const logo = (e.target as HTMLInputElement).value;
      updateDynamicPreview(currentPrimary, logo);
      render();
    });

    // Preset Swatches Click
    container.querySelectorAll('.btn-preset-color-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        const hex = btn.getAttribute('data-hex');
        if (hex) {
          if (colorPicker) colorPicker.value = hex;
          if (colorHex) colorHex.value = hex;
          updateDynamicPreview(hex, currentLogo);
          render();
        }
      });
    });

    // File upload
    container.querySelector('#btn-upload-logo-file')?.addEventListener('click', () => {
      logoFileInput?.click();
    });

    logoFileInput?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          if (dataUrl) {
            currentLogo = dataUrl;
            if (logoUrlInput) logoUrlInput.value = dataUrl;
            updateDynamicPreview(currentPrimary, dataUrl);
            render();
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Save & Apply
    container.querySelector('#btn-theme-save-apply')?.addEventListener('click', () => {
      appState.updateSettings({
        primaryColor: currentPrimary,
        themeColor: currentPrimary,
        customLogoUrl: currentLogo,
      });
      applyThemeToRoot(currentPrimary, currentLogo);
    });

    // Reset Default Theme
    container.querySelector('#btn-theme-reset-default')?.addEventListener('click', () => {
      currentPrimary = '#0e8388';
      currentLogo = '';
      if (colorPicker) colorPicker.value = '#0e8388';
      if (colorHex) colorHex.value = '#0e8388';
      if (logoUrlInput) logoUrlInput.value = '';
      updateDynamicPreview('#0e8388', '');
      appState.updateSettings({
        primaryColor: '#0e8388',
        themeColor: '#0e8388',
        customLogoUrl: '',
      });
      render();
    });
  }

  render();
  return container;
}
