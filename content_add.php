<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>notnull</title>
</head>

<style>
    body {
        font-family: Arial, Helvetica, sans-serif;
        background-color: rgb(26, 26, 28);
    }

    h1 {
        color: whitesmoke;
        text-align: center;
        padding: 40px;
    }

    .content-add {
        position: relative;
        z-index: 1;
        background: rgb(26, 26, 28);
        max-width: 80%;
        margin: 0 auto 100px;
        padding: 45px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.6), 0 5px 5px 0 rgba(0, 0, 0, 0.2);
        border-radius: 20px;
        color: whitesmoke;
    }

    .content-add h1 {
        text-align: center;
        color: whitesmoke;
        margin-top: -10px;
    }

    form input{
        font-family: "Roboto", sans-serif;
        background: black;
        width: 100%;
        border: 0;
        margin: 0 0 15px;
        padding: 18px;
        box-sizing: border-box;
        font-size: 14px;
        border-radius: 20px;
        color: whitesmoke;
    }

    form textarea {
        font-family: "Roboto", sans-serif;
        background: black;
        width: 100%;
        border: 0;
        margin: 0 0 15px;
        padding: 18px;
        box-sizing: border-box;
        font-size: 14px;
        border-radius: 20px;
        color: whitesmoke; 
    }

    table p {
        margin-top: 4px;
    }

    .content-add button {
        position: relative;
        text-align: center;
        box-sizing: border-box;
        border-radius: 20px;
        width: 40%;
        margin-top: 15px;
        margin-left: 5%;
        margin-right: 5%;
        padding: 19px;
        border: 0;
        font-weight: bold;
        font-size: 15px;
        background-color: grey;
    }

    .content-add button:hover {
        background-color: whitesmoke;
    }

</style>

<body>
    <h1>notnull</h1>
    <div class="content-add">
        <h1>Add Content</h1>
        <form action="content_add_action.php" method="post" enctype="multipart/form-data">
            <input type="text" name="title" placeholder="Content Title">    
            <textarea name="desc" placeholder="Content Description"></textarea>
            <input type="file" name="image">
            <input type="date" name="date">
            <table>
                <tr>
                    <td><input type="radio" name="status" value="Available"></td>
                    <td><p>Available</p></td>
                </tr>
                <tr>
                    <td><input type="radio" name="status" value="Unavailable"></td>
                    <td><p>Unavailable</p></td>
                </tr>
            </table>
            <input type="text" name="nick" placeholder="nickname">
            <button type="reset">RESET</button><button type="submit">SAVE</button>
        </form>
    </div>
</body>
</html>