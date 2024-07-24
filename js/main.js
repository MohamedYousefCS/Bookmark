const table = new DataTable("#example", {
  info: false,
  columnDefs: [{ orderable: false, targets: [2, 3, 4] }],
  order: [
    [0, "asc"],
    [1, ""],
  ],
  lengthChange: false,
  responsive: true,
  layout: {
    topStart: {
      buttons: ["copy", "csv", "excel", "pdf", "print"],
    },
  },
});

const siteName = document.getElementById("siteName");
const siteURL = document.getElementById("siteURL");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModalBtn");

// Table
const inputSearch = document.querySelector(
  "#example_wrapper > div:first-child > div:last-child input"
);
const siteResult = document.querySelector(
  "#example_wrapper > div:last-child > div:first-child"
);
const pagination = document.querySelector(
  "#example_wrapper > div:last-child > div:last-child"
);

let siteContainer = [];

if (localStorage.sites) defaultValue();

inputSearch.addEventListener("input", () => {
  const { showCounter } = handleShowOptionTable();
  showCounter();
});

// Default SetValue
function defaultValue() {
  siteContainer = JSON.parse(localStorage.sites);
  inputSearch.setAttribute("placeholder", "Search...");
  displaySites(siteContainer);
}

// Regex of SiteName and SiteURL
const siteNameRegex = /^\w{3,}(\s+\w+)*$/;
const siteURLRegex =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

submitBtn.addEventListener("click", () => {
  addSite();
});

// ==== Main Function To Site ====
function addSite() {
  const isValidSiteName = validation(siteName, siteNameRegex);
  const isValidSiteURL = validation(siteURL, siteURLRegex);

  if (isValidSiteName && isValidSiteURL) {
    const siteInfo = {
      siteName: siteName.value,
      siteURL: siteURL.value,
    };

    siteContainer.push(siteInfo);
    localStorage.setItem("sites", JSON.stringify(siteContainer));
    displaySites(siteContainer);
    clearInputs();
  } else {
    modal.classList.add("active");
    document.body.classList.add("overflow-hidden");
  }
}

// ==== Display Sites On Page ====
function displaySites(arr = siteContainer) {
  table.clear();

  for (let i = 0; i < arr.length; i++) {
    const row = document.createElement("tr");
    row.classList.add("value");

    row.innerHTML = `
    
      <td>${i + 1}</td>
      <td>
        <div
          class="d-flex align-items-center justify-content-center column-gap-2 row-gap-1 flex-wrap"
        >
          <div class="image">
          <img
            src="https://www.google.com/s2/favicons?domain=${
              arr[i].siteURL
            }&sz=128"
            alt="facebook"
            loading="lazy"
            class="d-block icon w-100"
          />
          </div>
          <span class="text-capitalize">${arr[i].siteName}</span>
        </div>
      </td>
      <td>
        <button class="btn visit d-flex align-items-center justify-content-center flex-wrap column-gap-2 row-gap-1 mx-auto" id="visitBtn" onclick="visitURL('${
          arr[i].siteURL
        }')">
          <i class="fa-solid fa-eye"></i>Visit
        </button>
      </td>
      <td>
        <button class="btn delete d-flex align-items-center justify-content-center flex-wrap column-gap-2 row-gap-1 mx-auto" onclick="deleteSite(${i})">
          <i class="fa-solid fa-trash-can"></i>
          Delete
        </button>
      </td>
      <td>
      <button class="edit btn" onclick="setValue(${i})"><i class="fa-solid fa-pen"></i> Update</button>
      </td>
    `;

    table.row.add(row);
  }
  table.draw();

  const { showCounter, showPagination, showInputSearchAndEntries } =
    handleShowOptionTable();

  showCounter();
  showPagination();
  showInputSearchAndEntries();
}

