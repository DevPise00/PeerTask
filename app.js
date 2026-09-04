/* =====================================================================
   PeerTask — Frontend Application Logic
   Modular ES6+ vanilla JavaScript. Persists state in localStorage.
   Designed to swap localStorage with Spring Boot REST endpoints easily.
   ===================================================================== */

const LS_KEYS = {
  skills: 'peertask.skills',
  bookings: 'peertask.bookings',
  stats: 'peertask.userStats',
  user: 'peertask.user'
};

/* ----------------- State Store ----------------- */
const Store = (() => {
  const load = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn('Failed to load', key, e);
      return fallback;
    }
  };
  const save = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.warn('Failed to save', key, e); }
  };

  const seed = () => {
    const now = new Date();
    const sampleSkills = [
      {
        id: id(), name: 'Algebra Tutoring (Grade 8–12)', category: 'Tutoring',
        location: 'Bandra West', offerType: 'Both',
        details: 'Friendly, patient tutoring. 5+ years experience. Sessions at your home or mine.',
        postedBy: 'Anita P.', createdAt: now.toISOString(),
        trustRating: 4.8
      },
      {
        id: id(), name: 'Leaky Faucet & Basic Plumbing', category: 'Home Repair',
        location: 'Andheri East', offerType: 'Paid',
        details: 'Quick fixes for faucets, minor leaks, and installations. Fair hourly rates.',
        postedBy: 'Rohan K.', createdAt: now.toISOString(),
        trustRating: 4.6
      },
      {
        id: id(), name: 'Spanish Conversation Practice', category: 'Tutoring',
        location: 'Powai', offerType: 'Barter',
        details: 'Native speaker offering conversation practice. Open to skill swaps.',
        postedBy: 'Maria L.', createdAt: now.toISOString(),
        trustRating: 4.9
      },
      {
        id: id(), name: 'Weekend Garden Cleanup', category: 'Gardening',
        location: 'Juhu', offerType: 'Both',
        details: 'Pruning, weeding, and lawn care. Tools included.',
        postedBy: 'Devika S.', createdAt: now.toISOString(),
        trustRating: 4.4
      },
      {
        id: id(), name: 'Dog Walking (Mornings)', category: 'Pet Care',
        location: 'Bandra West', offerType: 'Barter',
        details: 'Reliable weekday morning walks. Looking to swap with a cook or tutor.',
        postedBy: 'Sahil M.', createdAt: now.toISOString(),
        trustRating: 4.7
      },
      {
        id: id(), name: 'Laptop Speed-up & Cleanup', category: 'Tech Help',
        location: 'Powai', offerType: 'Paid',
        details: 'Remove junk, tune startup, install updates. ₹0 platform cut.',
        postedBy: 'Nikhil R.', createdAt: now.toISOString(),
        trustRating: 4.5
      }
    ];

    const sampleBookings = [
      {
        id: id(), skillId: sampleSkills[0].id, skillName: sampleSkills[0].name,
        providerName: sampleSkills[0].postedBy, seekerName: 'You',
        type: 'Barter', status: 'Accepted',
        date: new Date(now.getTime() - 86400000 * 2).toISOString()
      },
      {
        id: id(), skillId: sampleSkills[1].id, skillName: sampleSkills[1].name,
        providerName: sampleSkills[1].postedBy, seekerName: 'You',
        type: 'Direct Paid', status: 'Completed',
        date: new Date(now.getTime() - 86400000 * 14).toISOString()
      },
      {
        id: id(), skillId: sampleSkills[5].id, skillName: sampleSkills[5].name,
        providerName: sampleSkills[5].postedBy, seekerName: 'You',
        type: 'Direct Paid', status: 'Completed',
        date: new Date(now.getTime() - 86400000 * 30).toISOString()
      },
      {
        id: id(), skillId: sampleSkills[3].id, skillName: sampleSkills[3].name,
        providerName: sampleSkills[3].postedBy, seekerName: 'You',
        type: 'Barter', status: 'Completed',
        date: new Date(now.getTime() - 86400000 * 45).toISOString()
      },
      {
        id: id(), skillId: sampleSkills[2].id, skillName: sampleSkills[2].name,
        providerName: sampleSkills[2].postedBy, seekerName: 'You',
        type: 'Barter', status: 'Completed',
        date: new Date(now.getTime() - 86400000 * 70).toISOString()
      },
      {
        id: id(), skillId: sampleSkills[4].id, skillName: sampleSkills[4].name,
        providerName: sampleSkills[4].postedBy, seekerName: 'You',
        type: 'Barter', status: 'Pending',
        date: new Date(now.getTime() - 86400000 * 1).toISOString()
      }
    ];

    save(LS_KEYS.skills, sampleSkills);
    save(LS_KEYS.bookings, sampleBookings);
  };

  const state = {
    skills: [],
    bookings: [],
    stats: { skillsOffered: 0, servicesBooked: 0, trustScore: 0, reviews: 0 },
    user: 'You',
    filter: 'All',
    search: ''
  };

  const init = () => {
    const hasSkills = localStorage.getItem(LS_KEYS.skills);
    if (!hasSkills) seed();
    state.skills = load(LS_KEYS.skills, []);
    state.bookings = load(LS_KEYS.bookings, []);
    state.stats = load(LS_KEYS.stats, state.stats);
    state.user = load(LS_KEYS.user, state.user);
    recalcStats();
  };

  const persist = () => {
    save(LS_KEYS.skills, state.skills);
    save(LS_KEYS.bookings, state.bookings);
    save(LS_KEYS.stats, state.stats);
    save(LS_KEYS.user, state.user);
  };

  const recalcStats = () => {
    state.stats.skillsOffered = state.skills.length;
    state.stats.servicesBooked = state.bookings.length;
    const completed = state.bookings.filter(b => b.status === 'Completed').length;
    const reviews = completed; // 1 verified review per completed booking
    state.stats.reviews = reviews;
    // Trust formula: weighted completed + reviews; capped at 100
    const base = (completed * 12) + (reviews * 3);
    state.stats.trustScore = Math.min(100, Math.round(base));
    persist();
  };

  return { state, init, persist, recalcStats, reset: () => {
    Object.values(LS_KEYS).forEach(k => localStorage.removeItem(k));
    seed();
    init();
  }};
})();

