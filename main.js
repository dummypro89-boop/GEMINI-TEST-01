const STORAGE_KEYS = {
  members: "truly_pilates_members",
  bookings: "truly_pilates_bookings",
  media: "truly_pilates_media",
  admin: "truly_pilates_admin"
};

const ADMIN_PASSWORD = "truly2026";

const defaults = {
  members: [
    { id: "m1", name: "김지민", phone: "010-2345-1133", pass: "개인 20회", remaining: 12, status: "수강중" },
    { id: "m2", name: "박서연", phone: "010-9931-7782", pass: "듀엣 10회", remaining: 3, status: "만료임박" },
    { id: "m3", name: "이현우", phone: "010-1212-4500", pass: "그룹 30회", remaining: 30, status: "신규" },
    { id: "m4", name: "최민아", phone: "010-5014-2700", pass: "재활 12회", remaining: 0, status: "만료" }
  ],
  bookings: [],
  media: [
    {
      id: "md1",
      type: "image",
      title: "리포머 필라테스",
      url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "md2",
      type: "image",
      title: "스트레칭 클래스",
      url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "md3",
      type: "video",
      title: "Pilates Basics",
      url: "https://www.youtube.com/embed/lCg_gh_fppI"
    }
  ]
};

const state = {
  members: load(STORAGE_KEYS.members, defaults.members),
  bookings: load(STORAGE_KEYS.bookings, defaults.bookings),
  media: load(STORAGE_KEYS.media, defaults.media),
  isAdmin: load(STORAGE_KEYS.admin, false)
};

