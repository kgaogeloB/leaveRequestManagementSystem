//my core variables
var workingSheet = "Data";
var user_calendar = "kgaogeln@pepkorit.com";
var managerSheet = "Manager Data";
var employeeSheet = "Employee contacts";
var managerSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/1-RZ7k3rHSYChSKxCwkL1a_cxSHERyPNVnZCfKATTWgI/edit#gid=1979406488";
var approverFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfgZC_CuwoUUWGnfHe4MVakJeVom3K2hi2Hk9YzOYhP40nbEQ/viewform?usp=pp_url&entry.448345140="

var columns = {userID: ["User ID",0],
               userName: ["Name",0],
               userEmail: ["Email Address",0],
               startDate: ["Start date",0],
               endDate: ["End date",0],
               leaveType: ["Type of leave",0],
               manager: ["Managers",0],
               
               //leaveStatus: ["Leave Status",0]
              };

function flexiColumnIndexes() {
  var sheet = SpreadsheetApp.openById("1gkCoHU7rIA3ldDgDEEGMdL969epY3JEoM3GQEYYsSXk").getSheetByName(workingSheet).getDataRange().getValues();
  
  for (var key in columns) {
    if (columns.hasOwnProperty(key)) {
      for (var i = 0; i< sheet[0].length; i++) {
        display(columns[key][0] + "==" + sheet[0][i])
        if(columns[key][0] == sheet[0][i]) {
          columns[key][1] = i+1;
          display("columns[key][1]: " + columns[key][1])
        }
        
      }
    }
  }
}

//display column positions
function showColumns() {
  for (var key in columns) {
    if (columns.hasOwnProperty(key)) {
      display(key + " -> ");
      display(columns[key]);
    }
  }
}

function testFormUrl(){
  var url = approverFormUrl + "fuxkososhbdtc";
  display
  (url);
}

function onFormSubmit(e) {
  display(JSON.stringify(e))
  display("Starting: onFormSubmit")
  
  var user_google_profile = get_name_via_api(e.namedValues["Email Address"][0]);  //this part collects the users full details(containing the full name + image)
  var name = user_google_profile.name.fullName;
  var title = user_google_profile.organizations[0].title;
  
  var subject = e.namedValues["Type of leave"] + "-" + name;
  var body = title;
  var user_id = outputDataToSheet(workingSheet, e.namedValues);
  var formUrl = approverFormUrl + user_id;
  var managerEmail = getManagerEmail(getManagerName(e.namedValues["Email Address"][0]));
  
  var employee_template = HtmlService.createTemplateFromFile("userEmailTemplete").getRawContent();
  employee_template = employee_template.replace("{{name}}", name).replace("{{startDate}}", e.namedValues["Start date"][0])
  .replace("{{endDate}}",  e.namedValues["End date"][0]).replace("{{workTitle}}", title);
  
  var manager_template = HtmlService.createTemplateFromFile("managerTemplate").getRawContent();
  manager_template = manager_template.replace("{{startDate}}", e.namedValues["Start date"][0]).replace("{{endDate}}", e.namedValues["End date"][0])
  .replace("{{name}}", name).replace("{{formUrl}}", formUrl);
  //.replace("{{formUrl}}",formUrl);
  //  var startDate = e.namedValues["Start date"];
  //  var endDate = e.namedValues["End date"];
  //  var formUrl = approverFormUrl(user_id);
  
  //creating objects and their keys for the email function
  //  var info = {
  //    name: name,
  //    startDate: startDate,
  //    endDate: endDate,
  //    workTitle : title,
  //    formUrl : formUrl
  //  };
  //var body = templeteEngine(info);// have to parse two parameters,instead of one
  //var body2 = managerTemplateEngine(info);
  //calling manager functions
  //var user_id = outputDataToSheet(workingSheet, e.namedValues);
  //var managerEmail = getManagerEmail(getManagerName(e.namedValues["Email Address"][0]));
  
  //managerTemplate = managerTemplate.replace("{{startDate}}", e.namedValues["Start date"][0]).replace(""
  /*
  var managerTemplate = HtmlService.createTemplateFromFile('t2').getRawContent();
  managerTemplate = managerTemplate.replace("{{name}}", name)
  .replace("{{leaveType}}", e.namedValues["Type of Leave"][0])
  .replace("{{from}}", e.namedValues["From"][0])
  .replace("{{to}}", e.namedValues["To"][0])
  .replace("{{formUrl}}", formUrl);
  */
  
  
  //calling output to sheet
  //outputDataToSheet(workingSheet, e.namedValues);
  sendEmails(e.namedValues["Email Address"],subject,employee_template);
  sendEmails(managerEmail,subject,manager_template)
  calendarEvent(subject, e.namedValues["Start date"] ,e.namedValues["End date"], body);
  
  //display(e);
  display("Ending: onFormSubmit")
}

