var calendarID = "kgaogeln@pepkorit.com";
var requesterSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/1gkCoHU7rIA3ldDgDEEGMdL969epY3JEoM3GQEYYsSXk/edit#gid=461001202";
var requesterDataSheet = "Data"
var column = { leaveStatus: ["Leave Status",0]
              //{userID: ["User ID",0],
              // userName: ["Name",0],
              //userEmail: ["Email Address",0],
              //startDate: ["Start date",0],
              //endDate: ["End date",0],
              //leaveType: ["Type of leave",0],
              //manager: ["Managers",0],
             };

function flexiColumnIndexes() {
  var sheet = SpreadsheetApp.openById("1gkCoHU7rIA3ldDgDEEGMdL969epY3JEoM3GQEYYsSXk").getSheetByName(requesterDataSheet).getDataRange().getValues();
  
  for (var key in column) {
    if (column.hasOwnProperty(key)) {
      for (var i = 0; i< sheet[0].length; i++) {
        display(column[key][0] + "==" + sheet[0][i])
        if(column[key][0] == sheet[0][i]) {
          column[key][1] = i+1;
          display("column[key][1]: " + column[key][1])
        }
        
      }
    }
  }
}
//display column positions
function showColumns() {
  for (var key in column) {
    if (column.hasOwnProperty(key)) {
      display(key + " -> ");
      display(column[key]);
    }
  }
}



function onFormSubmit(e, rowData){
  display(JSON.stringify(e))
  var userId = e.namedValues["Leave ID"][0];
  display("ID: " + userId)
  var leaveStatus = e.namedValues["Leave status"][0];
  display("Leave status: " + leaveStatus)
  
  showColumns();
  flexiColumnIndexes() ;
  
  
  var rowID = copyDataToDataSheet(requesterSpreadsheetUrl, userId);
  display("rowID: " + rowID)
  
  if (rowID) {
    var sheet =  SpreadsheetApp.openByUrl(requesterSpreadsheetUrl).getSheetByName("Data");
    var lr = sheet.getLastRow()
    display("LastRow" + lr)
    //var newData = []
    
    sheet.getRange([(lr+1-1)], (column.leaveStatus[1])).setValue(leaveStatus);
    
    //sheet.appendRow(newData)
    MailApp.sendEmail(e.namedValues["Email Address"][0], "Leave Status", "Leave process is complete.", {noReply:true});
    
    
  }else {
    
    MailApp.sendEmail(e.namedValues["Email Address"][0], "Incorrect Id", "Incorrect Id", {noReply:true})
    
  }
  getEdit(e)
}

function copyDataToDataSheet(sheet,id){
  var isValid = false;
  var sheet = SpreadsheetApp.openByUrl(requesterSpreadsheetUrl).getSheetByName("Data");
  display("Sheet: " + sheet)
  var sheetData = sheet.getDataRange().getValues();
  
  for(var i=0; i< sheetData.length; i++){//loops through rows
    for(var j=0; j< sheetData.length; j++) {// loops through columns
      if(sheetData[i][j] == id) {
        return i+1;
      }
    }
  }
  return 0;
}

function status(idRow) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Manager sheet");
  var ws = sheet.getDataRange().getValues();
  var leaveStatus;
  
  for(var i = 0; i < ws.length; i++){
    display("ws[i][2] == idRow" + idRow)
    if (ws[i][2] == idRow){
      leaveStatus = ws[i][3];
    }
  }
  return leaveStatus;
}

function getEdit(e){
  var ss = SpreadsheetApp.openById("1gkCoHU7rIA3ldDgDEEGMdL969epY3JEoM3GQEYYsSXk");
  var ws = ss.getSheetByName("Data");
  var data = ws.getDataRange().getValues();
  var lr = (ws.getLastRow());
  var row = data[(lr-1)];
  var idCol = row[0];
  display("ID : " + idCol)
  var nameCol = row[1];
  display("Name : " + nameCol)
  var emailCol = row[2];
  display("Email : " + emailCol)
  var startCol = row[3];
  display("Start Date : " + startCol)
  var endCol = row[4];
  display("End Date  : " + endCol)
  var leaveTypeCol = row[5];
  display("Leave Type : " + leaveTypeCol)
  var managerCol = row[6];
  display("Manager Name : " + managerCol)

  
  // access the calendar
  var calendar = CalendarApp.getCalendarById(calendarID);
  var eventDates = calendar.getEvents(startCol, endCol);
  var eventTitle = leaveTypeCol + "-" + nameCol;
  var changedEvent;
  var color;
  var url;
  
  for(var i=0; i< eventDates.length; i++){
    if(eventDates[i].getTitle() == eventTitle){
      changedEvent = eventDates[i];
      break
    }
  }
  var leaveStatus = status(idCol);
  //or ws.getRange(lr,7,1,1.setValue(statusMessage);
  display(leaveStatus)
  if(changedEvent){
    
    if(leaveStatus == "Approved"){
      color = "10";
      
    }else if(leaveStatus == "Unapproved"){
      color = "6";
    } else {
      color = "11";
    }
  }
  changedEvent.setColor(color);
}

function display(t) {
  Logger.log(t);
  console.log(t);
}



