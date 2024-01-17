/// <reference path="./Types.d.ts" />

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const yearBreadcum = document.getElementById("breadcrum-year");
const branchLabel = document.getElementById("branch-label");
const monthBreadcum = document.getElementById("breadcrum-month");
const sessionLabel = document.getElementById("session-label");
const classbreadcum = document.getElementById("breadcrum-class");
const presentButton = document.getElementById("present_button");
const absentButton = document.getElementById("absent_button");
const studentName = document.getElementById("std_name");

const regForm = document.getElementById("reg-form");
const proceedButton = document.getElementById("proceed-button");

proceedButton.addEventListener("click", (e) => {
  e.preventDefault();
  const fd = new FormData(regForm);
  const formData = {};
  for (const [key, value] of fd) {
    formData[key] = value;
  }

  onStart(
    Number(formData.sessionStart),
    Number(formData.sessionEnd),
    formData.student_name,
    formData.branch
  );
});

const regPortalEL = document.getElementById("user-register");

function StartRegistration() {
  // SHow Registration PortalDialog
  ShowRegPortal(true);
}

function ShowRegPortal(show) {
  if (show) {
    regPortalEL.classList.remove("hidden");
    blurEl.classList.remove("hidden");
  } else {
    regPortalEL.classList.add("hidden");
    blurEl.classList.add("hidden");
  }
}

yearBreadcum.addEventListener("click", async () => {
  const options = data.years.map((y) => ({
    key: y.date_YYYY,
    value: y.date_YYYY,
  }));
  const value = await GetInput("Select year", options).catch(() => null);
  if (value != null) {
    SelectClass(value, selectedMonth, selectedClass);
  }
});

monthBreadcum.addEventListener("click", async () => {
  const options = monthNames.map((m, i) => ({
    key: `${m} (${i + 1})`,
    value: i + 1,
  }));
  const value = await GetInput("Select Month", options).catch(() => null);
  if (value != null) {
    SelectClass(selectedYear, value, selectedClass);
  }
});

classbreadcum.addEventListener("click", async () => {
  const options = classes.map((c) => ({
    key: `${c.class_name} [${c.teacher_name}]`,
    value: c.class_id,
  }));
  const value = await GetInput("Select Class", options).catch(() => null);
  if (value != null) {
    SelectClass(selectedYear, selectedMonth, value);
  }
});

const dates = document.getElementById("date-grid");

window.addEventListener("DOMContentLoaded", () => {
  LoadData();
});

let selectedYear = 0;
let selectedMonth = 0;
let selectedClass = 0;
let selectedDate = -1;
let isPresent = false;
let presentDate = null;

let showBackupOptions = false;

function SelectClass(year, month, classId) {
  selectedDate = -1;
  presentButton.disabled = true;
  absentButton.disabled = true;
  let classObj = classes.find((c) => c.class_id === classId);

  studentName.textContent = data.student_name;
  branchLabel.textContent = data.branch;
  sessionLabel.textContent = data.sessionStart + "-" + data.sessionEnd;

  yearBreadcum.textContent = year;
  monthBreadcum.textContent = monthNames[month - 1];
  classbreadcum.textContent = classObj.class_name;

  selectedYear = year;
  selectedClass = classId;
  selectedMonth = month;

  RenderDates();
}

function RenderDates() {
  dates.replaceChildren();

  const yearObj = data.years.find((y) => y.date_YYYY === selectedYear);
  const monthObj = yearObj.months.find((m) => m.date_MM === selectedMonth);
  monthObj.days.forEach((day) => {
    const dateNode = document.createElement("button");
    const timeNode = document.createElement("time");

    const _date = new Date(selectedYear, selectedMonth - 1, day.date_DD);
    timeNode.dateTime = _date;
    timeNode.textContent = day.date_DD;

    if (day.date_DD === 1) {
      dateNode.style.gridColumn = _date.getDay() + 1;
    }

    const todayDD = new Date(Date.now());

    if (
      todayDD.getDate() === day.date_DD &&
      todayDD.getMonth() + 1 === day.date_MM &&
      todayDD.getFullYear() === day.date_YYYY
    ) {
      dateNode.classList.add("today");
    }

    let period = day.periods.find((p) => p.class.class_id === selectedClass);

    if (!period) {
      period = day.periods.find((p) => p.class.class_id === 0);
      period.class.class_id = selectedClass;

      const _sc = classes.find((c) => c.class_id === selectedClass);
      period.class = _sc;
    }

    if (period.isPresent) {
      dateNode.classList.add("present");
      dateNode.setAttribute("data-present", true);
    } else {
      dateNode.classList.add("absent");
      dateNode.setAttribute("data-present", false);
    }

    if (period.timeStamp != null) {
      dateNode.setAttribute(
        "data-presentDate",
        Date(period.timeStamp).toString()
      );
    }

    if (day.date_DD === selectedDate) {
      dateNode.classList.add("selected");
    }

    dateNode.addEventListener("click", () => SelectDate(dateNode, day.date_DD));
    dateNode.appendChild(timeNode);

    dates.appendChild(dateNode);
  });
}

