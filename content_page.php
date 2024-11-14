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

    h1{
        text-align: center;
        color: whitesmoke;
        padding: 40px;
    }

    table {
        text-align: center;
        color: whitesmoke;
        margin: auto;
    }

    table a{
        text-decoration: none;
    }

    .content-data {
        position: relative;
        z-index: 1;
        background: rgb(26, 26, 28);
        max-width: 90%;
        margin: 0 auto 100px;
        padding: 45px;
        text-align: center;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.6), 0 5px 5px 0 rgba(0, 0, 0, 0.2);
        border-radius: 20px;
    }

    .content-data h1 {
        margin-top: -10px;
    }
    
    .content-data p {
        font-size: 20px;
        font-weight: bold;
        text-align: right;
    }

    .content-data a {
        text-decoration: none;
    }


</style>

<body>
    <h1>notnull</h1>
    <div class="content-data">
        <h1>Content Data</h1>
        <p><a href="content_add.php"> Add Content </a></p>
        <table width="100%" border="1" cellpadding="5" cellspacing="0">
            <tr>
                <th width="5%">Num</th>
                <th width="20%">Content Title</th>
                <th width="20%">Content Description</th>
                <th width="10%">Status</th>
                <th width="25%">Image</th>
                <th width="10%">Upload Date</th>
                <th width="10%">Manage</th>
            </tr>
            <?php
            include "config.php";
            $sql="SELECT content_id, content_title, content_desc, content_status, 
            content_image, content_upload_date FROM content ORDER BY content_id";
            $hasil = mysqli_query($config, $sql);
            $no=1;
            while ($data=mysqli_fetch_array($hasil)){
            ?>
            <tr>
                <td><?php echo $no;?></td>
                <td><?php echo $data['content_title']?></td>
                <td><?php echo $data['content_desc']?></td>
                <td><?php echo $data['content_status']?></td>
                <td><img src="<?php echo $data['content_image']?>" width="100%"></td>
                <td><?php echo $data['content_upload_date']?></td>
                <td align="center">
                <a href="content_edit.php?user_nickname=<?php echo $data['content_id'];?>">Edit</a> |
                <a href="content_delete.php?user_nickname=<?php echo $data['content_id'];?>">Delete</a>
                </td>
                <?php
                $no++;
            }?>
            </tr>
        </div>
</body>
</html>