/* ----------------- Utilities ----------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const id = () => 'id_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const escapeHtml = (str = '') => String(str)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const debounce = (fn, ms = 200) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

const stars = (rating = 0) => {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
};

/* ----------------- Toast ----------------- */
const Toast = (() => {
  const container = () => $('#toastContainer');
  const show = (message, type = 'info') => {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    container().appendChild(el);
    setTimeout(() => el.remove(), 3000);
  };
  return { show };
})();

/* ----------------- Tabs ----------------- */
const Tabs = (() => {
  const init = () => {
    $$('.tab').forEach(tab => {
      tab.addEventListener('click', () => switchTo(tab.dataset.tab));
    });
  };
  const switchTo = (name) => {
    $$('.tab').forEach(t => {
      const isActive = t.dataset.tab === name;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', String(isActive));
    });
    $$('.panel').forEach(p => {
      const isActive = p.id === `panel-${name}`;
      p.classList.toggle('active', isActive);
      if (isActive) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
    });
    // Update URL hash for shareability
    history.replaceState(null, '', `#${name}`);
  };
  return { init, switchTo };
})();

/* ----------------- Hero Stats ----------------- */
const Hero = (() => {
  const totalSkillsEl = () => $('#stat-totalSkills');
  const activeBookingsEl = () => $('#stat-activeBookings');
  const trustScoreEl = () => $('#stat-trustScore');

  const render = () => {
    totalSkillsEl().textContent = Store.state.stats.skillsOffered;
    const active = Store.state.bookings.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled').length;
    activeBookingsEl().textContent = active;
    trustScoreEl().textContent = `${Store.state.stats.trustScore}%`;
  };
  return { render };
})();

