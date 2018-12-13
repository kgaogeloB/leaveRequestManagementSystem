<!DOCTYPE html>
<head>	
<link rel="stylesheet" type="text/css" href="style2.css" />
<title>Leave request system using PHP and MySQL</title>
</head>
<body>
<table border="1">
<tr>
	<td align="center">Leave request form</td>
</tr>
<tr>
	<td>
		<table>
			<form method="post" action="leave_req.php">
<tr>
	<td>Employee ID</td>
	<td><input type="text" name="id" size="20"></td>
</tr>
<tr>
	<td>Employee name:</td>
	<td><input type="text" name="name" size="20"></td>
</tr>
<tr>
	<td>Employee email</td>
	<td><input type="text" name="email" size="20"></td>
</tr>
<tr>
	<td>Leave start date</td>
	<td><input type="date" name="start_date" size="20"></td>
</tr>
<tr>
	<td>Leave end date</td>
	<td><input type="date" name="end_date" size="20"></td>
</tr>
<tr>
	<td>Leave type</td>
	<td>
		<select name="leave_type">
			<option value="Annual">Annual</option>
			<option value="Sick">Sick</option>
			<option value="Maternity">Maternity</option>
			<option value="Reward">Reward</option>
		</select>

	</td>
</tr>
<tr>
	<td>Leave status</td>
	<td>
		<select name="leave_status">
			<option value="Approved">Approved</option>
			<option value="Unapproved">Unapproved</option>
		</select>
	</td>
</tr>
<tr>
	<td>Manager</td>
	<td>
		<input type="radio" name="manager" value="Mr Ngobeni" checked>Mr Ngobeni
		<input type="radio" name="manager" value="Mr Mghobozi">Mr Mghobozi
</td>
</tr>
<tr>
	<td></td>
	<td align="right"><input type="submit" name="submit" value="Send request" class="btn"></td>
</tr>
</table>
</br>
</td>
</tr>
</table>
</form>
</body>
</html>
<?php
//get variables
$userName = $_POST['name'];
$userEmail = $_POST['email'];
$startDate = $_POST['start_date'];
$userId = $_POST['id'];
$endDate = $_POST['end_date'];
$leaveType = $_POST['leave_type'];
$leaveStatus = $_POST['leave_status'];
$work_manager = $_POST['manager'];

//connect to the database
$username = "root";
$password = "54502349Pizza";
$database = "leave_management";

$mysqli = new mysqli("localhost",$username,$password,$database);
//connect to database or die
$mysqli->select_db($database) or die("unable to connect");
//insert data into the database
$query = "INSERT into pep_employees(employee_id, employee_name, employee_email, start_date, end_date, leave_type, leave_status,manager)
VALUES('$userId', '$userName', '$userEmail', '$startDate', '$endDate', '$leaveType', '$leaveStatus', '$work_manager')";

if($mysqli ->query($query) === TRUE) {
	echo "<b> New record added succesfully</b>";


	//echo results on screen

	echo "<p> Employee ID: " . $userId ."</p>";
	echo "<p> Employee name: " . $userName ."</p>";
	echo "<p> Employee email: " . $userEmail ."</p>";
	echo "<p> Leave start date: " . $startDate ."</p>";
	echo "<p> Leave end date: " . $endDate ."</p>";
	echo "<p> Leave type: " . $leaveType ."</p>";
	echo "<p> Leave status: " . $leaveStatus ."</p>";
	echo "<p> Work manager: ". $work_manager ."</p>";
}else {
	echo "Error: " . $query . "<br" . $mysqli->error; 
}
$mysqli->close();
?>