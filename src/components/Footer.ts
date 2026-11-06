import { appState } from '../state';
import { CLINIC_INFO } from '../constants';

export function renderFooter(): HTMLElement {
  const footerContainer = document.createElement('div');
  footerContainer.className = 'kdc-no-print';

  footerContainer.innerHTML = `
    <!-- Top Footer Columns (matches mockup) -->
    <footer class="kdc-footer">
      <div class="kdc-footer-inner">
        <!-- Col 1: আমাদের সম্পর্কে -->
        <div>
          <div class="kdc-footer-col-title">আমাদের সম্পর্কে</div>
          <ul class="kdc-footer-links">
            <li><a id="ft-link-about">ক্লিনিক পরিচিতি</a></li>
            <li><a id="ft-link-doctor">ডাক্তার প্রোফাইল</a></li>
            <li><a id="ft-link-facilities">আধুনিক যন্ত্রপাতি</a></li>
            <li><a id="ft-link-timing">চেম্বার সময়সূচী</a></li>
          </ul>
        </div>

        <!-- Col 2: পপুলার পোস্ট -->
        <div>
          <div class="kdc-footer-col-title">পপুলার পোস্ট</div>
          <ul class="kdc-footer-links">
            <li><a id="ft-link-post1">দাঁত ব্রাশ করার সঠিক নিয়ম</a></li>
            <li><a id="ft-link-post2">রুট ক্যানেল কি আসলেই ব্যথাদায়ক?</a></li>
            <li><a id="ft-link-post3">দাঁতের ক্যাভিটি প্রতিরোধে করণীয়</a></li>
            <li><a id="ft-link-post4">বাচ্চাদের দাঁতের যত্ন ও ফ্লুরাইড</a></li>
          </ul>
        </div>

        <!-- Col 3: প্রাইভেসি পলিসি -->
        <div>
          <div class="kdc-footer-col-title">প্রাইভেসি পলিসি</div>
          <ul class="kdc-footer-links">
            <li><a id="ft-link-privacy">রোগীর তথ্যের গোপনীয়তা</a></li>
            <li><a id="ft-link-data">ডিজিটাল রেকর্ড প্রটেকশন</a></li>
            <li><a id="ft-link-security">ডাটাবেজ এনক্রিপশন</a></li>
          </ul>
        </div>

        <!-- Col 4: টার্মস ও কন্ডিশন -->
        <div>
          <div class="kdc-footer-col-title">টার্মস ও কন্ডিশন</div>
          <ul class="kdc-footer-links">
            <li><a id="ft-link-terms">অ্যাপয়েন্টমেন্ট ক্যান্সেলেশন নিয়মাবলী</a></li>
            <li><a id="ft-link-payment">পেমেন্ট ও রিফান্ড পলিসি</a></li>
            <li><a id="ft-link-consent">চিকিৎসা সম্মতি পত্র (Consent)</a></li>
          </ul>
        </div>
      </div>
    </footer>

    <!-- Bottom Copyright Strip (exact match from mockup) -->
    <div class="kdc-copyright-bar">
      COPYRIGHT ${new Date().getFullYear()} | ${appState.settings.chamberNameEnglish.toUpperCase() || appState.settings.chamberName.toUpperCase()}
    </div>
  `;

  footerContainer.querySelectorAll('.kdc-footer-links a').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      appState.openModal('about_contact');
    });
  });

  return footerContainer;
}