/* ----------------- Skill Form ----------------- */
const SkillForm = (() => {
  const form = () => $('#skillForm');

  const validate = (data) => {
    const errors = {};
    if (!data.name || data.name.trim().length < 3)
      errors.name = 'Please enter a skill name (min 3 characters).';
    if (!data.category) errors.category = 'Please pick a category.';
    if (!data.location || data.location.trim().length < 2)
      errors.location = 'Please add a neighborhood or locality.';
    if (!['Barter', 'Paid', 'Both'].includes(data.offerType))
      errors.offerType = 'Choose an offer type.';
    return errors;
  };

  const showErrors = (errors) => {
    $$('#skillForm .field').forEach(f => f.classList.remove('invalid'));
    $$('#skillForm .field-error').forEach(e => e.textContent = '');
    Object.entries(errors).forEach(([k, msg]) => {
      const field = $(`#skillForm [name="${k}"]`)?.closest('.field');
      if (field) {
        field.classList.add('invalid');
        $(`.field-error[data-error="${k}"]`).textContent = msg;
      }
    });
  };

  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(form());
    const data = {
      name: (fd.get('name') || '').trim(),
      category: fd.get('category') || '',
      location: (fd.get('location') || '').trim(),
      offerType: fd.get('offerType') || '',
      details: (fd.get('details') || '').trim(),
      postedBy: (fd.get('postedBy') || Store.state.user || 'You').trim() || 'You'
    };
    const errors = validate(data);
    if (Object.keys(errors).length) {
      showErrors(errors);
      Toast.show('Please fix the highlighted fields.', 'error');
      return;
    }
    const skill = {
      id: id(),
      ...data,
      createdAt: new Date().toISOString(),
      trustRating: +(4.5 + Math.random() * 0.5).toFixed(1)
    };
    Store.state.skills.unshift(skill);
    Store.persist();
    Store.recalcStats();
    Offerings.render();
    Hire.render();
    Dashboard.render();
    Hero.render();
    form().reset();
    showErrors({});
    Toast.show(`"${skill.name}" published to your neighborhood.`, 'success');
  };

  const init = () => {
    if (!form()) return;
    form().addEventListener('submit', submit);
    // Live clear errors on input
    $$('#skillForm input, #skillForm select, #skillForm textarea').forEach(el => {
      el.addEventListener('input', () => {
        const field = el.closest('.field');
        if (field) field.classList.remove('invalid');
        $(`.field-error[data-error="${el.name}"]`).textContent = '';
      });
    });
    // Prefill "Posted by"
    $('#postedBy').value = Store.state.user;
  };

  return { init };
})();

/* ----------------- Offerings list (Skill tab) ----------------- */
const Offerings = (() => {
  const list = () => $('#offeringList');
  const count = () => $('#offeringCount');

  const render = () => {
    const mine = Store.state.skills.filter(s => s.postedBy === Store.state.user);
    count().textContent = `${mine.length} offering${mine.length === 1 ? '' : 's'}`;
    if (mine.length === 0) {
      list().innerHTML = `<li class="offering-item"><h4>No offerings yet</h4><div class="offering-meta">Post your first skill using the form.</div></li>`;
      return;
    }
    list().innerHTML = mine.map(s => `
      <li class="offering-item">
        <h4>${escapeHtml(s.name)}</h4>
        <div class="offering-meta">
          <span class="badge badge-category">${escapeHtml(s.category)}</span>
          <span class="badge badge-location">${escapeHtml(s.location)}</span>
          <span class="badge ${badgeFor(s.offerType)}">${escapeHtml(s.offerType)}</span>
        </div>
        <div class="offering-meta"><span>Posted ${formatDate(s.createdAt)}</span><span>·</span><span>${stars(s.trustRating)} ${s.trustRating}</span></div>
      </li>
    `).join('');
  };

  return { render };
})();

