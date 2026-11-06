import { appState } from '../state';
import { CLINIC_INFO, REMINDER_TEMPLATES } from '../constants';

export function renderRemindersView(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'kdc-reminders-view';

  const queued = appState.reminders.filter(r => r.status === 'queued');
  const sent = appState.reminders.filter(r => r.status === 'sent');

  container.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; flex-wrap: wrap;">
      <div>
        <h2 style="font-size: 24px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
          <span class="material-symbols-rounded" style="color: #25d366; font-size: 28px;">forward_to_inbox</span>
          <span>স্বয়ংক্রিয় অ্যাপয়েন্টমেন্ট রিমাইন্ডার ও পেশেন্ট এনগেজমেন্ট</span>
        </h2>
        <p style="font-size: 14px; color: #64748b;">
          রোগীর উপস্থিতি নিশ্চিত করতে ২৪ ঘণ্টা ও ২ ঘণ্টা পূর্বের অটোমেটেড হোয়াটসঅ্যাপ/এসএমএস রিমাইন্ডার এবং পোস্ট-ট্রিটমেন্ট পরামর্শ।
        </p>
      </div>

      <div style="display: flex; align-items: center; gap: 12px;">
        <button class="kdc-btn kdc-btn-whatsapp" id="btn-batch-send-reminders">
          <span class="material-symbols-rounded">send</span>
          <span>কিউ এর সকল রিমাইন্ডার পাঠান (${queued.length})</span>
        </button>
      </div>
    </div>

    <!-- Quick Stats Metric Strip -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 24px;">
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; display: flex; align-items: center; gap: 12px;">
        <div style="width: 44px; height: 44px; border-radius: 8px; background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center;">
          <span class="material-symbols-rounded">schedule</span>
        </div>
        <div>
          <div style="font-size: 12.5px; color: #64748b;">অপেক্ষমান শিডিউলড</div>
          <div class="tabular-nums" style="font-size: 20px; font-weight: 800; color: #0f172a;">${queued.length} টি</div>
        </div>
      </div>

      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; display: flex; align-items: center; gap: 12px;">
        <div style="width: 44px; height: 44px; border-radius: 8px; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center;">
          <span class="material-symbols-rounded">mark_chat_read</span>
        </div>
        <div>
          <div style="font-size: 12.5px; color: #64748b;">সফলভাবে প্রেরিত</div>
          <div class="tabular-nums" style="font-size: 20px; font-weight: 800; color: #16a34a;">${sent.length} টি</div>
        </div>
      </div>

      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; display: flex; align-items: center; gap: 12px;">
        <div style="width: 44px; height: 44px; border-radius: 8px; background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center;">
          <span class="material-symbols-rounded">published_with_changes</span>
        </div>
        <div>
          <div style="font-size: 12.5px; color: #64748b;">এনগেজমেন্ট রেট</div>
          <div class="tabular-nums" style="font-size: 20px; font-weight: 800; color: #d97706;">৯৮.৪%</div>
        </div>
      </div>
    </div>

    <!-- 2 Column: Reminders Queue Table (Left) + Custom Manual Dispatcher (Right) -->
    <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; align-items: flex-start;">
      
      <!-- Scheduled Reminders Table -->
      <div class="kdc-card">
        <div class="kdc-card-header">
          <div class="kdc-card-title">
            <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">pending_actions</span>
            <span>অটোমেটেড রিমাইন্ডার কিউ ও লগ (${appState.reminders.length} টি)</span>
          </div>
        </div>

        <div class="kdc-table-wrapper">
          <table class="kdc-table">
            <thead>
              <tr>
                <th>রোগীর তথ্য</th>
                <th>রিমাইন্ডারের ধরন</th>
                <th>শিডিউল সময়</th>
                <th>স্ট্যাটাস</th>
                <th>সরাসরি পাঠান</th>
              </tr>
            </thead>
            <tbody>
              ${appState.reminders.map(rem => `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: #0f172a;">${rem.patientName}</div>
                    <div class="tabular-nums" style="font-size: 12px; color: #64748b;">${rem.patientPhone}</div>
                  </td>
                  <td>
                    <span style="font-size: 12.5px; font-weight: 600; color: #334155;">${getReminderTypeLabel(rem.type)}</span>
                    <div style="font-size: 11px; color: #64748b; margin-top: 2px; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      ${rem.messageText}
                    </div>
                  </td>
                  <td>
                    <div class="tabular-nums" style="font-size: 12px; color: #475569;">${rem.scheduledFor}</div>
                    ${rem.sentAt ? `<div class="tabular-nums" style="font-size: 11px; color: #16a34a;">প্রেরিত: ${rem.sentAt}</div>` : ''}
                  </td>
                  <td>
                    <span class="kdc-status-badge ${rem.status === 'sent' ? 'kdc-badge-confirmed' : 'kdc-badge-pending'}">
                      ${rem.status === 'sent' ? 'প্রেরিত' : 'কিউতে আছে'}
                    </span>
                  </td>
                  <td>
                    <button class="kdc-btn kdc-btn-whatsapp kdc-btn-sm btn-dispatch-single-rem" data-id="${rem.id}" data-phone="${rem.patientPhone}" data-text="${encodeURIComponent(rem.messageText)}" title="হোয়াটসঅ্যাপে পাঠান">
                      <span class="material-symbols-rounded" style="font-size: 16px;">chat</span>
                      <span>পাঠান</span>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Template Trigger & Custom Message Box -->
      <div class="kdc-card">
        <div class="kdc-card-header">
          <div class="kdc-card-title">
            <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">sms</span>
            <span>কাস্টম নোটিফিকেশন / পোস্ট-কেয়ার প্রেরক</span>
          </div>
        </div>

        <form id="form-manual-reminder" style="display: flex; flex-direction: column; gap: 12px; font-size: 13.5px;">
          <div>
            <label style="font-weight: 600; display: block; margin-bottom: 4px;">প্রাপক রোগী বাছাই করুন:</label>
            <select id="in-manual-patient-select" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
              ${appState.patients.map(p => `
                <option value="${p.phone}" data-name="${p.name}">${p.name} (${p.phone})</option>
              `).join('')}
            </select>
          </div>

          <div>
            <label style="font-weight: 600; display: block; margin-bottom: 4px;">টেমপ্লেট নির্বাচন করুন:</label>
            <select id="in-manual-template-select" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
              <option value="upcoming24h">২৪ ঘণ্টা পূর্বের রিমাইন্ডার</option>
              <option value="upcoming2h">২ ঘণ্টা পূর্বের জরুরি অ্যালার্ট</option>
              <option value="postOp">চিকিৎসা পরবর্তী যত্ন ও পরামর্শ (Post-Op Care)</option>
              <option value="scaling">৬ মাস পর রুটিন ডেন্টাল স্কেলিং রিকল</option>
            </select>
          </div>

          <div>
            <label style="font-weight: 600; display: block; margin-bottom: 4px;">বার্তার বিষয়বস্তু (Message Content):</label>
            <textarea id="in-manual-msg-text" rows="5" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;"></textarea>
          </div>

          <div style="display: flex; gap: 10px;">
            <button type="submit" class="kdc-btn kdc-btn-whatsapp" style="flex: 1; padding: 10px;">
              <span class="material-symbols-rounded">chat</span>
              <span>হোয়াটসঅ্যাপে তাৎক্ষণিক পাঠান</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  `;

  function getReminderTypeLabel(t: string) {
    switch (t) {
      case 'appointment_confirm': return 'বুকিং নিশ্চিতকরণ';
      case 'upcoming_24h': return '২৪ ঘণ্টা পূর্বের নোটিশ';
      case 'upcoming_2h': return '২ ঘণ্টা পূর্বের অ্যালার্ট';
      case 'post_op_care': return 'চিকিৎসা পরবর্তী যত্ন';
      case 'routine_6m': return '৬ মাসের রুটিন রিকল';
      default: return t;
    }
  }

  // Auto-fill template text
  const templateSel = container.querySelector('#in-manual-template-select') as HTMLSelectElement;
  const patientSel = container.querySelector('#in-manual-patient-select') as HTMLSelectElement;
  const msgText = container.querySelector('#in-manual-msg-text') as HTMLTextAreaElement;

  function updateTemplateText() {
    const pOption = patientSel.selectedOptions[0];
    const name = pOption?.getAttribute('data-name') || 'রোগী';
    const val = templateSel.value;
    if (val === 'upcoming24h') {
      msgText.value = REMINDER_TEMPLATES.upcoming24h(name, 'বিকাল ৫:০০');
    } else if (val === 'upcoming2h') {
      msgText.value = REMINDER_TEMPLATES.upcoming2h(name, 'বিকাল ৫:০০');
    } else if (val === 'postOp') {
      msgText.value = REMINDER_TEMPLATES.postOpCare(name, 'রুট ক্যানেল থেরাপি');
    } else {
      msgText.value = REMINDER_TEMPLATES.routine6m(name);
    }
  }

  templateSel?.addEventListener('change', updateTemplateText);
  patientSel?.addEventListener('change', updateTemplateText);
  updateTemplateText();

  // Handlers
  container.querySelector('#btn-batch-send-reminders')?.addEventListener('click', () => {
    appState.triggerSimulatedReminders();
  });

  container.querySelectorAll('.btn-dispatch-single-rem').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id') || '';
      const phone = btn.getAttribute('data-phone') || '';
      const text = decodeURIComponent(btn.getAttribute('data-text') || '');
      appState.sendWhatsAppReminder(phone, text, id);
    });
  });

  const manualForm = container.querySelector('#form-manual-reminder');
  manualForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = patientSel.value;
    const text = msgText.value;
    appState.sendWhatsAppReminder(phone, text);
  });

  return container;
}
