<?php
session_start();
include("config.php");

$username = $_POST["txtUsername"];
$password = $_POST["txtPassword"];

$sql = "SELECT user_nickname FROM user
WHERE user_nickname = '$username'
AND user_password = '$password'";

$hasil = mysqli_query($config,$sql) or exit("Error query : <b>".$sql."</b>");
if(mysqli_num_rows($hasil)>0){
    $data = mysqli_fetch_array($hasil);
    $_SESSION['username'] = $data['user_nickname'];
    header("Location:welcome.php");
} else { ?>
<p> Invalid username or password </p>
<p> Please login again </p><a href="login.php"></a><?php
} 
?>