const badgeFor = (type) =>
  type === 'Barter' ? 'badge-barter' :
  type === 'Paid' ? 'badge-paid' : 'badge-both';

/* ----------------- Hire (search + filter + grid) ----------------- */
const Hire = (() => {
  const grid = () => $('#hireGrid');
  const empty = () => $('#hireEmpty');
  const search = () => $('#searchInput');
  const pills = () => $$('.filter-pills .pill');

  const matches = (skill) => {
    const q = Store.state.search.trim().toLowerCase();
    const f = Store.state.filter;
    const inFilter =
      f === 'All' ||
      (f === 'Barter' && (skill.offerType === 'Barter' || skill.offerType === 'Both')) ||
      (f === 'Paid' && (skill.offerType === 'Paid' || skill.offerType === 'Both'));
    if (!inFilter) return false;
    if (!q) return true;
    return [skill.name, skill.category, skill.location, skill.postedBy, skill.details]
      .some(v => String(v || '').toLowerCase().includes(q));
  };

  const render = () => {
    const filtered = Store.state.skills.filter(matches);
    if (filtered.length === 0) {
      grid().innerHTML = '';
      empty().hidden = false;
      return;
    }
    empty().hidden = true;
    grid().innerHTML = filtered.map(s => `
      <article class="skill-card" data-id="${s.id}">
        <div class="skill-card-head">
          <h3>${escapeHtml(s.name)}</h3>
          <span class="badge ${badgeFor(s.offerType)}" title="Offer type">${escapeHtml(s.offerType)}</span>
        </div>
        <div class="skill-meta">
          <span class="badge badge-category">${escapeHtml(s.category)}</span>
          <span class="badge badge-location">📍 ${escapeHtml(s.location)}</span>
        </div>
        <p class="skill-desc">${escapeHtml(s.details || 'No description provided.')}</p>
        <div class="skill-footer">
          <span class="provider">by ${escapeHtml(s.postedBy)}</span>
          <span class="stars" aria-label="Trust rating ${s.trustRating} of 5">${stars(s.trustRating)} <span style="color:var(--c-slate-500)">${s.trustRating}</span></span>
        </div>
        <div class="booking-actions">
          ${actionButtonHtml(s)}
        </div>
      </article>
    `).join('');
  };

  const actionButtonHtml = (skill) => {
    if (skill.offerType === 'Barter') {
      return `<button class="btn btn-success" data-action="barter" data-id="${skill.id}">Propose Skill Swap</button>`;
    }
    if (skill.offerType === 'Paid') {
      return `<button class="btn btn-primary" data-action="hire" data-id="${skill.id}">Direct Hire (0% Cut)</button>`;
    }
    return `
      <button class="btn btn-success" data-action="barter" data-id="${skill.id}">Propose Swap</button>
      <button class="btn btn-primary" data-action="hire" data-id="${skill.id}">Direct Hire</button>
    `;
  };

  const init = () => {
    search().addEventListener('input', debounce(e => {
      Store.state.search = e.target.value;
      render();
    }, 180));

    pills().forEach(p => p.addEventListener('click', () => {
      pills().forEach(x => {
        x.classList.remove('active');
        x.setAttribute('aria-pressed', 'false');
      });
      p.classList.add('active');
      p.setAttribute('aria-pressed', 'true');
      Store.state.filter = p.dataset.filter;
      render();
    }));

    grid().addEventListener('click', e => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const skill = Store.state.skills.find(s => s.id === btn.dataset.id);
      if (!skill) return;
      if (btn.dataset.action === 'barter') Modal.openBarter(skill);
      if (btn.dataset.action === 'hire') Modal.openHire(skill);
    });
  };

  return { render, init };
})();

