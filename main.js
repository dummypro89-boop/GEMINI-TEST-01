import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const STORAGE_KEYS = {
  members: "truly_pilates_members",
  bookings: "truly_pilates_bookings",
  media: "truly_pilates_media"
};

const COLLECTIONS = {
  members: "members",
  bookings: "bookings",
  media: "media"
};

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
  members: [],
  bookings: [],
  media: [],
  isAdmin: false,
  calendarYear: new Date().getFullYear(),
  calendarMonth: new Date().getMonth(),
  selectedDate: ""
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
  adminResult: document.querySelector("#adminResult"),
  dataMode: document.querySelector("#dataMode"),
  calPrevBtn: document.querySelector("#calPrevBtn"),
  calNextBtn: document.querySelector("#calNextBtn"),
  calLabel: document.querySelector("#calLabel"),
  calendarGrid: document.querySelector("#calendarGrid"),
  selectedDateLabel: document.querySelector("#selectedDateLabel"),
  clearDateFilterBtn: document.querySelector("#clearDateFilterBtn"),
  bookingAlertList: document.querySelector("#bookingAlertList")
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
  document.body.classList.toggle("is-admin", isAdmin);
  el.adminTools.classList.toggle("hidden", !isAdmin);
  renderMembers(el.memberSearch.value);
  renderBookings();
  renderMedia();
  renderCalendar();
  renderAlerts();
}

const firebaseEnabled = Boolean(
  firebaseConfig &&
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

let db = null;
let auth = null;
let usingFirestore = false;
let usingAuth = false;

if (firebaseEnabled) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    usingFirestore = true;
    usingAuth = true;
  } catch (error) {
    usingFirestore = false;
    usingAuth = false;
  }
}

function setDataModeText() {
  const dbMode = usingFirestore ? "Firebase Firestore" : "로컬 저장소(localStorage)";
  const authMode = usingAuth ? "Firebase Auth" : "비활성";
  el.dataMode.textContent = `데이터 모드: ${dbMode} | 인증 모드: ${authMode}`;
}