// ==== Handle Clear Inputs ====
function clearInputs() {
  siteName.value = "";
  siteURL.value = "";
  if (siteName.classList.contains("is-valid")) {
    siteName.classList.remove("is-valid");
  }
  if (siteURL.classList.contains("is-valid")) {
    siteURL.classList.remove("is-valid");
  }
}

// ==== Handle Visit URL ====
function visitURL(url) {
  const reg = /^https?:\/\//;
  if (reg.test(url)) {
    window.open(url, "_blank");
  } else {
    window.open(`https://${url}`, "_blank");
  }
}

// ==== Handle Delete Site ====
function deleteSite(index) {
  siteContainer.splice(index, 1);
  localStorage.setItem("sites", JSON.stringify(siteContainer));
  displaySites(siteContainer);
  const { showCounter } = handleShowOptionTable();
  showCounter();
}

// ==== Handle Update Site ====

let updateIndex = 0;
function setValue(index) {
  updateIndex = index;
  const { siteName: name, siteURL: url } = siteContainer[index];
  siteName.value = name;
  siteURL.value = url;
  submitBtn.classList.replace("d-block", "d-none");
  updateBtn.classList.replace("d-none", "d-block");
}

updateBtn.addEventListener("click", () => {
  updateSite(updateIndex);
});

function updateSite(index) {
  siteContainer[index].siteName = siteName.value;
  siteContainer[index].siteURL = siteURL.value;

  submitBtn.classList.replace("d-none", "d-block");
  updateBtn.classList.replace("d-block", "d-none");
  localStorage.setItem("sites", JSON.stringify(siteContainer));
  displaySites(siteContainer);
  clearInputs();
}

// Check Correct Data From User
siteName.addEventListener("input", () => {
  validation(siteName, siteNameRegex);
});
siteURL.addEventListener("input", () => {
  validation(siteURL, siteURLRegex);
});

function validation(element, reg) {
  if (reg.test(element.value)) {
    if (element.classList.contains("is-invalid")) {
      element.classList.replace("is-invalid", "is-valid");
    }
    return true;
  } else {
    if (element.classList.contains("is-valid")) {
      element.classList.remove("is-valid");
    }
    element.classList.add("is-invalid");
    return false;
  }
}

// ==== Close Modal ====
closeModalBtn.addEventListener("click", closeModal);

document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("active") &&
    e.target.classList.contains("data-info")
  )
    closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key == "Escape" && modal.classList.contains("active")) closeModal();
});

function closeModal() {
  modal.classList.remove("active");
  document.body.classList.remove("overflow-hidden");
}

// ==== Handle Show Option Table ====
function handleShowOptionTable() {
  const optionHeader = document.querySelector(
    "#example_wrapper > div:first-child"
  );

  const visibleSite = Array.from(document.querySelectorAll("#tableContent tr"));
  const numSite = visibleSite.filter((el) =>
    el.classList.contains("value")
  ).length;

  return {
    // Show Count of Site
    showCounter() {
      if (numSite > 0) {
        siteResult.classList.add("count-site");
        siteResult.innerHTML = `${numSite} Site In Table`;
      } else {
        siteResult.classList.remove("count-site");
        siteResult.innerHTML = ``;
      }
    },
    // showPagination of Table
    showPagination() {
      if (numSite > 0) {
        if (pagination.classList.contains("d-none"))
          pagination.classList.replace("d-none", "d-block");
        else pagination.classList.add("d-block");
      } else {
        if (pagination.classList.contains("d-block"))
          pagination.classList.replace("d-block", "d-none");
        else pagination.classList.add("d-none");
      }
    },
    showInputSearchAndEntries() {
      if (numSite > 0) {
        if (optionHeader.classList.contains("d-none"))
          optionHeader.classList.replace("d-none", "d-flex");
        else optionHeader.classList.add("d-flex");
      } else {
        if (optionHeader.classList.contains("d-flex"))
          optionHeader.classList.replace("d-flex", "d-none");
        else optionHeader.classList.add("d-none");
      }
    },
  };
}
