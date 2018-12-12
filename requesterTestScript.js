function test_onFormSubmit(){
var e = {"values":["9/26/2018 11:17:46","kgaogeln@pepkorit.com","10/22/2018","10/24/2018","Annual leave","Mrs K Ndaba"],
"namedValues":{"Type of leave":["Annual leave"],
"Start date":["10/22/2018"],
"Managers":["Mrs K Ndaba"],
"End date":["10/24/2018"],
"Timestamp":["9/26/2018 11:17:46"],
"Email Address":["kgaogeln@pepkorit.com"]},
"range":{"columnStart":1,"rowStart":3,"rowEnd":3,"columnEnd":6},"source":{},"authMode":{},"triggerUid":"438657316"}

display("Below is the onFormSubmit results")
onFormSubmit(e);
}

function testManager() {
  var name = "Mr Z Kenilworth";
  var email = getManagerEmail(name);
  display("email : " + email);
  var nameOfEmployee = "kgaogeln@pepkorit.com";
   var username = getManagerName(nameOfEmployee);
  display("name: " + username);
  }

function test_api() {
var user_email = "kgaogeln@pepkorit.com";
var user_profile = get_name_via_api(user_email);
display("User name: " + user_profile.name.fullName);
display("Work title: " + user_profile.organizations[0].title)
}