function formatDate(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function bookingDateTime(booking) {
  return new Date(`${booking.date}T${booking.time || "00:00"}`);
}

function getVisibleBookings() {
  if (!state.selectedDate) return state.bookings;
  return state.bookings.filter((booking) => booking.date === state.selectedDate);
}

function renderCalendar() {
  if (!el.calendarGrid || !el.calLabel) return;

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const firstDay = new Date(state.calendarYear, state.calendarMonth, 1);
  const startWeekday = firstDay.getDay();
  const lastDate = new Date(state.calendarYear, state.calendarMonth + 1, 0).getDate();
  const bookedDates = new Set(state.bookings.map((booking) => booking.date));

  el.calLabel.textContent = `${state.calendarYear}년 ${state.calendarMonth + 1}월`;

  const cells = [];
  for (const weekday of weekdays) {
    cells.push(`<div class="calendar-cell">${weekday}</div>`);
  }

  for (let i = 0; i < startWeekday; i += 1) {
    cells.push("<div class='calendar-day is-empty'></div>");
  }

  for (let day = 1; day <= lastDate; day += 1) {
    const dateKey = formatDate(state.calendarYear, state.calendarMonth, day);
    const hasBooking = bookedDates.has(dateKey) ? "has-booking" : "";
    const selected = state.selectedDate === dateKey ? "is-selected" : "";
    cells.push(
      `<button class="calendar-day ${hasBooking} ${selected}" data-action="pick-date" data-date="${dateKey}" type="button">${day}</button>`
    );
  }

  el.calendarGrid.innerHTML = cells.join("");
  if (el.selectedDateLabel) {
    el.selectedDateLabel.textContent = state.selectedDate ? `${state.selectedDate} 예약만 표시` : "전체 예약 표시";
  }
}

function renderAlerts() {
  if (!el.bookingAlertList) return;
  const now = new Date();
  const soon = [];

  for (const booking of state.bookings) {
    const when = bookingDateTime(booking);
    const diff = when.getTime() - now.getTime();
    const isSoon = diff >= 0 && diff <= 48 * 60 * 60 * 1000;
    if (booking.status === "대기" || isSoon) {
      soon.push(booking);
    }
  }

  if (!soon.length) {
    el.bookingAlertList.innerHTML = "<li>현재 확인할 예약 알림이 없습니다.</li>";
    return;
  }

  el.bookingAlertList.innerHTML = soon
    .sort((a, b) => bookingDateTime(a) - bookingDateTime(b))
    .slice(0, 8)
    .map((booking) => `<li>${booking.date} ${booking.time} ${booking.name} (${booking.status})</li>`)
    .join("");
}

async function dbReadCollection(collectionName) {
  if (!usingFirestore || !db) return null;
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

async function dbUpsert(collectionName, item) {
  if (!usingFirestore || !db) return;
  await setDoc(doc(db, collectionName, item.id), item, { merge: true });
}

async function dbRemove(collectionName, id) {
  if (!usingFirestore || !db) return;
  await deleteDoc(doc(db, collectionName, id));
}

async function seedIfEmpty() {
  if (!usingFirestore || !db) return;
  const [members, bookings, media] = await Promise.all([
    dbReadCollection(COLLECTIONS.members),
    dbReadCollection(COLLECTIONS.bookings),
    dbReadCollection(COLLECTIONS.media)
  ]);

  if (members.length || bookings.length || media.length) return;

  for (const member of defaults.members) await dbUpsert(COLLECTIONS.members, member);
  for (const item of defaults.media) await dbUpsert(COLLECTIONS.media, item);
}

function saveLocalBackup() {
  save(STORAGE_KEYS.members, state.members);
  save(STORAGE_KEYS.bookings, state.bookings);
  save(STORAGE_KEYS.media, state.media);
}

async function initializeData() {
  if (!usingFirestore) {
    state.members = load(STORAGE_KEYS.members, defaults.members);
    state.bookings = load(STORAGE_KEYS.bookings, defaults.bookings);
    state.media = load(STORAGE_KEYS.media, defaults.media);
    return;
  }

  try {
    await seedIfEmpty();
    const [members, bookings, media] = await Promise.all([
      dbReadCollection(COLLECTIONS.members),
      dbReadCollection(COLLECTIONS.bookings),
      dbReadCollection(COLLECTIONS.media)
    ]);
    state.members = members;
    state.bookings = bookings;
    state.media = media;
    saveLocalBackup();
  } catch (error) {
    usingFirestore = false;
    state.members = load(STORAGE_KEYS.members, defaults.members);
    state.bookings = load(STORAGE_KEYS.bookings, defaults.bookings);
    state.media = load(STORAGE_KEYS.media, defaults.media);
  }
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
  const visible = getVisibleBookings();
  if (!visible.length) {
    el.bookingTableBody.innerHTML = "<tr><td colspan='6'>아직 예약이 없습니다.</td></tr>";
    return;
  }

  el.bookingTableBody.innerHTML = visible
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

el.memberSearch.addEventListener("input", (event) => {
  renderMembers(event.target.value);
});

el.clearSearch.addEventListener("click", () => {
  el.memberSearch.value = "";
  renderMembers();
});

el.calPrevBtn?.addEventListener("click", () => {
  if (state.calendarMonth === 0) {
    state.calendarMonth = 11;
    state.calendarYear -= 1;
  } else {
    state.calendarMonth -= 1;
  }
  renderCalendar();
});

el.calNextBtn?.addEventListener("click", () => {
  if (state.calendarMonth === 11) {
    state.calendarMonth = 0;
    state.calendarYear += 1;
  } else {
    state.calendarMonth += 1;
  }
  renderCalendar();
});

el.clearDateFilterBtn?.addEventListener("click", () => {
  state.selectedDate = "";
  renderCalendar();
  renderBookings();
});

el.memberAddForm.addEventListener("submit", async (event) => {
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
  saveLocalBackup();
  await dbUpsert(COLLECTIONS.members, member);
  renderMembers(el.memberSearch.value);
  el.memberResult.textContent = `${member.name} 회원이 추가되었습니다.`;
  el.memberAddForm.reset();
});

el.bookingForm.addEventListener("submit", async (event) => {
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
  saveLocalBackup();
  await dbUpsert(COLLECTIONS.bookings, booking);
  renderBookings();
  renderCalendar();
  renderAlerts();
  el.bookingResult.textContent = `${booking.name} 님, ${booking.date} ${booking.time} ${booking.classType} 예약이 접수되었습니다.`;
  el.bookingForm.reset();
});

el.mediaAddForm.addEventListener("submit", async (event) => {
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
  saveLocalBackup();
  await dbUpsert(COLLECTIONS.media, item);
  renderMedia();
  el.mediaResult.textContent = `${item.title} 미디어가 추가되었습니다.`;
  el.mediaAddForm.reset();
});

el.adminLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!usingAuth || !auth) {
    el.adminResult.textContent = "Firebase Auth 설정 후 관리자 로그인이 가능합니다.";
    return;
  }

  const data = new FormData(el.adminLoginForm);
  const email = String(data.get("email")).trim();
  const password = String(data.get("password"));

  try {
    await signInWithEmailAndPassword(auth, email, password);
    el.adminResult.textContent = "관리자 로그인 완료";
    el.adminLoginForm.reset();
  } catch (error) {
    el.adminResult.textContent = "로그인 실패: 이메일/비밀번호를 확인하세요.";
  }
});

