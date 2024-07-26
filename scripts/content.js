const COURSE_HOUR_COLUMN_IDX = 3;
const COURSE_GRADE_COLUMN_IDX = 6;


console.log('content.js is running');

function getCourseFromDOM(tableRows){
  let arr = [];
  tableRows.forEach(row => {
    const columns = row.querySelectorAll('td');
    const hours = Number(columns[COURSE_HOUR_COLUMN_IDX].firstElementChild.textContent);
    const grade = columns[COURSE_GRADE_COLUMN_IDX].firstElementChild.textContent;

    arr.push({
      hours,
      grade
    });
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
    "C" : 2.3,
    "D+" : 2.0,
    "D" : 1.7,
    "F" : 0,
  }
  courses.forEach(course => {
    if(course.grade){
      totalGrade += POINTS[course.grade] * course.hours;
      totalHour += course.hours;
      /* console.log(totalGrade)
      console.log(totalHour)
      console.log(POINTS[course.grade]) */
    }
  });

  return totalGrade/totalHour;
}






var hadnle = setInterval( main , 1000);
function main(){

  const table = document.getElementsByClassName('table-striped');
  if(table[0] && table[0].children){
    const tableRows = document.querySelectorAll('.table.table-striped.col-md-12 tbody tr');
    console.log(tableRows)
    const courses = getCourseFromDOM(tableRows);

    const gpa = calculateGPA(courses);    
    console.log(gpa)
    
    clearInterval(hadnle)

   /*  chrome.runtime.sendMessage({
      gpa,
    }) */

    chrome.storage.local.set({gpa})
  }

}



/* document.addEventListener('readystatechange' ,  ()=>{
  if(document.readyState === 'complete'){
    const tableRows = document.getElementsByClassName('table-striped')[0].children[1].children;
    
  if(tableRows.length > 0){

    const courses = getCourseFromDOM(tableRows);

    const gpa = calculateGPA(courses);    
    console.log(gpa)
    
    (async () => {
      await chrome.storage.local.set({gpa})
    })();
    }

  }

}) */



/* 
const observer = new MutationObserver(main); 
observer.observe(document.body, {subtree: true, childList: true});

HTMLDocument.prototype.ready = new Promise(function (resolve) {
  if(document.readyState != 'loading')
    return resolve();
  else
    document.addEventListener("DOMContentLoaded", function () {
          return resolve();
    });
})


document.addEventListener("DOMSubtreeModified", function(event) {
  const tableRows = document.getElementsByClassName('table-striped')[0].children[1].children;
  console.log(tableRows);

  
})

document.ready.then(function () {

  const tableRows = document.getElementsByClassName('table-striped')[0].children[1].children;
  
  if(tableRows.length > 0){

    const courses = getCourseFromDOM(tableRows);

    const gpa = calculateGPA(courses);    
    console.log(gpa)
    
    (async () => {
      await chrome.storage.local.set({gpa})
    })();
    }

  
  
})
 */
/* setTimeout(function(){ 
  const element = document.querySelectorAll('table')
  console.log(element)
}, 3000) */

/* const tableRows = document.querySelectorAll('.table.table-striped.col-md-12 tbody tr'); */