const el = {
  memberTableBody: document.querySelector("#memberTableBody"),
  memberSearch: document.querySelector("#memberSearch"),
  clearSearch: document.querySelector("#clearSearch"),
  memberAddForm: document.querySelector("#memberAddForm"),
  memberResult: document.querySelector("#memberResult"),
  bookingForm: document.querySelector("#bookingForm"),
  bookingResult: document.querySelector("#bookingResult"),
  bookingTableBody: document.querySelector("#bookingTableBody"),
  mediaGrid: document.querySelector("#mediaGrid"),
  mediaAddForm: document.querySelector("#mediaAddForm"),
  mediaResult: document.querySelector("#mediaResult"),
  adminLoginForm: document.querySelector("#adminLoginForm"),
  adminLogoutBtn: document.querySelector("#adminLogoutBtn"),
  resetDataBtn: document.querySelector("#resetDataBtn"),
  adminTools: document.querySelector("#adminTools"),
  adminResult: document.querySelector("#adminResult")
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

function statusByRemaining(remaining) {
  if (remaining <= 0) return "만료";
  if (remaining <= 3) return "만료임박";
  return "수강중";
}

function setAdminMode(isAdmin) {
  state.isAdmin = isAdmin;
  save(STORAGE_KEYS.admin, isAdmin);
  document.body.classList.toggle("is-admin", isAdmin);
  el.adminTools.classList.toggle("hidden", !isAdmin);
  renderMembers(el.memberSearch.value);
  renderBookings();
  renderMedia();
}

function renderMembers(keyword = "") {
  const key = keyword.trim();
  const filtered = state.members.filter((member) => member.name.includes(key) || member.phone.includes(key));

  if (!filtered.length) {
    el.memberTableBody.innerHTML = "<tr><td colspan='6'>검색 결과가 없습니다.</td></tr>";
    return;
  }

  el.memberTableBody.innerHTML = filtered
    .map((member) => {
      const adminControls = state.isAdmin
        ? `
          <td class="admin-only">
            <div class="action-group">
              <button data-action="minus" data-id="${member.id}" class="btn secondary small" type="button">-1회</button>
              <button data-action="plus" data-id="${member.id}" class="btn secondary small" type="button">+1회</button>
              <button data-action="delete-member" data-id="${member.id}" class="btn secondary small" type="button">삭제</button>
            </div>
          </td>
        `
        : "<td class='admin-only'></td>";

      return `
        <tr>
          <td>${member.name}</td>
          <td>${member.phone}</td>
          <td>${member.pass}</td>
          <td>${member.remaining}</td>
          <td>${member.status}</td>
          ${adminControls}
        </tr>
      `;
    })
    .join("");
}

function renderBookings() {
  if (!state.bookings.length) {
    el.bookingTableBody.innerHTML = "<tr><td colspan='6'>아직 예약이 없습니다.</td></tr>";
    return;
  }

  el.bookingTableBody.innerHTML = state.bookings
    .map((booking) => {
      return `
        <tr>
          <td>${booking.name}</td>
          <td>${booking.phone}</td>
          <td>${booking.classType}</td>
          <td>${booking.date} ${booking.time}</td>
          <td>${booking.status}</td>
          <td>
            <div class="action-group">
              <button data-action="booking-ok" data-id="${booking.id}" class="btn secondary small" type="button">확정</button>
              <button data-action="booking-cancel" data-id="${booking.id}" class="btn secondary small" type="button">취소</button>
              <button data-action="booking-delete" data-id="${booking.id}" class="btn secondary small" type="button">삭제</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderMedia() {
  if (!state.media.length) {
    el.mediaGrid.innerHTML = "<p>등록된 미디어가 없습니다.</p>";
    return;
  }

  el.mediaGrid.innerHTML = state.media
    .map((item) => {
      const mediaNode =
        item.type === "video"
          ? `<iframe src="${item.url}" title="${item.title}" loading="lazy" allowfullscreen></iframe>`
          : `<img src="${item.url}" alt="${item.title}" loading="lazy" />`;

      const removeBtn = state.isAdmin
        ? `<button data-action="delete-media" data-id="${item.id}" class="btn secondary small" type="button">미디어 삭제</button>`
        : "";

      return `
        <article class="card media-item">
          ${mediaNode}
          <p class="media-caption">${item.title}</p>
          ${removeBtn}
        </article>
      `;
    })
    .join("");
}

function persistAll() {
  save(STORAGE_KEYS.members, state.members);
  save(STORAGE_KEYS.bookings, state.bookings);
  save(STORAGE_KEYS.media, state.media);
}

el.memberSearch.addEventListener("input", (event) => {
  renderMembers(event.target.value);
});

el.clearSearch.addEventListener("click", () => {
  el.memberSearch.value = "";
  renderMembers();
});

el.memberAddForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!state.isAdmin) return;
  const data = new FormData(el.memberAddForm);
  const remaining = Number(data.get("remaining"));
  const member = {
    id: uid("m"),
    name: String(data.get("name")).trim(),
    phone: String(data.get("phone")).trim(),
    pass: String(data.get("pass")).trim(),
    remaining,
    status: statusByRemaining(remaining)
  };
  state.members.unshift(member);
  persistAll();
  renderMembers(el.memberSearch.value);
  el.memberResult.textContent = `${member.name} 회원이 추가되었습니다.`;
  el.memberAddForm.reset();
});

el.bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(el.bookingForm);
  const booking = {
    id: uid("b"),
    name: String(data.get("name")).trim(),
    phone: String(data.get("phone")).trim(),
    classType: String(data.get("classType")),
    date: String(data.get("date")),
    time: String(data.get("time")),
    status: "대기"
  };
  state.bookings.unshift(booking);
  persistAll();
  renderBookings();
  el.bookingResult.textContent = `${booking.name} 님, ${booking.date} ${booking.time} ${booking.classType} 예약이 접수되었습니다.`;
  el.bookingForm.reset();
});

el.mediaAddForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!state.isAdmin) return;
  const data = new FormData(el.mediaAddForm);
  const item = {
    id: uid("md"),
    type: String(data.get("type")),
    title: String(data.get("title")).trim(),
    url: String(data.get("url")).trim()
  };
  state.media.unshift(item);
  persistAll();
  renderMedia();
  el.mediaResult.textContent = `${item.title} 미디어가 추가되었습니다.`;
  el.mediaAddForm.reset();
});

el.adminLoginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(el.adminLoginForm);
  const password = String(data.get("password"));
  if (password !== ADMIN_PASSWORD) {
    el.adminResult.textContent = "비밀번호가 올바르지 않습니다.";
    return;
  }
  setAdminMode(true);
  el.adminResult.textContent = "관리자 로그인 완료";
  el.adminLoginForm.reset();
});

el.adminLogoutBtn.addEventListener("click", () => {
  setAdminMode(false);
  el.adminResult.textContent = "로그아웃되었습니다.";
});

el.resetDataBtn.addEventListener("click", () => {
  if (!state.isAdmin) return;
  state.members = [...defaults.members];
  state.bookings = [...defaults.bookings];
  state.media = [...defaults.media];
  persistAll();
  renderMembers(el.memberSearch.value);
  renderBookings();
  renderMedia();
  el.adminResult.textContent = "데이터를 초기값으로 되돌렸습니다.";
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const action = target.dataset.action;
  if (!action) return;

  const id = target.dataset.id;
  if (!id || !state.isAdmin) return;

  if (action === "plus" || action === "minus") {
    state.members = state.members.map((member) => {
      if (member.id !== id) return member;
      const delta = action === "plus" ? 1 : -1;
      const next = Math.max(0, member.remaining + delta);
      return { ...member, remaining: next, status: statusByRemaining(next) };
    });
    persistAll();
    renderMembers(el.memberSearch.value);
    return;
  }

  if (action === "delete-member") {
    state.members = state.members.filter((member) => member.id !== id);
    persistAll();
    renderMembers(el.memberSearch.value);
    return;
  }

  if (action === "booking-ok" || action === "booking-cancel") {
    const nextStatus = action === "booking-ok" ? "확정" : "취소";
    state.bookings = state.bookings.map((booking) => (booking.id === id ? { ...booking, status: nextStatus } : booking));
    persistAll();
    renderBookings();
    return;
  }

  if (action === "booking-delete") {
    state.bookings = state.bookings.filter((booking) => booking.id !== id);
    persistAll();
    renderBookings();
    return;
  }

  if (action === "delete-media") {
    state.media = state.media.filter((item) => item.id !== id);
    persistAll();
    renderMedia();
  }
});

setAdminMode(Boolean(state.isAdmin));
renderMembers();
renderBookings();
renderMedia();