el.adminLogoutBtn.addEventListener("click", async () => {
  if (!usingAuth || !auth) {
    setAdminMode(false);
    el.adminResult.textContent = "로그아웃되었습니다.";
    return;
  }

  await signOut(auth);
  el.adminResult.textContent = "로그아웃되었습니다.";
});

el.resetDataBtn.addEventListener("click", async () => {
  if (!state.isAdmin) return;
  state.members = [...defaults.members];
  state.bookings = [...defaults.bookings];
  state.media = [...defaults.media];
  saveLocalBackup();

  if (usingFirestore) {
    const [members, bookings, media] = await Promise.all([
      dbReadCollection(COLLECTIONS.members),
      dbReadCollection(COLLECTIONS.bookings),
      dbReadCollection(COLLECTIONS.media)
    ]);
    for (const row of members) await dbRemove(COLLECTIONS.members, row.id);
    for (const row of bookings) await dbRemove(COLLECTIONS.bookings, row.id);
    for (const row of media) await dbRemove(COLLECTIONS.media, row.id);
    for (const row of defaults.members) await dbUpsert(COLLECTIONS.members, row);
    for (const row of defaults.media) await dbUpsert(COLLECTIONS.media, row);
  }

  renderMembers(el.memberSearch.value);
  renderBookings();
  renderMedia();
  renderCalendar();
  renderAlerts();
  el.adminResult.textContent = "데이터를 초기값으로 되돌렸습니다.";
});

document.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const action = target.dataset.action;
  if (!action) return;

  if (action === "pick-date") {
    state.selectedDate = target.dataset.date || "";
    renderCalendar();
    renderBookings();
    return;
  }

  const id = target.dataset.id;
  if (!id || !state.isAdmin) return;

  if (action === "plus" || action === "minus") {
    state.members = state.members.map((member) => {
      if (member.id !== id) return member;
      const delta = action === "plus" ? 1 : -1;
      const next = Math.max(0, member.remaining + delta);
      return { ...member, remaining: next, status: statusByRemaining(next) };
    });
    const changed = state.members.find((row) => row.id === id);
    saveLocalBackup();
    if (changed) await dbUpsert(COLLECTIONS.members, changed);
    renderMembers(el.memberSearch.value);
    return;
  }

  if (action === "delete-member") {
    state.members = state.members.filter((member) => member.id !== id);
    saveLocalBackup();
    await dbRemove(COLLECTIONS.members, id);
    renderMembers(el.memberSearch.value);
    return;
  }

  if (action === "booking-ok" || action === "booking-cancel") {
    const nextStatus = action === "booking-ok" ? "확정" : "취소";
    state.bookings = state.bookings.map((booking) => (booking.id === id ? { ...booking, status: nextStatus } : booking));
    const changed = state.bookings.find((row) => row.id === id);
    saveLocalBackup();
    if (changed) await dbUpsert(COLLECTIONS.bookings, changed);
    renderBookings();
    renderAlerts();
    return;
  }

  if (action === "booking-delete") {
    state.bookings = state.bookings.filter((booking) => booking.id !== id);
    saveLocalBackup();
    await dbRemove(COLLECTIONS.bookings, id);
    renderBookings();
    renderCalendar();
    renderAlerts();
    return;
  }

  if (action === "delete-media") {
    state.media = state.media.filter((item) => item.id !== id);
    saveLocalBackup();
    await dbRemove(COLLECTIONS.media, id);
    renderMedia();
  }
});

function bindAuthObserver() {
  if (!usingAuth || !auth) {
    setAdminMode(false);
    return;
  }

  onAuthStateChanged(auth, (user) => {
    setAdminMode(Boolean(user));
  });
}

await initializeData();
setDataModeText();
bindAuthObserver();
renderMembers();
renderBookings();
renderMedia();
renderCalendar();
renderAlerts();
