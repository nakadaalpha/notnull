<?php
session_start();
if(isset($_SESSION['username'])) { ?>
<h2 align="center">Control Panel</h2>
<p align="center">Selamat Datang
    "<?php echo $_SESSION['username'] ?>". Klik <a href="logout.php">
        disini</a> untuk logout.</p>
        <?php
        echo "<p align=center> Berikut ini adalah menu navigasi anda</p>";
        echo "<p align=center><a href='content_page.php'> Halaman Berita</a>
        | <a href='user_page.php'> Halaman User</a></p>";
} else { ?>
<h2>Maaf...</h2>
<p>Anda tidak berhak mengakses halaman ini. SIlahkan <a href="login.php">Login</a> terlebih dahulu. </p>
<?php }?>