function outputDataToSheet(sheetName, rowData) {
  display("Starting: outputDataToSheet");
  display("sheetName: "+ sheetName);
  display("rowData: "+ rowData);
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName(sheetName);
  var userID = generateUserId(ws);
  
  var user_google_profile = get_name_via_api(rowData["Email Address"][0]);
  
  var name = user_google_profile.name.fullName;
  
  flexiColumnIndexes()
  showColumns()
  
  var lr = ws.getLastRow();
  
  ws.getRange((lr+1),(columns.userID[1])).setValue(userID);
  ws.getRange((lr+1),(columns.userName[1])).setValue(name);
  ws.getRange((lr+1),(columns.userEmail[1])).setValue(rowData["Email Address"][0]);
  ws.getRange((lr+1),(columns.startDate[1])).setValue(rowData["Start date"][0]);
  ws.getRange((lr+1),(columns.endDate[1])).setValue(rowData["End date"][0]);
  ws.getRange((lr+1),(columns.leaveType[1])).setValue(rowData["Type of leave"][0]);
  ws.getRange((lr+1),(columns.manager[1])).setValue(rowData["Managers"][0]);
  
  
  
  //ws.getRange((lr+1),(columns.leaveStatus[1])).setValue(rowData["Leave Status"][0]);
  
  //rowData.splice(0, 1);
  //rowData.unshift(userID);//this adds a new id column
  //ss.appendRow(newData);
  
  display("Ending: outputDataToSheet")
  return userID;
}
function generateUserId(sheet) {
  display("Starting Generate id");
  display("sheet " + sheet);//adding getName helps to see which sheets we are working on
  
  var data = sheet.getDataRange().getValues();
  var lr = sheet.getLastRow(); //Getting the last row from the sheet
  var lastID = data[(lr-1)][0]; //getting the values in lr,starting @ 0 index. 0 being the first column
  var newID = "";
  
  display("lastId: " + lastID);
  var rString = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for(var i = 0; i < 20 ; i++) {
    newID = newID + rString.charAt(Math.floor(Math.random() * rString.length));
  }
  display("newId: " + newID);
  return newID ;
  display("Ending: Generate id");
}

function get_name_via_api(userEmail) {
  display("Starting get_name_via_api")
  display("userEmail: " + userEmail);
  
  var user = AdminDirectory.Users.get(userEmail, {viewType: "domain_public"});
  display("user: " + user);
  return user;
  
  display("Ending: get_name_via_api")
}

function sendEmails(recipient, subject, body) {
  display("Starting: Sending emails to employees");
  display("recipient " + recipient);
  display("subject" + subject);
  display("body" + body);
  
  MailApp.sendEmail(recipient, subject, body,{name: "PepkorIT", htmlBody: body});
  display("Ending:  Sending emails to employees")
}

function calendarEvent(title, startDate, endDate) {
  display("Starting: Calendar event");
  display("CALENDAR_ID "+ user_calendar);
  display("title " + title);
  display("startDate " + startDate);
  display("endDate " + endDate);
  display("Creating new dates");
  
  var start = new Date(startDate);
  var end = new Date(endDate);
  end.setDate(end.getDate()+1);//endDate 18th - 17th = 1
  
  display("start " + start);
  display("end " + end);
  
  var calendar = CalendarApp.getCalendarById(user_calendar);
  var event = calendar.createAllDayEvent(title, start, end);
  return event;
  
  display("Ending: Calendar event");
}

function getManagerEmail(email){
  display("Starting: getManagerEmail")
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  display("Spreadsheet" + ss)
  var ws = ss.getSheetByName(managerSheet);
  display("Sheet: " + ws)
  var sheetData = ws.getDataRange().getValues();
  display("Sheet Data: " + sheetData)
  
  for(var i=0; i<sheetData.length; i++) {
    if (sheetData[i][0] == email) {
      
      return sheetData[i][1];
      
    }
  }
  display("Manager email: " + sheetData)
  display("Ending: getManagerEmail")
  return;
}

function getManagerName(name){
  display("Starting: getManagerName")
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName(employeeSheet);
  display("working sheet: " + ws)
  var sheetData = ws.getDataRange().getValues();
  display("Sheet data: " + sheetData)
  
  for (var j=0; j<sheetData.length; j++) {
    if(sheetData[j][1] == name) {
      return sheetData[j][2];
    }
  }
  display("Ending : getManagerName")
  return;
}

function leaveStatusColumn(idRow){
display("Getting leave status")
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(workingSheet);
var ws = sheet.getDataRange().getValues();
var leaveStatus;

  for(var i =0; i < ws.length; i++){
    display("ws[i][0] == idRow" + idRow)
    if(ws[i][0] == idRow){
      leaveStatus = ws[i][7];
    }
   }
   display("Leave Status: " + leaveStatus)
   return leaveStatus;
   
   display("Ending leave status")
  }
  
function display(t) {
  Logger.log(t);
  console.log(t);
}