/* ----------------- Modal ----------------- */
const Modal = (() => {
  const el = () => $('#modal');
  const title = () => $('#modalTitle');
  const body = () => $('#modalBody');

  const open = (t, contentHtml) => {
    title().textContent = t;
    body().innerHTML = contentHtml;
    el().classList.add('open');
    el().setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    el().classList.remove('open');
    el().setAttribute('aria-hidden', 'true');
    body().innerHTML = '';
    document.body.style.overflow = '';
  };

  const init = () => {
    el().addEventListener('click', e => {
      if (e.target.matches('[data-close]')) close();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });
    body().addEventListener('click', e => {
      const confirm = e.target.closest('[data-confirm]');
      if (confirm) handleConfirm(confirm.dataset.confirm, confirm.dataset.id);
    });
  };

  const summaryHtml = (skill) => `
    <div class="modal-skill-summary">
      <h4>${escapeHtml(skill.name)}</h4>
      <p>📍 ${escapeHtml(skill.location)} · by ${escapeHtml(skill.postedBy)} · ${stars(skill.trustRating)} ${skill.trustRating}</p>
    </div>
  `;

  const openBarter = (skill) => {
    open('Propose a Skill Swap', `
      ${summaryHtml(skill)}
      <div class="form">
        <div class="field">
          <label>Your offer (what you'll trade)</label>
          <input type="text" id="swapOffer" placeholder="e.g. Cooking lessons" />
        </div>
        <div class="field">
          <label>Preferred schedule</label>
          <input type="text" id="swapSchedule" placeholder="e.g. Sat 4–6 PM" />
        </div>
        <div class="field">
          <label>Message</label>
          <textarea id="swapMessage" rows="3" placeholder="Introduce yourself and propose a swap."></textarea>
        </div>
        <button class="btn btn-success" data-confirm="barter" data-id="${skill.id}">Send Swap Proposal</button>
      </div>
    `);
  };

  const openHire = (skill) => {
    open('Direct Hire · 0% Platform Cut', `
      ${summaryHtml(skill)}
      <div class="form">
        <div class="field">
          <label>Your name</label>
          <input type="text" id="hireName" value="${escapeHtml(Store.state.user)}" />
        </div>
        <div class="field">
          <label>Date</label>
          <input type="date" id="hireDate" />
        </div>
        <div class="field">
          <label>Agreed price (paid directly to neighbor)</label>
          <input type="number" id="hirePrice" placeholder="₹" min="0" />
        </div>
        <div class="field">
          <label>Notes</label>
          <textarea id="hireNotes" rows="3" placeholder="Anything else the provider should know."></textarea>
        </div>
        <p style="font-size:12px;color:var(--c-slate-500);margin:0;">🔒 PeerTask takes 0% of this payment. You'll settle directly.</p>
        <button class="btn btn-primary" data-confirm="hire" data-id="${skill.id}">Confirm Hire Request</button>
      </div>
    `);
  };

  const handleConfirm = (type, skillId) => {
    const skill = Store.state.skills.find(s => s.id === skillId);
    if (!skill) return;
    let booking;
    if (type === 'barter') {
      const offer = $('#swapOffer').value.trim() || 'Skill swap (unspecified)';
      booking = {
        id: id(), skillId: skill.id, skillName: skill.name,
        providerName: skill.postedBy, seekerName: Store.state.user,
        type: 'Barter', status: 'Pending',
        note: offer + ($('#swapSchedule').value ? ` · ${$('#swapSchedule').value}` : ''),
        date: new Date().toISOString()
      };
    } else if (type === 'hire') {
      const name = $('#hireName').value.trim() || Store.state.user;
      Store.state.user = name; Store.persist();
      booking = {
        id: id(), skillId: skill.id, skillName: skill.name,
        providerName: skill.postedBy, seekerName: name,
        type: 'Direct Paid', status: 'Pending',
        note: `Direct hire · ₹${$('#hirePrice').value || '—'}` + ($('#hireDate').value ? ` · ${$('#hireDate').value}` : ''),
        date: new Date().toISOString()
      };
    }
    if (booking) {
      Store.state.bookings.unshift(booking);
      Store.recalcStats();
      Store.persist();
      Dashboard.render();
      Hero.render();
      close();
      Toast.show(`Booking sent to ${skill.postedBy}.`, 'success');
    }
  };

  return { init, openBarter, openHire, open, close };
})();

