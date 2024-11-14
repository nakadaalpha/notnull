<?php
include "config.php";
$user = $_GET['user_nama'];

$sql = "DELETE FROM user WHERE user_nama = '$user'";
$hasil = mysqli_query($config, $sql);

if ($hasil) {
    echo "<script> alert ('Data Berhasil Dihapus')</script>";
    header("location:halamanuser.php");
} else {
    echo "<script> alert ('Data Gagal Dihapus')</script>";
    header("location:halamanuser.php");
}
