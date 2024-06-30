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

regForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (classes.length === 0) {
    alert("You Must add atlest one lecture");
    AddNewLecture();
    return;
  }
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
const lectruesListEl = document.getElementById("lectures-list");
const addLectureBtn = document.getElementById("add_lecture_button");
const lectureItemTemplate = document.getElementById("lecture-template");

const handleLectureNameEdit = (index) => (e) => {
  classes[index].class_name = e.target.value;
};

const handleLectureTeacherEdit = (index) => (e) => {
  classes[index].teacher_name = e.target.value;
};

const handleLectureRemove = (index) => (e) => {
  classes = classes.filter((_class, _index) => _index != index);
  UpdateLectureList();
};

function StartRegistration() {
  // SHow Registration PortalDialog
  ShowRegPortal(true);
  AddNewLecture();
}

addLectureBtn.addEventListener("click", AddNewLecture);

function RandomInt(min = 0, max = Date.now()) {
  return Math.floor(Math.random() * (max - min) + min);
}

function AddNewLecture() {
  classes.push({
    class_id: RandomInt(),
    class_name: "",
    teacher_name: "",
  });
  UpdateLectureList();
}

function UpdateLectureList() {
  lectruesListEl.replaceChildren();
  classes.forEach((_class, _index) => {
    let clone = lectureItemTemplate.content.cloneNode(true).firstElementChild;

    let lectureName = clone.getElementsByClassName("lecture_name")[0];
    lectureName.value = _class.class_name;
    lectureName.addEventListener("change", handleLectureNameEdit(_index));

    let lectureTeacher = clone.getElementsByClassName("lecture_teacher")[0];
    lectureTeacher.value = _class.teacher_name;
    lectureTeacher.addEventListener("change", handleLectureTeacherEdit(_index))

    clone.getElementsByClassName("remove_lecture_button")[0].addEventListener("click", handleLectureRemove(_index))
    lectruesListEl.appendChild(clone);
  });
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
  const options = [];
  for (let i = 0; i <= data.sessionEnd - data.sessionStart; i++) {
    const year = data.sessionStart + i;
    options.push({ key: year, value: year });
  }
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
  const options = data.classes.map((c) => ({
    key: `${c.class_name} - ${c.teacher_name}`,
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
  let classObj = data.classes.find((c) => c.class_id === classId);

  studentName.textContent = data.student_name;
  branchLabel.textContent = data.branch;
  sessionLabel.textContent = data.sessionStart + "-" + data.sessionEnd;

  yearBreadcum.textContent = year;
  monthBreadcum.textContent = monthNames[month - 1];
  classbreadcum.textContent = `${classObj.class_name} - ${classObj.teacher_name}`;

  selectedYear = year;
  selectedClass = classId;
  selectedMonth = month;

  RenderDates();
}

function RenderDates() {
  dates.replaceChildren();

  const numberOfdays = new Date(selectedYear, selectedMonth, 0).getDate();

  for (let day = 1; day <= numberOfdays; day++) {
    const dateNode = document.createElement("button");
    const timeNode = document.createElement("time");

    const _date = new Date(selectedYear, selectedMonth - 1, day);
    timeNode.dateTime = _date;
    timeNode.textContent = day;

    if (day === 1) {
      dateNode.style.gridColumn = _date.getDay() + 1;
    }

    const todayDD = new Date(Date.now());

    if (
      todayDD.getDate() === day &&
      todayDD.getMonth() + 1 === selectedMonth &&
      todayDD.getFullYear() === selectedYear
    ) {
      dateNode.classList.add("today");
    }



    let presentList = GetPresentList();

    if (presentList.includes(day)) {
      dateNode.classList.add("present");
      dateNode.setAttribute("data-present", true);
    } else {
      dateNode.classList.add("absent");
      dateNode.setAttribute("data-present", false);
    }

    if (day === selectedDate) {
      dateNode.classList.add("selected");
      isPresent = presentList.includes(day);
    }

    dateNode.addEventListener("click", () => SelectDate(dateNode, day));
    dateNode.appendChild(timeNode);

    dates.appendChild(dateNode);
  }
}

function GetPresentList() {
  let presentList = data.presentList;
  if (presentList == null) {
    presentList = [];
  } else {
    presentList = data.presentList[selectedYear];
    if (presentList == null) {
      presentList = [];
    } else {
      presentList = data.presentList[selectedYear][selectedMonth];
      if (presentList == null) {
        presentList = [];
      } else {
        presentList = data.presentList[selectedYear][selectedMonth][selectedClass];
        if (presentList == null) {
          presentList = [];
        }
      }
    }
  }

  return presentList;
}


const dummyClasses = [
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

let classes = [];

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
  data.classes = classes;
  data.years = undefined;

  SaveData();
  ShowRegPortal(false);

  window.location.reload();
}

function SelectDate(el, day) {
  if (selectedDate !== -1) {
    let allDates = [...dates.children];
    let lastSelectedDate = allDates[selectedDate - 1];
    lastSelectedDate.classList.remove("selected");
  }

  selectedDate = day;
  presentButton.disabled = false;
  absentButton.disabled = false;
  isPresent = GetPresentList().includes(day);

  if (isPresent) {
    el.classList.add("present");
    el.classList.remove("absent");
  } else {
    el.classList.add("absent");
    el.classList.remove("present");
  }
  el.setAttribute("data-present", isPresent);

  el.classList.add("selected");
  // RenderDates();
  RenderDayControl();
}

function RenderDayControl() {
  if (isPresent) {
    absentButton.classList.remove("hidden");
    presentButton.disabled = true;
    presentButton.textContent = `You are Present`;
  } else {
    absentButton.classList.add("hidden");
    presentButton.disabled = false;
    presentButton.textContent = "Write Present";
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

function ModifyPresentDate(_makePresent) {
  let presentList = data.presentList;

  if (presentList == null) {
    data.presentList = {};
  }

  presentList = data.presentList[selectedYear];
  if (presentList == null) {
    data.presentList[selectedYear] = {};
  }

  presentList = data.presentList[selectedYear][selectedMonth];
  if (presentList == null) {
    data.presentList[selectedYear][selectedMonth] = {};
  }

  presentList = data.presentList[selectedYear][selectedMonth][selectedClass];
  if (presentList == null) {
    data.presentList[selectedYear][selectedMonth][selectedClass] = [];
  }

  if (_makePresent) {
    data.presentList[selectedYear][selectedMonth][selectedClass].push(selectedDate);
  } else {
    data.presentList[selectedYear][selectedMonth][selectedClass] = data.presentList[selectedYear][selectedMonth][selectedClass].filter(_date => _date != selectedDate);
  }
}

const ToggleIsPresent = (_isPresent) => (e) => {
  let allDates = [...dates.children];
  let dateButton = allDates[selectedDate - 1];
  ModifyPresentDate(_isPresent);
  isPresent = _isPresent;

  if (_isPresent) {
    dateButton.classList.add("present");
    dateButton.classList.remove("absent");
  } else {
    dateButton.classList.add("absent");
    dateButton.classList.remove("present");
  }
  dateButton.setAttribute("data-present", _isPresent);

  RenderDayControl();
  // RenderDates();
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

    // In case someone has data saved but using old version
    if (data.classes == null) {
      data.classes = dummyClasses;
    }
    if (data.years != null) {
      //Restore old data format to new
      data.years.forEach(year => {
        selectedYear = year.date_YYYY;
        year.months.forEach(month => {
          selectedMonth = month.date_MM;
          month.days.forEach(day => {
            selectedDate = day.date_DD;
            day.periods.forEach(period => {
              selectedClass = period.period_number;
              if (period.isPresent) {
                ModifyPresentDate(true);
              }
            });
          });
        })
      })

      delete data.years;
    }
  } else {
    StartRegistration();
    return;
  }

  if (doFreshLoad) {
    window.location.reload();
    return;
  }

  const now = new Date(Date.now());
  SelectClass(now.getFullYear(), now.getMonth() + 1, data.classes[0].class_id);
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


const calenderEl = document.getElementById("calender");
let startX, startY, movingX, movingY;
const swipeThreshold = 100; // Minimum swipe distance in pixels

calenderEl.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  movingX = startX; // Initialize movingX to startX
  movingY = startY;
});

calenderEl.addEventListener("touchmove", e => {
  movingX = e.touches[0].clientX;
  movingY = e.touches[0].clientY;
});

calenderEl.addEventListener("touchend", e => {
  const diffX = movingX - startX;
  const diffY = movingY - startY;

  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
    if (diffX > 0) {
      // Right Swipe
      console.log("Right");
      if (selectedMonth === 1) {
        if (selectedYear === data.sessionStart) {
          return;
        }
        selectedYear--;
        selectedMonth = 12;
      } else {
        selectedMonth--;
      }
      SelectClass(selectedYear, selectedMonth, selectedClass);
    } else {
      // Left Swipe
      console.log("Left");
      if (selectedMonth === 12) {
        if (selectedYear === data.sessionEnd) {
          return;
        }
        selectedYear++;
        selectedMonth = 1;
      } else {
        selectedMonth++;
      }
      SelectClass(selectedYear, selectedMonth, selectedClass);

    }
  }
});