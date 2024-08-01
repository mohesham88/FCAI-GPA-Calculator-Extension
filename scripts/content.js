const COURSE_HOUR_COLUMN_IDX = 3;
const COURSE_GRADE_COLUMN_IDX = 6;
const COURSE_NAME_COLUMN_IDX = 1;

console.log('content.js is running');

function getCourseFromDOM(tableRows){
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
  ]

  if(urls.indexOf(url) !== -1){
    return true;
  }
  return false;
}


function main(){
  
  const tables = document.querySelectorAll('table')
  if( checkURL() && tables.length  > 1){
    const secondTable = tables[1];
    const rows = secondTable.querySelectorAll('tbody tr')
    const courses = getCourseFromDOM(rows);
    const gpa = calculateGPA(courses);
    sendGpaToWorker(gpa);
  }
  
}

const observer = new MutationObserver(main); 
observer.observe(document.body, {subtree: true, childList: true, attributes: true,});

