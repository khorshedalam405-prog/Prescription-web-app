import { appState } from '../state';
import { CLINIC_INFO } from '../constants';
import { Prescription, PrescribedMedicine } from '../types';

export function renderPrescriptionView(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'kdc-prescription-view';

  const rx = appState.activePrescription;

  container.innerHTML = `
    <!-- Top Back Bar -->
    <div class="kdc-no-print" style="margin-bottom: 12px;">
      <button class="kdc-btn kdc-btn-secondary kdc-btn-sm btn-back-dashboard" style="display: inline-flex; align-items: center; gap: 6px;">
        <span class="material-symbols-rounded" style="font-size: 18px;">arrow_back</span>
        <span>হোম ড্যাশবোর্ডে ফিরে যান</span>
      </button>
    </div>

    <!-- Top Action Bar (hidden on print) -->
    <div class="kdc-no-print" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; flex-wrap: wrap;">
      <div>
        <h2 style="font-size: 24px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
          <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary); font-size: 28px;">prescriptions</span>
          <span>ডিজিটাল প্রেসক্রিপশন ও A4 সাইজ প্রিন্ট</span>
        </h2>
        <p style="font-size: 14px; color: #64748b;">
          রোগীর জন্য সরাসরি প্রেসক্রিপশন লিখুন এবং একটি ক্লিকে অফিসিয়াল A4 সাইজে পেপারে প্রিন্ট বা PDF ডাউনলোড করুন।
        </p>
      </div>

      <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        <button class="kdc-btn kdc-btn-secondary" id="btn-new-rx-draft">
          <span class="material-symbols-rounded">edit_document</span>
          <span>নতুন প্রেসক্রিপশন ড্রাফট</span>
        </button>

        <button class="kdc-btn kdc-btn-secondary" id="btn-toggle-editor">
          <span class="material-symbols-rounded">tune</span>
          <span id="btn-toggle-editor-text">এডিটর প্যানেল লুকান</span>
        </button>

        <button class="kdc-btn kdc-btn-secondary" id="btn-print-preview-mode" style="border-color: var(--kdc-teal-primary); color: var(--kdc-teal-dark); font-weight: 700; background: var(--kdc-teal-subtle);" title="সব UI লুকিয়ে শুধু A4 পেপার প্রিভিউ দেখুন ও অটোমেটিক প্রিন্ট ডায়ালগ খুলুন">
          <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">visibility</span>
          <span>প্রিন্ট প্রিভিউ মোড (Print Preview)</span>
        </button>

        <button class="kdc-btn kdc-btn-primary" id="btn-print-a4" style="font-size: 15px; padding: 10px 22px; box-shadow: 0 4px 14px rgba(14, 131, 136, 0.3);">
          <span class="material-symbols-rounded" style="font-size: 20px;">print</span>
          <strong>A4 সাইজ প্রিন্ট করুন (Print A4)</strong>
        </button>
      </div>
    </div>

    <!-- Mobile View Switcher (Editor vs A4 Print Preview) -->
    <div class="kdc-mobile-rx-switcher kdc-no-print">
      <button class="kdc-mobile-rx-btn ${appState.prescriptionMobileTab === 'editor' ? 'active' : ''}" id="btn-mobile-rx-editor">
        <span class="material-symbols-rounded">edit_note</span>
        <span>প্রেসক্রিপশন এডিটর (ইনপুট)</span>
      </button>
      <button class="kdc-mobile-rx-btn ${appState.prescriptionMobileTab === 'preview' ? 'active' : ''}" id="btn-mobile-rx-preview">
        <span class="material-symbols-rounded">visibility</span>
        <span>A4 প্রিন্ট পেপার প্রিভিউ</span>
      </button>
    </div>

    <!-- Layout Grid: Left Editor (collapsible) + Right/Center Live A4 Sheet Preview -->
    <div class="kdc-rx-layout-grid mobile-show-${appState.prescriptionMobileTab}" id="kdc-rx-layout-grid">
      
      <!-- ================= EDIT FORM (COLLAPSIBLE) ================= -->
      <div class="kdc-card kdc-no-print kdc-rx-editor-column" id="kdc-rx-editor-card" style="font-size: 13.5px;">
        <div class="kdc-card-header">
          <div class="kdc-card-title">
            <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">edit_note</span>
            <span>প্রেসক্রিপশন এডিটর (ডাটা ইনপুট)</span>
          </div>
          <span class="tabular-nums" style="font-weight: 700; color: #0284c7;">#${rx.rxNumber}</span>
        </div>

        <form id="rx-edit-form" style="display: flex; flex-direction: column; gap: 14px;">
          <!-- Patient Meta Fields -->
          <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 10px;">
            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 4px;">রোগীর নাম *</label>
              <input type="text" id="rx-in-patient-name" value="${rx.patientName}" required style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 4px;">বয়স</label>
              <input type="number" id="rx-in-patient-age" value="${rx.patientAge}" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 4px;">লিঙ্গ</label>
              <select id="rx-in-patient-gender" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
                <option value="male" ${rx.patientGender === 'male' ? 'selected' : ''}>পুরুষ</option>
                <option value="female" ${rx.patientGender === 'female' ? 'selected' : ''}>মহিলা</option>
                <option value="other" ${rx.patientGender === 'other' ? 'selected' : ''}>অন্যান্য</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 4px;">মোবাইল নম্বর</label>
              <input type="text" id="rx-in-patient-phone" value="${rx.patientPhone}" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 4px;">তারিখ</label>
              <input type="date" id="rx-in-date" value="${rx.date}" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 4px;">ব্লাড প্রেশার (BP)</label>
              <input type="text" id="rx-in-bp" value="${rx.vitals.bp || '120/80 mmHg'}" placeholder="120/80 mmHg" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
          </div>

          <!-- Clinical History Inputs -->
          <div>
            <label style="font-weight: 600; display: block; margin-bottom: 4px;">প্রধান সমস্যা / উপসর্গ (Chief Complaints - C/C)</label>
            <textarea id="rx-in-cc" rows="2" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;">${rx.chiefComplaints.join('\n')}</textarea>
            <div style="font-size: 11.5px; color: #64748b; margin-top: 2px;">প্রতি লাইনে একটি করে উপসর্গ লিখুন।</div>
          </div>

          <div>
            <label style="font-weight: 600; display: block; margin-bottom: 4px;">ক্লিনিক্যাল ফাইন্ডিংস (On Examination - O/E)</label>
            <textarea id="rx-in-oe" rows="2" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;">${rx.clinicalFindings.join('\n')}</textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 4px;">রোগ নির্ণয় (Diagnosis - Dx)</label>
              <input type="text" id="rx-in-dx" value="${rx.diagnosis}" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
            <div>
              <label style="font-weight: 600; display: block; margin-bottom: 4px;">এক্স-রে ও পরীক্ষা (Investigations)</label>
              <input type="text" id="rx-in-inv" value="${rx.investigations.join(', ')}" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
          </div>

          <!-- Quick Medicine Prescribing Row -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-top: 6px;">
            <div style="font-weight: 700; color: var(--kdc-teal-dark); margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
              <span>+ দ্রুত ঔষধ যুক্ত করুন</span>
              <span style="font-size: 12px; color: #64748b;">(ডাটাবেজ থেকে)</span>
            </div>
            
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <select id="rx-quick-med-select" style="flex: 1; min-width: 180px; padding: 6px 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                <option value="">ঔষধ বাছাই করুন...</option>
                ${appState.medicines.map(m => `
                  <option value="${m.id}">${m.type} ${m.brandName} (${m.strength}) - ${m.genericName}</option>
                `).join('')}
              </select>

              <button type="button" class="kdc-btn kdc-btn-primary kdc-btn-sm" id="btn-add-selected-med">
                <span class="material-symbols-rounded">add</span>
                <span>যুক্ত করুন</span>
              </button>
            </div>
          </div>

          <!-- Prescribed Medicines Current List -->
          <div>
            <label style="font-weight: 700; display: block; margin-bottom: 6px; color: #0f172a;">বর্তমান নির্দেশিত ঔষধ তালিকা (${rx.medicines.length} টি):</label>
            <div id="rx-meds-editor-list" style="display: flex; flex-direction: column; gap: 6px;">
              ${rx.medicines.map((m, idx) => `
                <div style="padding: 8px 10px; background: #fff; border: 1px solid #cbd5e1; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                  <div>
                    <strong>${idx + 1}. ${m.type} ${m.brandName}</strong> <span style="color: #64748b;">(${m.strength})</span>
                    <div style="font-size: 12px; color: #0f172a; margin-top: 2px;">
                      ডোজ: <span style="font-weight: 700; color: var(--kdc-teal-primary);">${m.dosage}</span> · ${m.mealTiming} · ${m.duration}
                    </div>
                  </div>
                  <button type="button" class="kdc-btn kdc-btn-danger kdc-btn-sm btn-delete-rx-med" data-index="${idx}" title="মুছে ফেলুন">
                    <span class="material-symbols-rounded" style="font-size: 16px;">delete</span>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Advices Checklist -->
          <div>
            <label style="font-weight: 600; display: block; margin-bottom: 4px;">পরামর্শ ও উপদেশ (Advices)</label>
            <textarea id="rx-in-advices" rows="3" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;">${rx.advices.join('\n')}</textarea>
          </div>

          <div>
            <label style="font-weight: 600; display: block; margin-bottom: 4px;">পরবর্তী সাক্ষাৎ (Next Visit)</label>
            <input type="text" id="rx-in-next-visit" value="${rx.nextVisit || '৭ দিন পর চেকআপের জন্য আসবেন'}" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
          </div>

          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button type="submit" class="kdc-btn kdc-btn-primary" style="flex: 1;">
              <span class="material-symbols-rounded">save</span>
              <span>প্রেসক্রিপশন ডাটা আপডেট করুন</span>
            </button>
          </div>
        </form>
      </div>

      <!-- ================= OFFICIAL A4 PRINT SHEET (PIXEL PERFECT & FULLY CUSTOMIZABLE) ================= -->
      <div class="kdc-rx-preview-column" style="overflow-x: auto; display: flex; justify-content: center; width: 100%;">
        <div class="kdc-a4-prescription-sheet" id="kdc-printable-a4-sheet" style="font-family: 'Google Sans', 'SolaimanLipi', sans-serif;">
          
          ${appState.settings.rxHeaderStyle === 'image_template' ? `
            <!-- Sheet Header Top (Exact Layout from Uploaded Image) -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 8px;">
              <!-- Left Column: Doctor Info -->
              <div style="flex: 1;">
                <h1 style="font-size: 26px; font-weight: 800; color: #0e8388; margin: 0; line-height: 1.2;">
                  ${appState.settings.doctorName}
                </h1>
                <div style="font-size: 16px; font-weight: 700; color: #0e8388; margin-top: 4px;">
                  ${appState.settings.doctorDegree}
                </div>
              </div>

              <!-- Right Column: Chamber Info with Pill Badge -->
              <div style="text-align: center; flex: 1.2;">
                <div style="display: inline-block; background: #0e8388; color: #ffffff; font-weight: 700; font-size: 13px; padding: 2px 22px; border-radius: 9999px; margin-bottom: 4px;">
                  চেম্বার
                </div>
                <h2 style="font-size: 26px; font-weight: 800; color: #0e8388; margin: 0; line-height: 1.2;">
                  ${appState.settings.chamberName}
                </h2>
                <div style="font-size: 12.5px; font-weight: 600; color: #0e8388; margin-top: 4px; line-height: 1.45;">
                  ${appState.settings.chamberAddress.split(',').map(line => `<div>${line.trim()}</div>`).join('')}
                  <div style="font-weight: 800; font-size: 13.5px; margin-top: 2px;">${appState.settings.phone}</div>
                </div>
              </div>
            </div>

            <!-- Top Header Horizontal Divider -->
            <div style="border-bottom: 2px solid #0e8388; margin: 4px 0 6px 0;"></div>

            <!-- Patient Meta Bar (Exact Labeling from Image) -->
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 16px; font-weight: 800; color: #0e8388; padding: 4px 0;">
              <div>নামঃ <span style="font-weight: 600; color: #0f172a;">${rx.patientName || '...........................................'}</span></div>
              <div>বয়সঃ <span style="font-weight: 600; color: #0f172a;">${rx.patientAge ? rx.patientAge + ' বছর' : '...............'}</span></div>
              <div>তারিখঃ <span style="font-weight: 600; color: #0f172a;">${rx.date}</span></div>
            </div>

            <!-- Meta Horizontal Divider -->
            <div style="border-bottom: 2px solid #0e8388; margin: 6px 0 12px 0;"></div>

            <!-- Sheet Body (Left Clinical Notes + Right Rx Medicines) -->
            <div class="kdc-rx-body" style="min-height: 580px;">
              
              <!-- Left Column: H/O, O/E, Adv -->
              <div class="kdc-rx-left-notes" style="width: 28%; border-right: 2px solid #0e8388; padding-right: 12px; gap: 16px;">
                <div>
                  <div style="font-size: 16px; font-weight: 800; color: #0e8388; margin-bottom: 4px;">${appState.settings.rxLeftColHeader1}</div>
                  <ul style="padding-left: 14px; margin: 0; line-height: 1.45; font-size: 13px; color: #1e293b;">
                    ${rx.chiefComplaints.map(cc => `<li>${cc}</li>`).join('')}
                  </ul>
                </div>

                <div>
                  <div style="font-size: 16px; font-weight: 800; color: #0e8388; margin-bottom: 4px;">${appState.settings.rxLeftColHeader2}</div>
                  <ul style="padding-left: 14px; margin: 0; line-height: 1.45; font-size: 13px; color: #1e293b;">
                    ${rx.clinicalFindings.map(oe => `<li>${oe}</li>`).join('')}
                  </ul>
                </div>

                <div>
                  <div style="font-size: 16px; font-weight: 800; color: #0e8388; margin-bottom: 4px;">${appState.settings.rxLeftColHeader3}</div>
                  <ul style="padding-left: 14px; margin: 0; line-height: 1.45; font-size: 13px; color: #1e293b;">
                    ${rx.advices.map(adv => `<li>${adv}</li>`).join('')}
                    ${rx.investigations.map(inv => `<li>${inv}</li>`).join('')}
                  </ul>
                </div>

                ${appState.settings.rxShowToothChartNote ? `
                  <div style="margin-top: auto; border: 1px dashed #0e8388; border-radius: 4px; padding: 6px; text-align: center; font-size: 11px;">
                    18 17 16 15 14 13 12 11 | 21 22 23 24 25 26 27 28<br>
                    48 47 46 45 44 43 42 41 | 31 32 33 34 35 36 37 38
                  </div>
                ` : ''}
              </div>

              <!-- Right Column: ℞ Medicine List & Instructions -->
              <div class="kdc-rx-right-prescriptions" style="flex: 1; padding-left: 16px;">
                <div style="font-size: 34px; font-weight: 800; color: #0e8388; margin-bottom: 12px; font-family: serif; line-height: 1;">℞</div>

                <table class="kdc-rx-med-table">
                  <thead>
                    <tr>
                      <th style="width: 45%;">ঔষধের নাম ও স্ট্রেন্থ</th>
                      <th style="width: 30%;">ডোজ ও সময়সূচী</th>
                      <th style="width: 25%;">মেয়াদ</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rx.medicines.map((m, idx) => `
                      <tr>
                        <td>
                          <strong style="color: #0f172a; font-size: 14px;">${idx + 1}. ${m.type} ${m.brandName}</strong> 
                          <span style="font-size: 12px; color: #475569;">${m.strength}</span>
                          ${m.genericName ? `<div style="font-size: 11px; color: #64748b; font-style: italic;">(${m.genericName})</div>` : ''}
                          ${m.instructions ? `<div style="font-size: 11px; color: var(--kdc-teal-dark); margin-top: 2px;">• ${m.instructions}</div>` : ''}
                        </td>
                        <td>
                          <span style="font-weight: 700; color: #0f172a; font-size: 14px;">${m.dosage}</span>
                          <div style="font-size: 11.5px; color: #475569;">${m.mealTiming}</div>
                        </td>
                        <td>
                          <strong style="color: #0f172a;">${m.duration}</strong>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

            </div>

            <!-- Footer Bottom Box (Exact Design from Uploaded Image) -->
            <div style="margin-top: auto; border-top: 2px solid #0e8388; background: #e0f2f1; padding: 14px 20px; display: flex; align-items: center; justify-content: flex-end;">
              <div style="font-size: 20px; font-weight: 800; color: #0e8388; display: flex; align-items: center; gap: 8px;">
                <span style="border-bottom: 2px dashed #0e8388; width: 200px; display: inline-block;"></span>
                <span>${rx.nextVisit ? rx.nextVisit : appState.settings.rxNextVisitText}</span>
              </div>
            </div>

          ` : `

            <!-- Modern Digital Layout -->
            <div class="kdc-rx-header-top">
              <div class="kdc-rx-doctor-info">
                <h2>${appState.settings.doctorName}</h2>
                <p style="font-weight: 600; color: #1e293b;">${appState.settings.doctorDegree}</p>
                <p style="color: var(--kdc-teal-primary); font-weight: 700;">${appState.settings.doctorDesignation}</p>
                <p style="font-size: 11.5px; color: #64748b;">${appState.settings.bmdcRegNo}</p>
              </div>

              <div class="kdc-rx-clinic-info">
                <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px; margin-bottom: 2px;">
                  ${appState.settings.rxShowLogo ? `
                    <svg width="28" height="28" viewBox="0 0 100 90" fill="none">
                      <path d="M50 8C32 8 20 20 20 38C20 54 26 62 34 82C37 89 45 88 47 80C49 72 50 64 50 64C50 64 51 72 53 80C55 88 63 89 66 82C74 62 80 54 80 38C80 20 68 8 50 8Z" fill="#0e8388"/>
                      <path d="M50 14C35 14 26 24 26 40C26 52 31 60 38 77C40 81 44 80 45 74C47 67 48 58 50 58C52 58 53 67 55 74C56 80 60 81 62 77C69 60 74 52 74 40C74 24 65 14 50 14Z" fill="#ffffff"/>
                    </svg>
                  ` : ''}
                  <div class="kdc-rx-clinic-name">${appState.settings.chamberName}</div>
                </div>
                <div class="kdc-rx-clinic-tagline">${appState.settings.tagline}</div>
                <p style="font-size: 11px; color: #475569; max-width: 250px;">
                  ${appState.settings.chamberAddress}<br>
                  হটলাইন: ${appState.settings.phone}
                </p>
              </div>
            </div>

            <!-- Patient Meta Bar -->
            <div class="kdc-rx-patient-bar">
              <div><strong>রোগীর নাম:</strong> ${rx.patientName || '................................'}</div>
              <div><strong>বয়স:</strong> ${rx.patientAge} বছর</div>
              <div><strong>লিঙ্গ:</strong> ${rx.patientGender === 'female' ? 'মহিলা' : 'পুরুষ'}</div>
              <div><strong>তারিখ:</strong> <span class="tabular-nums">${rx.date}</span></div>
              <div><strong>Rx নং:</strong> <span class="tabular-nums" style="font-weight: 700;">${rx.rxNumber}</span></div>
            </div>

            <!-- Vitals Sub-strip -->
            <div style="display: flex; gap: 20px; font-size: 11px; color: #64748b; margin-top: -8px; margin-bottom: 12px; padding: 0 4px;">
              <span>BP: <strong>${rx.vitals.bp || '120/80 mmHg'}</strong></span>
              <span>Pulse: <strong>${rx.vitals.pulse || '74 bpm'}</strong></span>
              <span>ফোন: <strong class="tabular-nums">${rx.patientPhone || 'N/A'}</strong></span>
            </div>

            <!-- Sheet Body -->
            <div class="kdc-rx-body">
              <div class="kdc-rx-left-notes">
                <div>
                  <div class="kdc-rx-notes-title">${appState.settings.rxLeftColHeader1}</div>
                  <ul style="padding-left: 14px; margin: 0; line-height: 1.4;">
                    ${rx.chiefComplaints.map(cc => `<li>${cc}</li>`).join('')}
                  </ul>
                </div>

                <div>
                  <div class="kdc-rx-notes-title">${appState.settings.rxLeftColHeader2}</div>
                  <ul style="padding-left: 14px; margin: 0; line-height: 1.4;">
                    ${rx.clinicalFindings.map(oe => `<li>${oe}</li>`).join('')}
                  </ul>
                </div>

                <div>
                  <div class="kdc-rx-notes-title">${appState.settings.rxLeftColHeader3}</div>
                  <ul style="padding-left: 14px; margin: 0; line-height: 1.4;">
                    ${rx.advices.map(adv => `<li>${adv}</li>`).join('')}
                  </ul>
                </div>

                ${appState.settings.rxShowToothChartNote ? `
                  <div style="margin-top: auto; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 8px; text-align: center; background: #fafafa;">
                    <div style="font-size: 10px; font-weight: 700; color: var(--kdc-teal-primary); margin-bottom: 4px;">FDI TOOTH CHART NOTE</div>
                    <div style="font-size: 12px; font-family: monospace; font-weight: bold; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px;">
                      18 17 16 15 14 13 12 11 | 21 22 23 24 25 26 27 28
                    </div>
                    <div style="font-size: 12px; font-family: monospace; font-weight: bold; padding-top: 2px;">
                      48 47 46 45 44 43 42 41 | 31 32 33 34 35 36 37 38
                    </div>
                  </div>
                ` : ''}
              </div>

              <div class="kdc-rx-right-prescriptions">
                <div class="kdc-rx-symbol">℞</div>
                <table class="kdc-rx-med-table">
                  <thead>
                    <tr>
                      <th style="width: 45%;">ঔষধের নাম ও স্ট্রেন্থ</th>
                      <th style="width: 30%;">ডোজ ও সময়সূচী</th>
                      <th style="width: 25%;">মেয়াদ</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rx.medicines.map((m, idx) => `
                      <tr>
                        <td>
                          <strong style="color: #0f172a; font-size: 13.5px;">${idx + 1}. ${m.type} ${m.brandName}</strong> 
                          <span style="font-size: 12px; color: #475569;">${m.strength}</span>
                          ${m.genericName ? `<div style="font-size: 11px; color: #64748b; font-style: italic;">(${m.genericName})</div>` : ''}
                          ${m.instructions ? `<div style="font-size: 11px; color: var(--kdc-teal-dark); margin-top: 2px;">• ${m.instructions}</div>` : ''}
                        </td>
                        <td>
                          <span style="font-weight: 700; color: #0f172a; font-size: 14px;">${m.dosage}</span>
                          <div style="font-size: 11.5px; color: #475569;">${m.mealTiming}</div>
                        </td>
                        <td>
                          <strong style="color: #0f172a;">${m.duration}</strong>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Footer Bottom -->
            <div class="kdc-rx-footer-bottom">
              <div>
                <div style="font-weight: 700; color: var(--kdc-teal-primary); font-size: 12px;">${appState.settings.chamberName}</div>
                <div>জরুরি হেল্পলাইন: ${appState.settings.phone}</div>
              </div>
              <div style="text-align: center;">
                <div class="kdc-rx-signature-line">
                  ${appState.settings.doctorName}<br>
                  <span style="font-size: 9.5px; font-weight: normal; color: #64748b;">${appState.settings.doctorDegree}</span>
                </div>
              </div>
            </div>

          `}

        </div>
      </div>

    </div>
  `;

  // --- Handlers ---
  container.querySelector('.btn-back-dashboard')?.addEventListener('click', () => {
    appState.setTab('dashboard');
  });

  const printBtn = container.querySelector('#btn-print-a4');
  printBtn?.addEventListener('click', () => {
    window.print();
  });

  const newDraftBtn = container.querySelector('#btn-new-rx-draft');
  newDraftBtn?.addEventListener('click', () => {
    appState.createNewBlankPrescription();
  });

  const toggleEditorBtn = container.querySelector('#btn-toggle-editor');
  const editorCard = container.querySelector('#kdc-rx-editor-card') as HTMLElement;
  const layoutGrid = container.querySelector('#kdc-rx-layout-grid') as HTMLElement;
  const toggleText = container.querySelector('#btn-toggle-editor-text') as HTMLElement;

  // Mobile Switcher Tabs
  container.querySelector('#btn-mobile-rx-editor')?.addEventListener('click', () => {
    appState.setPrescriptionMobileTab('editor');
  });

  container.querySelector('#btn-mobile-rx-preview')?.addEventListener('click', () => {
    appState.setPrescriptionMobileTab('preview');
  });

  let editorVisible = true;
  toggleEditorBtn?.addEventListener('click', () => {
    editorVisible = !editorVisible;
    if (editorCard && layoutGrid) {
      if (editorVisible) {
        editorCard.style.display = 'block';
        layoutGrid.style.gridTemplateColumns = '1fr 1.25fr';
        toggleText.textContent = 'এডিটর প্যানেল লুকান';
      } else {
        editorCard.style.display = 'none';
        layoutGrid.style.gridTemplateColumns = '1fr';
        toggleText.textContent = 'এডিটর প্যানেল দেখান';
      }
    }
  });

  // Print A4 Direct Button
  container.querySelector('#btn-print-a4')?.addEventListener('click', () => {
    window.print();
  });

  // Print Preview Mode Button (hides all UI elements & auto-triggers print)
  container.querySelector('#btn-print-preview-mode')?.addEventListener('click', () => {
    enterPrintPreviewMode();
  });

  function enterPrintPreviewMode() {
    document.body.classList.add('kdc-print-preview-active');

    let floatingBar = document.getElementById('kdc-print-preview-floating-bar');
    if (!floatingBar) {
      floatingBar = document.createElement('div');
      floatingBar.id = 'kdc-print-preview-floating-bar';
      floatingBar.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background: #0f172a; color: #fff; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,0.3);';
      floatingBar.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 15px;">
          <span class="material-symbols-rounded" style="color: #38bdf8;">visibility</span>
          <span>A4 প্রিন্ট প্রিভিউ মোড (অন্যান্য সব UI লুকায়িত)</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="kdc-btn kdc-btn-primary" id="btn-floating-print-now" style="background: #0284c7; padding: 6px 14px; font-size: 13.5px;">
            <span class="material-symbols-rounded" style="font-size: 18px;">print</span>
            <span>প্রিন্ট করুন (Print)</span>
          </button>
          <button class="kdc-btn kdc-btn-secondary" id="btn-floating-exit-preview" style="background: #334155; color: #fff; border: none; padding: 6px 14px; font-size: 13.5px;">
            <span class="material-symbols-rounded" style="font-size: 18px;">arrow_back</span>
            <span>প্রিভিউ বন্ধ করুন (Exit)</span>
          </button>
        </div>
      `;
      document.body.appendChild(floatingBar);

      floatingBar.querySelector('#btn-floating-print-now')?.addEventListener('click', () => {
        window.print();
      });

      floatingBar.querySelector('#btn-floating-exit-preview')?.addEventListener('click', () => {
        exitPrintPreviewMode();
      });
    } else {
      floatingBar.style.display = 'flex';
    }

    // Automatically trigger browser print dialog after short delay
    setTimeout(() => {
      window.print();
    }, 150);
  }

  function exitPrintPreviewMode() {
    document.body.classList.remove('kdc-print-preview-active');
    const floatingBar = document.getElementById('kdc-print-preview-floating-bar');
    if (floatingBar) {
      floatingBar.style.display = 'none';
    }
  }

  // Quick Medicine Add Button
  const addMedBtn = container.querySelector('#btn-add-selected-med');
  const medSelect = container.querySelector('#rx-quick-med-select') as HTMLSelectElement;

  addMedBtn?.addEventListener('click', () => {
    const medId = medSelect.value;
    if (!medId) return;
    const foundMed = appState.medicines.find(m => m.id === medId);
    if (!foundMed) return;

    const newMed: PrescribedMedicine = {
      id: `m_${Date.now()}`,
      type: foundMed.type,
      brandName: foundMed.brandName,
      genericName: foundMed.genericName,
      strength: foundMed.strength,
      dosage: foundMed.commonDosage,
      mealTiming: foundMed.defaultTiming,
      duration: foundMed.defaultDuration,
      instructions: foundMed.category === 'Mouthwash' ? '১০ মি.লি. দিয়ে ১ মিনিট কুলি করে ফেলে দেবেন' : '',
    };

    rx.medicines.push(newMed);
    appState.savePrescription(rx);
  });

  // Delete Medicine row
  container.querySelectorAll('.btn-delete-rx-med').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index') || '-1', 10);
      if (idx >= 0 && idx < rx.medicines.length) {
        rx.medicines.splice(idx, 1);
        appState.savePrescription(rx);
      }
    });
  });

  // Form submission
  const editForm = container.querySelector('#rx-edit-form');
  editForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const pName = (container.querySelector('#rx-in-patient-name') as HTMLInputElement).value;
    const pAge = parseInt((container.querySelector('#rx-in-patient-age') as HTMLInputElement).value || '25', 10);
    const pGender = (container.querySelector('#rx-in-patient-gender') as HTMLSelectElement).value as any;
    const pPhone = (container.querySelector('#rx-in-patient-phone') as HTMLInputElement).value;
    const date = (container.querySelector('#rx-in-date') as HTMLInputElement).value;
    const bp = (container.querySelector('#rx-in-bp') as HTMLInputElement).value;
    const cc = (container.querySelector('#rx-in-cc') as HTMLTextAreaElement).value.split('\n').filter(Boolean);
    const oe = (container.querySelector('#rx-in-oe') as HTMLTextAreaElement).value.split('\n').filter(Boolean);
    const dx = (container.querySelector('#rx-in-dx') as HTMLInputElement).value;
    const inv = (container.querySelector('#rx-in-inv') as HTMLInputElement).value.split(',').map(s => s.trim()).filter(Boolean);
    const advices = (container.querySelector('#rx-in-advices') as HTMLTextAreaElement).value.split('\n').filter(Boolean);
    const nextVisit = (container.querySelector('#rx-in-next-visit') as HTMLInputElement).value;

    rx.patientName = pName;
    rx.patientAge = pAge;
    rx.patientGender = pGender;
    rx.patientPhone = pPhone;
    rx.date = date;
    rx.vitals.bp = bp;
    rx.chiefComplaints = cc;
    rx.clinicalFindings = oe;
    rx.diagnosis = dx;
    rx.investigations = inv;
    rx.advices = advices;
    rx.nextVisit = nextVisit;

    appState.savePrescription(rx);
  });

  return container;
}