const classes = [
  {
    class_id: 1,
    class_name: "Math - III",
    teacher_name: "Mr. Vinay Singh",
  },
  {
    class_id: 2,
    class_name: "OOPS",
    teacher_name: "Miss. Arti Kumari",
  },
  {
    class_id: 3,
    class_name: "Web Technology",
    teacher_name: "Miss. Priya Kumari",
  },
  {
    class_id: 4,
    class_name: "Electrical Technology",
    teacher_name: "Mr. Anandmay KR. Singh",
  },
  {
    class_id: 5,
    class_name: "EDC",
    teacher_name: "MRs. Sujata Sharma",
  },
  {
    class_id: 6,
    class_name: "DLS",
    teacher_name: "Mr. Prashant Vishwakarma",
  },
];

let data = {
  student_id: 0,
  student_name: "Student Name",
  branch: "CSE",
  sessionStart: 0,
  sessionEnd: 0,

  years: [
    {
      date_YYYY: 0,

      months: [
        {
          date_MM: 0,
          date_YYYY: 0,

          days: [
            {
              date_DD: 0,
              date_MM: 0,
              date_YYYY: 0,

              periods: [
                {
                  period_number: 0,
                  class: {
                    class_id: 0,
                    class_name: "",
                    teacher_name: "",
                  },
                  isPresent: false,
                  timeStamp: Date.now(),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

function onStart(sessionStart, sessionEnd, std_name, branch) {
  data.student_id = Date.now();
  data.student_name = std_name;
  data.branch = branch;
  data.sessionStart = sessionStart;
  data.sessionEnd = sessionEnd;
  data.years = [];

  for (let year = sessionStart + 1; year <= sessionEnd; year++) {
    const yearObj = {
      date_YYYY: year,

      months: [],
    };

    for (let month = 1; month <= 12; month++) {
      const numberOfdays = new Date(year, month, 0).getDate();

      const monthObj = {
        date_MM: month,
        date_YYYY: year,

        days: [],
      };

      for (let day = 1; day <= numberOfdays; day++) {
        const dayObj = {
          date_DD: day,
          date_MM: month,
          date_YYYY: year,

          periods: [],
        };

        for (let i = 0; i <= classes.length; i++) {
          dayObj.periods.push({
            period_number: i + 1,
            class: classes[i],
            isPresent: false,
          });
        }

        monthObj.days.push(dayObj);
      }

      yearObj.months.push(monthObj);
    }

    console.dir(yearObj);
    data.years.push(yearObj);
  }

  SaveData();
  ShowRegPortal(false);

  window.location.reload();
}

function SelectDate(el, day) {
  // const _test = document.querySelector("button");
  selectedDate = day;
  presentButton.disabled = false;
  absentButton.disabled = false;
  RenderDates();

  let pd = el.getAttribute("data-presentDate");

  presentDate = pd != null ? new Date(pd) : null;
  isPresent = el.getAttribute("data-present") === "true";

  RenderDayControl();
}

function RenderDayControl() {
  if (isPresent) {
    absentButton.classList.remove("hidden");
    presentButton.disabled = true;
  } else {
    absentButton.classList.add("hidden");
    presentButton.disabled = false;
  }

  if (presentDate != null) {
    let pd = new Date(presentDate);
    const timeString = pd.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    presentButton.textContent = `Marked Present At [${timeString}]`;
  } else {
    presentButton.textContent = "Mark Present";
  }
}

const saveBackupButton = document.getElementById("backup_button");
const loadBackupButton = document.getElementById("load_backup_button");
const clearButton = document.getElementById("clear_button");
const showOptionsButton = document.getElementById("more_button");

saveBackupButton.addEventListener("click", saveBackup);
loadBackupButton.addEventListener("click", loadBackup);
showOptionsButton.addEventListener("click", () => {
  showBackupOptions = !showBackupOptions;

  if (showBackupOptions) {
    saveBackupButton.classList.remove("hidden");
    loadBackupButton.classList.remove("hidden");
    clearButton.classList.remove("hidden");
  } else {
    saveBackupButton.classList.add("hidden");
    loadBackupButton.classList.add("hidden");
    clearButton.classList.add("hidden");
  }
});

clearButton.addEventListener("click", () => {
  const proceed = confirm(
    "Are you sure you want to clear all data from this browser?"
  );

  if (proceed) {
    saveBackup();
    localStorage.clear();
    window.location.reload();
  }
});

function saveBackup() {
  SaveData();
  const content = localStorage.getItem("data");
  if (content == null) {
    return;
  }

  let file = new File(["\ufeff" + content], "attendence_backupsaves.txt", {
    type: "text/plain:charset=UTF-8",
  });

  let url = window.URL.createObjectURL(file);

  let a = document.createElement("a");
  a.style.display = "hidden";
  a.href = url;
  a.download = file.name;
  a.click();
  window.URL.revokeObjectURL(url);
}
function loadBackup() {
  let fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "text";
  fileInput.addEventListener("change", (e) => {
    let fr = new FileReader();
    fr.onload = function () {
      SaveData(fr.result);
      LoadData(true);
    };
    fr.readAsText(e.target.files[0]);
  });
  fileInput.click();
}

const ToggleIsPresent = (_isPresent) => () => {
  const period = data.years
    .find((y) => y.date_YYYY === selectedYear)
    .months.find((m) => m.date_MM === selectedMonth)
    .days.find((d) => d.date_DD === selectedDate)
    .periods.find((p) => p.class.class_id === selectedClass);

  period.isPresent = _isPresent;
  isPresent = _isPresent;

  if (period.isPresent) {
    period.timeStamp = new Date(Date.now());
    presentDate = period.timeStamp;
  } else {
    period.timeStamp = null;
    presentDate = null;
  }

  RenderDayControl();
  RenderDates();
  SaveData();
};

presentButton.addEventListener("click", ToggleIsPresent(true));
absentButton.addEventListener("click", ToggleIsPresent(false));

function SaveData(_dataString) {
  const dataString = JSON.stringify(
    _dataString ? JSON.parse(_dataString) : data
  );
  localStorage.setItem("data", dataString);
}

function LoadData(doFreshLoad = false) {
  const dataString = localStorage.getItem("data");
  if (dataString != null) {
    data = JSON.parse(dataString);
  } else {
    StartRegistration();
    return;
  }

  if (doFreshLoad) {
    window.location.reload();
    return;
  }

  const now = new Date(Date.now());
  SelectClass(now.getFullYear(), now.getMonth() + 1, classes[0].class_id);
}

const blurEl = document.getElementById("blur");
const portalEl = document.getElementById("portal");
const selectTitle = document.getElementById("selectTitle");
const options = document.getElementById("options");
const portalCloseBtn = document.getElementById("closeBtn");

function HideInput() {
  blurEl.classList.add("hidden");
  portalEl.classList.add("hidden");
}

HideInput();

function GetInput(_selectTitle, _options) {
  return new Promise((resolve, reject) => {
    selectTitle.textContent = _selectTitle;
    options.replaceChildren();

    blurEl.removeEventListener("click", closeInput);
    blurEl.addEventListener("click", closeInput, {
      once: true,
    });

    portalCloseBtn.removeEventListener("click", closeInput);
    portalCloseBtn.addEventListener("click", closeInput, {
      once: true,
    });

    function closeInput() {
      reject();
      HideInput();
    }

    for (let i = 0; i < _options.length; i++) {
      const option = _options[i];
      const button = document.createElement("button");
      button.classList.add("option");
      button.textContent = option.key;
      button.addEventListener("click", () => {
        resolve(option.value);
        HideInput();
      });
      options.appendChild(button);
    }
    blurEl.classList.remove("hidden");
    portalEl.classList.remove("hidden");
  });
}