/* ----------------- Dashboard ----------------- */
const Dashboard = (() => {
  const dashOffered = () => $('#dashOffered');
  const dashBooked = () => $('#dashBooked');
  const dashTrust = () => $('#dashTrust');
  const trustBadge = () => $('#trustBadge');
  const bookingList = () => $('#bookingList');
  const chart = () => $('#growthChart');

  const trustBadgeLabel = (score) => {
    if (score >= 75) return { label: 'Trusted', cls: 'high' };
    if (score >= 40) return { label: 'Verified', cls: 'mid' };
    return { label: 'New', cls: '' };
  };

  const render = () => {
    dashOffered().textContent = Store.state.stats.skillsOffered;
    dashBooked().textContent = Store.state.stats.servicesBooked;
    dashTrust().textContent = `${Store.state.stats.trustScore}%`;
    const badge = trustBadgeLabel(Store.state.stats.trustScore);
    trustBadge().textContent = badge.label;
    trustBadge().className = `trust-badge ${badge.cls}`;

    // Bookings list
    const bookings = [...Store.state.bookings].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (bookings.length === 0) {
      bookingList().innerHTML = `<li class="booking-item"><div class="booking-title">No bookings yet</div><div class="booking-meta">Hire or swap a skill to see it here.</div></li>`;
    } else {
      bookingList().innerHTML = bookings.map(b => `
        <li class="booking-item">
          <div class="booking-row">
            <div>
              <div class="booking-title">${escapeHtml(b.skillName)}</div>
              <div class="booking-meta">${escapeHtml(b.providerName)} · ${escapeHtml(b.type)}${b.note ? ' · ' + escapeHtml(b.note) : ''}</div>
              <div class="booking-meta">${formatDate(b.date)}</div>
            </div>
            <span class="status status-${b.status.toLowerCase()}">${escapeHtml(b.status)}</span>
          </div>
          <div class="booking-actions">
            ${b.status === 'Pending' ? `
              <button class="btn btn-success btn-sm" data-status-action="Accepted" data-id="${b.id}">Accept</button>
              <button class="btn btn-danger btn-sm" data-status-action="Cancelled" data-id="${b.id}">Cancel</button>` : ''}
            ${b.status === 'Accepted' ? `
              <button class="btn btn-success btn-sm" data-status-action="Completed" data-id="${b.id}">Mark Complete</button>
              <button class="btn btn-danger btn-sm" data-status-action="Cancelled" data-id="${b.id}">Cancel</button>` : ''}
            ${b.status === 'Completed' ? `<span class="booking-meta">✓ Verified</span>` : ''}
            ${b.status === 'Cancelled' ? `<span class="booking-meta">Cancelled</span>` : ''}
          </div>
        </li>
      `).join('');
    }

    renderChart();
  };

  const setBookingStatus = (id, status) => {
    const b = Store.state.bookings.find(x => x.id === id);
    if (!b) return;
    b.status = status;
    Store.recalcStats();
    Store.persist();
    Dashboard.render();
    Hero.render();
    Toast.show(`Booking ${status.toLowerCase()}.`, 'success');
  };

  const renderChart = () => {
    const svg = chart();
    // Aggregate bookings by month (last 6 months)
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString(undefined, { month: 'short' }), count: 0 });
    }
    Store.state.bookings.forEach(b => {
      const d = new Date(b.date);
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      const m = months.find(x => x.key === k);
      if (m) m.count++;
    });
    const max = Math.max(1, ...months.map(m => m.count));
    const w = 600, h = 280;
    const padX = 36, padY = 28;
    const innerW = w - padX * 2;
    const innerH = h - padY * 2;
    const stepX = innerW / (months.length - 1);

    // Smooth path via Catmull-Rom to Bezier
    const points = months.map((m, i) => ({
      x: padX + i * stepX,
      y: padY + innerH - (m.count / max) * innerH
    }));
    const smoothPath = points.length > 1 ? catmullRomToBezier(points) : '';

    const yTicks = 4;
    let gridLines = '';
    for (let i = 0; i <= yTicks; i++) {
      const y = padY + (innerH / yTicks) * i;
      const val = Math.round(max - (max / yTicks) * i);
      gridLines += `<line x1="${padX}" x2="${w - padX}" y1="${y}" y2="${y}" stroke="#e2e8f0" stroke-dasharray="2 4" />
                    <text x="${padX - 6}" y="${y + 4}" font-size="10" text-anchor="end" fill="#64748b">${val}</text>`;
    }

    let bars = '';
    months.forEach((m, i) => {
      const cx = padX + i * stepX;
      const barW = 18;
      const barH = (m.count / max) * innerH;
      const y = padY + innerH - barH;
      bars += `<rect x="${cx - barW/2}" y="${y}" width="${barW}" height="${barH}" rx="4" fill="#4f46e5" opacity="0.85" />
               <text x="${cx}" y="${h - 8}" font-size="11" text-anchor="middle" fill="#64748b">${m.label}</text>
               <text x="${cx}" y="${y - 6}" font-size="11" text-anchor="middle" fill="#0f172a" font-weight="600">${m.count}</text>`;
    });

    const areaPath = smoothPath
      ? `${smoothPath} L ${points[points.length - 1].x} ${padY + innerH} L ${points[0].x} ${padY + innerH} Z`
      : '';

    svg.innerHTML = `
      <defs>
        <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#4f46e5" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${gridLines}
      <path d="${areaPath}" fill="url(#areaGrad)" />
      <path d="${smoothPath}" fill="none" stroke="#4f46e5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      ${points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#fff" stroke="#4f46e5" stroke-width="2" />`).join('')}
      ${bars}
    `;
  };

  // Catmull-Rom to cubic bezier for smooth curve
  const catmullRomToBezier = (points) => {
    if (points.length < 2) return '';
    const tension = 0.5;
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6 * tension * 2;
      const cp1y = p1.y + (p2.y - p0.y) / 6 * tension * 2;
      const cp2x = p2.x - (p3.x - p1.x) / 6 * tension * 2;
      const cp2y = p2.y - (p3.y - p1.y) / 6 * tension * 2;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const init = () => {
    bookingList().addEventListener('click', e => {
      const btn = e.target.closest('[data-status-action]');
      if (!btn) return;
      setBookingStatus(btn.dataset.id, btn.dataset.statusAction);
    });
  };

  return { render, init };
})();

/* ----------------- Bootstrap ----------------- */
const App = (() => {
  const init = () => {
    Store.init();
    Tabs.init();
    SkillForm.init();
    Hire.init();
    Modal.init();
    Dashboard.init();

    Offerings.render();
    Hire.render();
    Dashboard.render();
    Hero.render();

    // Open tab from hash
    const hash = (location.hash || '').replace('#', '');
    if (['skills', 'hire', 'dashboard'].includes(hash)) Tabs.switchTo(hash);

    // Reset demo data
    $('#resetDataBtn')?.addEventListener('click', () => {
      if (confirm('Reset all demo data to seed values?')) {
        Store.reset();
        Offerings.render(); Hire.render(); Dashboard.render(); Hero.render();
        Toast.show('Demo data reset.', 'info');
      }
    });
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
