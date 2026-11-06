import { appState } from './state';
import { renderNavbar } from './components/Navbar';
import { renderHeroQuickActions } from './components/HeroQuickActions';
import { renderDashboardView } from './components/DashboardView';
import { renderAppointmentsView } from './components/AppointmentsView';
import { renderPrescriptionView } from './components/PrescriptionView';
import { renderPatientsView } from './components/PatientsView';
import { renderMedicineView } from './components/MedicineView';
import { renderRemindersView } from './components/RemindersView';
import { renderSettingsView } from './components/SettingsView';
import { applyThemeToRoot } from './components/ThemeSettings';
import { renderFooter } from './components/Footer';
import { renderModals } from './components/Modals';
import { renderGlobalSearchBar, initGlobalSearchShortcuts } from './components/GlobalSearchBar';

function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  root.innerHTML = '';

  // 1. Navigation Header
  root.appendChild(renderNavbar());

  // 2. Hero Quick Actions (The 3 Signature Pill Buttons from mockup)
  // Show only on non-print or when on dashboard / home
  root.appendChild(renderHeroQuickActions());

  // 3. Main Content Viewport
  const mainWrapper = document.createElement('main');
  mainWrapper.className = 'kdc-main-content';

  // Global Search Bar at top of main content area for instant patient lookup by name or mobile number
  mainWrapper.appendChild(renderGlobalSearchBar());

  switch (appState.currentTab) {
    case 'dashboard':
      mainWrapper.appendChild(renderDashboardView());
      break;
    case 'prescription':
      mainWrapper.appendChild(renderPrescriptionView());
      break;
    case 'patients':
      mainWrapper.appendChild(renderPatientsView());
      break;
    case 'medicines':
      mainWrapper.appendChild(renderMedicineView());
      break;
    case 'settings':
      mainWrapper.appendChild(renderSettingsView());
      break;
    default:
      mainWrapper.appendChild(renderDashboardView());
  }

  root.appendChild(mainWrapper);

  // 4. Footer & Copyright Bar (matches mockup)
  root.appendChild(renderFooter());

  // 5. Active Modal (if open)
  const modalEl = renderModals();
  if (modalEl) root.appendChild(modalEl);

  // 6. Toast Notification (if active)
  if (appState.toastMessage) {
    const toast = document.createElement('div');
    toast.className = `kdc-toast ${appState.toastType} kdc-no-print`;
    toast.innerHTML = `
      <span class="material-symbols-rounded">
        ${appState.toastType === 'success' ? 'check_circle' : appState.toastType === 'warning' ? 'warning' : 'info'}
      </span>
      <span>${appState.toastMessage}</span>
    `;
    root.appendChild(toast);
  }
}

// Subscribe to state changes for instant reactive re-renders
appState.subscribe(renderApp);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  applyThemeToRoot(appState.settings.primaryColor || appState.settings.themeColor || '#0e8388', appState.settings.customLogoUrl);
  initGlobalSearchShortcuts();
  renderApp();
});
