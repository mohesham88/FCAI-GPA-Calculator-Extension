const COURSE_HOUR_COLUMN_IDX = 3;
const COURSE_GRADE_COLUMN_IDX = 6;
const COURSE_NAME_COLUMN_IDX = 1;

console.log("content.js is running");

/* function getCourseFromDOM(tableRows){
  let arr = [];
  tableRows.forEach(row => {
    const columns = row.querySelectorAll('td');
    if(!columns[COURSE_HOUR_COLUMN_IDX] || !columns[COURSE_HOUR_COLUMN_IDX].firstElementChild){
      return [];
    }

    // Field Training is excluded from GPA
    if(!(columns[COURSE_NAME_COLUMN_IDX].textContent == 'Field Training')){
      const hours = Number(columns[COURSE_HOUR_COLUMN_IDX].firstElementChild.textContent);
      const grade = columns[COURSE_GRADE_COLUMN_IDX].firstElementChild.textContent;
      
      arr.push({
        hours,
        grade
      });
    }
  });

  return arr;

}


function calculateGPA(courses){
  let totalGrade = 0;
  let totalHour = 0;
  const POINTS = {
    "A+" : 4.0,
    "A" : 3.7,
    "B+" : 3.3,
    "B" : 3.0,
    "C+" : 2.7,
    "C" : 2.4,
    "D+" : 2.2,
    "D" : 2.0,
    "F" : 0,
  }
  courses.forEach(course => {
    if(POINTS[course.grade]){
      totalGrade += (POINTS[course.grade] * course.hours);
      // console.log(`${course.hours} ${course.grade}`);
      console.log(`${POINTS[course.grade]} * ${course.hours} `);
      totalHour += course.hours;
    }
  });
  console.log(`GPA : ${totalGrade} / ${totalHour}`);
  if(totalHour !== 0) // division by zero
    return totalGrade/totalHour;
  else 
    return 0;
}








function sendGpaToWorker(gpa){
  chrome.runtime.sendMessage({ from: 'content', to: 'popup', gpa })
}


function checkURL(){
  const url = window.location.href;
  console.log(url);
  const urls = [
    'http://193.227.14.58/#/courses-per-students',
    'http://193.227.14.58/#/courses-per-students/',
    'http://newecom.fci-cu.edu.eg/#/courses-per-students',
    'http://newecom.fci-cu.edu.eg/#/courses-per-students/'
  ]

  if(urls.indexOf(url) !== -1){
    return true;
  }
  return false;
}


function main(){
  
  const tables = document.querySelectorAll('table')
  if( checkURL() && tables.length  > 1){
    const lastTable = tables[tables.length - 1];
    const rows = lastTable.querySelectorAll('tbody tr')
    const courses = getCourseFromDOM(rows);
    const gpa = calculateGPA(courses);
    sendGpaToWorker(gpa);
  }
  
}

const observer = new MutationObserver(main); 
observer.observe(document.body, {subtree: true, childList: true, attributes: true,});
 */

function sendToWorker(data) {
  chrome.runtime.sendMessage({ from: "content", to: "popup", data });
}

function calculateGPA(fields) {
  totalGrade = 0;
  totalHour = 0;
  failed_courses = [];
  fields.forEach((field) => {
    if (
      field.points &&
      field.course &&
      field.course.code != "TR301" /* field training course */
    ) {
      let course_hours = field.course.numOfHours;
      course_code = field.course.code;
      let points = field.points;
      let course_name = field.course.name;

      if (points == 0) {
        failed_courses.push({
          hourse: course_hours,
          points: points,
          code: course_code,
        });
      } else {
        // check if the course is failed before
        failed_courses.forEach((course) => {
          if (course.code == course_code) {
            // if the course is failed, then remove the failed one
            failed_courses.remove(course);
          }
        });

        totalGrade += points * course_hours;
        // console.log(`${course.hours} ${course.grade}`);
        totalHour += course_hours;
        console.log(` ${course_name} =  ${points} * ${course_hours} `);
        console.log(`currentGPA :${totalGrade / totalHour}`);
      }
    }
  });

  // add the failed not retaken courses
  failed_courses.forEach((course) => {
    totalHour += course.hourse;
    console.log(
      `failed course ${course.code} ${course.hourse} ${course.points}`
    );
  });

  let gpa = totalGrade / totalHour;
  gpa = gpa.toFixed(2);
  console.log(`total_points : ${totalGrade} , total_hours : ${totalHour}`);
  console.log(`GPA : ${gpa}`);
  if (totalHour !== 0)
    // division by zero
    return gpa;
  else return 0;
}

function injectScript() {
  // inject script to get intercept the response
  var s = document.createElement("script");
  s.src = chrome.runtime.getURL("scripts/inject.js");
  s.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);

  document.addEventListener("yourCustomEvent", function (e) {
    var data = e.detail;
    var jsonData = JSON.parse(data);
    console.log("received", jsonData);
    gpa = calculateGPA(jsonData);
    sendToWorker(gpa);
    // create_box(gpa);
  });
}

if (window.location.href.includes("courses-per-students")) {
  injectScript();
}

function create_box(gpa) {
  // Create the box element
  const box = document.createElement("div");
  box.id = "draggableBox";
  box.textContent = `GPA is ${gpa}`;

  // Style the box using JavaScript
  Object.assign(box.style, {
    width: "200px",
    height: "100px",
    backgroundColor: "#4CAF50",
    color: "white",
    textAlign: "center",
    lineHeight: "100px",
    cursor: "grab",
    position: "absolute",
    top: "50px",
    left: "50px",
    userSelect: "none", // Prevent text selection
  });

  // Append the box to the body
  document.body.appendChild(box);

  // Variables to track dragging state
  let isDragging = false;
  let offsetX, offsetY;

  // Event listener for mouse down (start dragging)
  box.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - box.offsetLeft;
    offsetY = e.clientY - box.offsetTop;
    box.style.cursor = "grabbing"; // Change cursor to grabbing
  });

  // Event listener for mouse move (while dragging)
  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      box.style.left = `${e.clientX - offsetX}px`;
      box.style.top = `${e.clientY - offsetY}px`;
    }
  });

  // Event listener for mouse up (stop dragging)
  document.addEventListener("mouseup", () => {
    isDragging = false;
    box.style.cursor = "grab"; // Change cursor back to grab
  });
}
