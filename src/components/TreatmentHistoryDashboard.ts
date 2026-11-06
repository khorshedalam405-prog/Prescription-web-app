import { appState } from '../state';
import { FDI_TOOTH_MAP } from '../constants';
import { Patient, TreatmentItem, TreatmentPlan } from '../types';

export function renderTreatmentHistoryDashboard(defaultPatientId?: string): HTMLElement {
  const container = document.createElement('div');
  container.className = 'kdc-treatment-history-dashboard';

  // Determine active patient
  const activePatientId = defaultPatientId || appState.selectedPatientId || (appState.patients[0]?.id || 'P-101');
  const patient = appState.patients.find(p => p.id === activePatientId) || appState.patients[0];

  // Collect all treatment items for this patient from all treatment plans
  const patientPlans = appState.treatmentPlans.filter(tp => tp.patientId === patient?.id);
  
  // Aggregate items with plan details
  const allProcedures: { item: TreatmentItem; planId: string; planDate: string }[] = [];
  patientPlans.forEach(plan => {
    plan.items.forEach(item => {
      allProcedures.push({
        item,
        planId: plan.id,
        planDate: item.appointmentDate || plan.createdAt
      });
    });
  });

  // Filter states
  let statusFilter: 'all' | 'completed' | 'in_progress' | 'planned' = 'all';
  let categoryFilter: string = 'all';
  let searchQuery: string = '';

  function renderContent() {
    // Filter procedures
    const filtered = allProcedures.filter(({ item }) => {
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || 
        item.procedureName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.remarks && item.remarks.toLowerCase().includes(q)) ||
        (item.toothNumber && item.toothNumber.toString().includes(q));
      
      return matchStatus && matchCategory && matchSearch;
    });

    // Summary calculations
    const totalCost = allProcedures.reduce((sum, { item }) => sum + item.cost, 0);
    const totalDiscount = allProcedures.reduce((sum, { item }) => sum + item.discount, 0);
    const netCost = totalCost - totalDiscount;
    const completedCount = allProcedures.filter(({ item }) => item.status === 'completed').length;
    const inProgressCount = allProcedures.filter(({ item }) => item.status === 'in_progress').length;
    const plannedCount = allProcedures.filter(({ item }) => item.status === 'planned').length;

    container.innerHTML = `
      <!-- Top Patient Selection Bar -->
      <div class="kdc-card kdc-no-print" style="margin-bottom: 20px; background: linear-gradient(135deg, #f8fafc 0%, #edf4f4 100%); border: 1px solid #cbd5e1;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
          <button class="kdc-btn kdc-btn-secondary kdc-btn-sm btn-back-dashboard" style="display: inline-flex; align-items: center; gap: 6px;">
            <span class="material-symbols-rounded" style="font-size: 18px;">arrow_back</span>
            <span>হোম ড্যাশবোর্ডে ফিরে যান</span>
          </button>
          <div>
            <div style="font-size: 13px; font-weight: 700; color: var(--kdc-teal-primary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">
              রোগী চিকিৎসা ইতিহাস ড্যাশবোর্ড (Treatment History Dashboard)
            </div>
            <div style="font-size: 20px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px;">
              <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">history_edu</span>
              <span>${patient ? patient.name : 'রোগী নির্বাচন করুন'}</span>
              ${patient ? `<span style="font-size: 13px; font-weight: 600; color: #64748b;">(${patient.phone} · আইডি: ${patient.id})</span>` : ''}
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <label style="font-size: 13px; font-weight: 700; color: #334155;">রোগী পরিবর্তন:</label>
            <select id="th-patient-select" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13.5px; font-weight: 600; color: #0f172a; background: #fff; cursor: pointer;">
              ${appState.patients.map(p => `
                <option value="${p.id}" ${p.id === patient?.id ? 'selected' : ''}>
                  ${p.name} (${p.phone})
                </option>
              `).join('')}
            </select>

            <button class="kdc-btn kdc-btn-secondary kdc-btn-sm" id="btn-th-print-history" title="চিকিৎসা হিস্ট্রি প্রিন্ট করুন">
              <span class="material-symbols-rounded" style="font-size: 16px;">print</span>
              <span>হিস্ট্রি প্রিন্ট</span>
            </button>
          </div>
        </div>
      </div>

      <!-- KPI Summary Cards Grid -->
      <div class="kdc-grid-4" style="margin-bottom: 24px;">
        <div class="kdc-stat-box">
          <div class="kdc-stat-icon-wrapper" style="background: #e0f2fe; color: #0284c7;">
            <span class="material-symbols-rounded">format_list_numbered</span>
          </div>
          <div>
            <div class="kdc-stat-value">${allProcedures.length} টি</div>
            <div class="kdc-stat-label">মোট চিকিৎসাক্রম</div>
          </div>
        </div>

        <div class="kdc-stat-box">
          <div class="kdc-stat-icon-wrapper" style="background: #dcfce7; color: #16a34a;">
            <span class="material-symbols-rounded">check_circle</span>
          </div>
          <div>
            <div class="kdc-stat-value" style="color: #16a34a;">${completedCount} টি</div>
            <div class="kdc-stat-label">সম্পন্ন চিকিৎসা (${inProgressCount} টি চলমান)</div>
          </div>
        </div>

        <div class="kdc-stat-box">
          <div class="kdc-stat-icon-wrapper" style="background: #fef3c7; color: #d97706;">
            <span class="material-symbols-rounded">pending_actions</span>
          </div>
          <div>
            <div class="kdc-stat-value" style="color: #d97706;">${plannedCount} টি</div>
            <div class="kdc-stat-label">পরিকল্পিত চিকিৎসা</div>
          </div>
        </div>

        <div class="kdc-stat-box">
          <div class="kdc-stat-icon-wrapper" style="background: #ede9fe; color: #7c3aed;">
            <span class="material-symbols-rounded">request_quote</span>
          </div>
          <div>
            <div class="kdc-stat-value">৳ ${netCost.toLocaleString()}</div>
            <div class="kdc-stat-label">মোট প্রাক্কলিত ব্যয় ${totalDiscount > 0 ? `(ছাড়: ৳ ${totalDiscount.toLocaleString()})` : ''}</div>
          </div>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="kdc-card kdc-no-print" style="margin-bottom: 20px; padding: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;">
          
          <!-- Status Filter Tabs -->
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="kdc-btn btn-th-status-filter ${statusFilter === 'all' ? 'kdc-btn-primary' : 'kdc-btn-secondary'} kdc-btn-sm" data-status="all">
              <span>সকল প্রসিডিউর (${allProcedures.length})</span>
            </button>
            <button class="kdc-btn btn-th-status-filter ${statusFilter === 'completed' ? 'kdc-btn-primary' : 'kdc-btn-secondary'} kdc-btn-sm" data-status="completed">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; margin-right: 4px;"></span>
              <span>সম্পন্ন (${completedCount})</span>
            </button>
            <button class="kdc-btn btn-th-status-filter ${statusFilter === 'in_progress' ? 'kdc-btn-primary' : 'kdc-btn-secondary'} kdc-btn-sm" data-status="in_progress">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; margin-right: 4px;"></span>
              <span>চলমান (${inProgressCount})</span>
            </button>
            <button class="kdc-btn btn-th-status-filter ${statusFilter === 'planned' ? 'kdc-btn-primary' : 'kdc-btn-secondary'} kdc-btn-sm" data-status="planned">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #f97316; margin-right: 4px;"></span>
              <span>পরিকল্পিত (${plannedCount})</span>
            </button>
          </div>

          <!-- Category Selector & Search -->
          <div style="display: flex; items-center; gap: 10px; flex-wrap: wrap; flex-grow: 1; justify-content: flex-end;">
            <select id="th-category-select" style="padding: 7px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; color: #334155;">
              <option value="all" ${categoryFilter === 'all' ? 'selected' : ''}>সকল চিকিৎসা বিভাগ (All Categories)</option>
              <option value="Endodontics" ${categoryFilter === 'Endodontics' ? 'selected' : ''}>Endodontics (রুট ক্যানেল)</option>
              <option value="Prosthodontics" ${categoryFilter === 'Prosthodontics' ? 'selected' : ''}>Prosthodontics (ক্যাপ / কৃত্রিম দাঁত)</option>
              <option value="Periodontics" ${categoryFilter === 'Periodontics' ? 'selected' : ''}>Periodontics (মাড়ি ও স্কেলিং)</option>
              <option value="Restorative" ${categoryFilter === 'Restorative' ? 'selected' : ''}>Restorative (ফিলিং)</option>
              <option value="Oral Surgery" ${categoryFilter === 'Oral Surgery' ? 'selected' : ''}>Oral Surgery (সার্জারি / দাঁত তোলা)</option>
              <option value="Orthodontics" ${categoryFilter === 'Orthodontics' ? 'selected' : ''}>Orthodontics (ব্রেসেস / আঁকাবাঁকা দাঁত)</option>
              <option value="Preventive" ${categoryFilter === 'Preventive' ? 'selected' : ''}>Preventive (প্রতিরোধমূলক)</option>
            </select>

            <input type="text" id="th-search-input" value="${searchQuery}" placeholder="প্রসিডিউর বা দাঁত নং দিয়ে খুঁজুন..." style="padding: 7px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; width: 220px;" />
          </div>

        </div>
      </div>

      <!-- Chronological Cards Grid View -->
      ${filtered.length === 0 ? `
        <div class="kdc-card" style="text-align: center; padding: 48px; color: #64748b;">
          <span class="material-symbols-rounded" style="font-size: 48px; color: #cbd5e1; margin-bottom: 12px;">search_off</span>
          <div style="font-size: 16px; font-weight: 700; color: #334155;">কোনো চিকিৎসা হিস্ট্রি পাওয়া যায়নি</div>
          <div style="font-size: 13.5px; margin-top: 4px;">বর্তমান ফিল্টার পরিবর্তন করুন অথবা নতুন চিকিৎসা যোগ করুন।</div>
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 18px;">
          ${filtered.map(({ item, planDate }, index) => renderProcedureCard(item, planDate, index + 1)).join('')}
        </div>
      `}
    `;

    // Event binding
    container.querySelector('#th-patient-select')?.addEventListener('change', (e) => {
      const pid = (e.target as HTMLSelectElement).value;
      appState.openPatientDetail(pid, 'treatments');
    });

    container.querySelector('#btn-th-print-history')?.addEventListener('click', () => {
      window.print();
    });

    container.querySelectorAll('.btn-th-status-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        statusFilter = btn.getAttribute('data-status') as any;
        renderContent();
      });
    });

    container.querySelector('#th-category-select')?.addEventListener('change', (e) => {
      categoryFilter = (e.target as HTMLSelectElement).value;
      renderContent();
    });

    container.querySelector('#th-search-input')?.addEventListener('input', (e) => {
      searchQuery = (e.target as HTMLInputElement).value;
      renderContent();
    });

    container.querySelectorAll('.btn-th-toggle-status').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-item-id');
        if (itemId) {
          // Find item and update status
          for (const plan of appState.treatmentPlans) {
            const target = plan.items.find(i => i.id === itemId);
            if (target) {
              const nextStatus = target.status === 'planned' ? 'in_progress' : target.status === 'in_progress' ? 'completed' : 'planned';
              target.status = nextStatus;
              appState.saveToStorage();
              appState.showToast(`প্রসিডিউর স্ট্যাটাস আপডেট করা হয়েছে`, 'info');
              renderContent();
              break;
            }
          }
        }
      });
    });
  }

  function renderProcedureCard(item: TreatmentItem, planDate: string, indexNum: number): string {
    const toothLabel = item.toothNumber ? FDI_TOOTH_MAP[item.toothNumber] || `দাঁত #${item.toothNumber}` : 'সাধারণ / ফুল মাউথ';
    
    // Category Badge Color Mapping
    const categoryColors: Record<string, { bg: string; text: string }> = {
      Endodontics: { bg: '#f3e8ff', text: '#7e22ce' },
      Prosthodontics: { bg: '#e0f2fe', text: '#0369a1' },
      Periodontics: { bg: '#dcfce7', text: '#15803d' },
      Restorative: { bg: '#fef3c7', text: '#b45309' },
      'Oral Surgery': { bg: '#ffe4e6', text: '#be123c' },
      Orthodontics: { bg: '#fae8ff', text: '#a21caf' },
      Preventive: { bg: '#ccfbf1', text: '#0f766e' },
    };

    const catStyle = categoryColors[item.category] || { bg: '#f1f5f9', text: '#334155' };
    const netPayable = item.cost - item.discount;

    return `
      <div class="kdc-card" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 4px solid ${
        item.status === 'completed' ? '#10b981' : item.status === 'in_progress' ? '#3b82f6' : '#f97316'
      }; position: relative;">
        
        <div>
          <!-- Card Top Header Row -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="background: #0f172a; color: #fff; font-weight: 800; font-size: 11.5px; padding: 2px 7px; border-radius: 9999px;" class="tabular-nums">
                #${indexNum}
              </span>
              <span style="background: ${catStyle.bg}; color: ${catStyle.text}; padding: 2px 8px; border-radius: 6px; font-size: 11.5px; font-weight: 700;">
                ${item.category}
              </span>
            </div>

            <span class="kdc-status-badge kdc-badge-${item.status}">
              ${item.status === 'completed' ? 'সম্পন্ন' : item.status === 'in_progress' ? 'চলমান' : 'পরিকল্পিত'}
            </span>
          </div>

          <!-- Procedure Title & Tooth Notation -->
          <div style="margin-bottom: 12px;">
            <h4 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; line-height: 1.3;">
              ${item.procedureName}
            </h4>
            
            <div style="display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #475569;">
              <span class="material-symbols-rounded" style="font-size: 16px; color: var(--kdc-teal-primary);">dentistry</span>
              ${item.toothNumber ? `
                <strong style="color: var(--kdc-teal-dark); background: var(--kdc-teal-subtle); padding: 1px 6px; border-radius: 4px;" class="tabular-nums">
                  দাঁত #${item.toothNumber}
                </strong>
                <span>(${toothLabel})</span>
              ` : `
                <span>${toothLabel}</span>
              `}
            </div>
          </div>

          <!-- Date & Cost Overview -->
          <div style="background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 10px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">তারিখ / শিডিউল</div>
              <div class="tabular-nums" style="font-size: 13px; font-weight: 600; color: #334155;">
                ${item.appointmentDate || planDate}
              </div>
            </div>

            <div style="text-align: right;">
              <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">চিকিৎসা ফি</div>
              <div style="font-size: 15px; font-weight: 800; color: var(--kdc-teal-dark);" class="tabular-nums">
                ৳ ${netPayable.toLocaleString()}
                ${item.discount > 0 ? `<span style="font-size: 11px; color: #ef4444; text-decoration: line-through; font-weight: 500;">(৳${item.cost})</span>` : ''}
              </div>
            </div>
          </div>

          <!-- Clinical Remarks Box -->
          ${item.remarks ? `
            <div style="background: #fffbe0; border-left: 3px solid #eab308; padding: 8px 10px; border-radius: 4px; font-size: 12px; color: #713f12; margin-bottom: 12px;">
              <div style="font-weight: 700; margin-bottom: 2px; display: flex; align-items: center; gap: 4px;">
                <span class="material-symbols-rounded" style="font-size: 14px;">notes</span>
                <span>ক্লিনিক্যাল মন্তব্য:</span>
              </div>
              <div>${item.remarks}</div>
            </div>
          ` : ''}

        </div>

        <!-- Card Footer Actions -->
        <div style="display: flex; items-center; justify-content: space-between; border-top: 1px solid #f1f5f9; pt-10; margin-top: 8px; padding-top: 10px;" class="kdc-no-print">
          <button class="kdc-btn kdc-btn-secondary kdc-btn-sm btn-th-toggle-status" data-item-id="${item.id}" title="স্ট্যাটাস পরিবর্তন করুন">
            <span class="material-symbols-rounded" style="font-size: 15px;">published_with_changes</span>
            <span>স্ট্যাটাস চেঞ্জ</span>
          </button>

          <span style="font-size: 11px; color: #94a3b8; font-weight: 600;">
            KDC TREATMENT RECORD
          </span>
        </div>

      </div>
    `;
  }

  renderContent();
  container.querySelector('.btn-back-dashboard')?.addEventListener('click', () => {
    appState.setTab('dashboard');
  });
  return container;
}
