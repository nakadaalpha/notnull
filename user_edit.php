<!DOCTYPE html>
<html>
<style>
    body {
        background-color: #f1f1f1;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    h3 {
        text-align: center;
        color: #333;
        margin-bottom: 20px;
    }

    table {
        width: 350px;
        margin: 0 auto;
    }

    th,
    td {
        padding: 10px;
        text-align: left;
        border: 1px solid #ddd;
    }

    tr:nth-child(even) {
        background-color: #f2f2f2;
    }

    input[type="text"],
    input[type="password"],
    input[type="email"] {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 3px;
    }

    input[type="submit"] {
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }

    input[type="submit"]:hover {
        background-color: #45a049;
    }
</style>

<head>
    <title>Halaman Ubah Data</title>
</head>

<body>
    <?php
    include "config.php";
    $user = $_GET['user_nama'];
    $sql = "SELECT * FROM user WHERE user_nama='$user'";
    $hasil = mysqli_query($config, $sql);
    $data = mysqli_fetch_assoc($hasil);
    ?>
    <h3>Ubah Data Username</h3>
    <form method="POST" action="user_edit_action.php">
        <table>
            <tr>
                <td>Username</td>
                <td>:</td>
                <td>
                    <input type="text" value="<?php echo
                                                $data['user_nama'] ?>" disabled>
                    <input type="text" name="username" value="<?php
                                                                echo $data['user_nama'] ?>" hidden>
                </td>
            </tr>
            <tr>
                <td>Password</td>
                <td> : </td>
                <td>
                    <input type="text" name="password" value="<?php
                                                                echo $data['user_password'] ?>">
                </td>
            </tr>
            <tr>
                <td>Nama Lengkap</td>
                <td> : </td>
                <td>
                    <input type="text" name="namalengkap" value="<?php
                                                                    echo $data['user_namalengkap'] ?>">
                </td>
            </tr>
            <td>Email</td>
            <td> : </td>
            <td>
                <input type="email" name="email" value="<?php echo
                                                        $data['user_email'] ?>">
            </td>
            </tr>
            <tr>
                <td colspan=2>
                    <input type="submit" name="ubah" value="Simpan">
                    <input type="reset" value="Batal">
                </td>
            </tr>
        </table>
    </form>
</body>

</html>