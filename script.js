const loginPage = document.getElementById("login-page");
const mainPage = document.getElementById("main-page");
const adminLogin = document.getElementById("admin-login");
const adminPage = document.getElementById("admin-page");

const emailInput = document.getElementById("email");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

const adminAccess = document.getElementById("admin-access");
const adminPass = document.getElementById("admin-pass");
const adminLoginBtn = document.getElementById("admin-login-btn");
const adminBackBtn = document.getElementById("admin-back-btn");
const adminLogout = document.getElementById("admin-logout");
const bookingTable = document.getElementById("booking-table");

const games = document.querySelectorAll(".game-btn");
const slotsCard = document.getElementById("slots-card");
const slotsDiv = document.getElementById("slots");
const slotsTitle = document.getElementById("slots-title");
const backBtn = document.getElementById("back-btn");

const myBookings = document.getElementById("my-bookings");
const userInfo = document.getElementById("user-info");
const pointsDisplay = document.getElementById("points");
const rewardStatus = document.getElementById("reward-status");

let currentUser = null;
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
let userPoints = JSON.parse(localStorage.getItem("points")) || {};

const slots = ["9:00-10:00", "10:00-11:00", "11:00-12:00", "3:00-4:00", "4:00-5:00"];

// Game-wise slot limits
const limits = {
  "Badminton": 4,
  "Table Tennis": 2,
  "Basketball": 10,
  "Volleyball": 12
};

loginBtn.onclick = () => {
  const email = emailInput.value.trim();
  if (!email.endsWith("@gitam.in")) return alert("Enter valid GITAM email!");
  currentUser = email;
  localStorage.setItem("user", email);
  showMainPage();
};

function showMainPage() {
  loginPage.classList.add("hidden");
  mainPage.classList.remove("hidden");
  userInfo.innerText = `Logged in as: ${currentUser}`;
  renderBookings();
}

logoutBtn.onclick = () => {
  currentUser = null;
  localStorage.removeItem("user");
  mainPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
};

if (localStorage.getItem("user")) {
  currentUser = localStorage.getItem("user");
  showMainPage();
}

games.forEach(btn => {
  btn.onclick = () => {
    const game = btn.dataset.game;
    const date = new Date().toISOString().split("T")[0];
    slotsTitle.innerText = `Available Slots for ${game} on ${date}`;
    slotsDiv.innerHTML = "";

    slots.forEach(slot => {
      const limit = limits[game] || 10;
      const count = bookings.filter(b => b.game === game && b.date === date && b.time === slot).length;
      const disabled = count >= limit;
      const button = document.createElement("button");
      button.innerText = disabled ? `${slot} (Full)` : slot;
      button.disabled = disabled;
      button.onclick = () => bookSlot(game, date, slot);
      slotsDiv.appendChild(button);
    });
    slotsCard.classList.remove("hidden");
  };
});

backBtn.onclick = () => {
  slotsCard.classList.add("hidden");
};

function bookSlot(game, date, time) {
  // Restrict user to only one booking per day
  const alreadyBooked = bookings.some(
    b => b.email === currentUser && b.date === date
  );
  if (alreadyBooked) {
    alert("You have already booked a slot for today! Only one booking per day is allowed.");
    return;
  }

  bookings.push({ email: currentUser, game, date, time });
  localStorage.setItem("bookings", JSON.stringify(bookings));
  userPoints[currentUser] = (userPoints[currentUser] || 0) + 3;
  localStorage.setItem("points", JSON.stringify(userPoints));
  alert(`✅ Booked ${game} - ${time} on ${date}`);
  renderBookings();
  slotsCard.classList.add("hidden");
}

function renderBookings() {
  const userBookings = bookings.filter(b => b.email === currentUser);
  myBookings.innerHTML = userBookings.map(b => `<li>${b.game} - ${b.time} on ${b.date}</li>`).join("") || "No bookings yet";
  const points = userPoints[currentUser] || 0;
  pointsDisplay.innerText = points;
  if (points >= 9) rewardStatus.innerHTML = "🎉 You unlocked: ⚡ Free Energy Drink";
  else rewardStatus.innerHTML = `💪 Only ${9 - points} more points to unlock next reward!`;
}

adminAccess.onclick = () => {
  loginPage.classList.add("hidden");
  adminLogin.classList.remove("hidden");
};

adminBackBtn.onclick = () => {
  adminLogin.classList.add("hidden");
  loginPage.classList.remove("hidden");
};

adminLoginBtn.onclick = () => {
  if (adminPass.value === "asms@537") {
    adminLogin.classList.add("hidden");
    adminPage.classList.remove("hidden");
    renderAdminTable();
  } else {
    alert("Incorrect Password!");
  }
};

adminLogout.onclick = () => {
  adminPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
};

function renderAdminTable() {
  bookingTable.innerHTML = bookings.map(b =>
    `<tr>
      <td>${b.email}</td>
      <td>${b.game}</td>
      <td>${b.date}</td>
      <td>${b.time}</td>
    </tr>`
  ).join("");
}
