<?php
include "config.php";
$title = $_POST["title"];
$desc = $_POST["desc"];
$status = $_POST["status"];
$date = $_POST["date"];
$nick = $_POST["nick"];

// Read the name of the file to be uploaded
$filename = $_FILES['image']['name'];
// Temporary file name stored on the server
$filetmp = $_FILES['image']['tmp_name'];
// Folder for storing files
$uploaddir = "content_item/";

// Generate a unique filename to prevent overwriting
$uploadfile = $uploaddir . uniqid() . '_' . $filename;

if (move_uploaded_file($filetmp, $uploadfile)) {
    // File upload successful, insert information into database
    $sql = "INSERT INTO content(content_title, content_desc, content_status, content_image, content_upload_date, user_nickname) 
            VALUES('$title', '$desc', '$status', '$uploadfile', '$date', '$nick')";
    
    $stmt = mysqli_prepare($config, $sql);
    mysqli_stmt_bind_param($stmt, "sssss", $title, $desc, $status, $uploadfile, $date, $nick);
    $result = mysqli_stmt_execute($stmt);

    if ($result) {
        header('Location: content_page.php');
        exit();
    } else {
        echo "Database insertion failed: " . mysqli_error($config);
    }
} else {
    echo "File upload failed";
}
?>