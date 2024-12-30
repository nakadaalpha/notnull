<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tambah Pelanggan</title>
</head>
<body>
    <?php echo validation_errors(); ?>
    <h1>Tambah Pelanggan</h1>
    <form action="<?php echo site_url('customer/tambah'); ?>" method="post">
        <label for="username">Username:</label><br>
        <input type="text" name="customer_username" id="username"><br><br>
        
        <label for="password">Password:</label><br>
        <input type="text" name="customer_password" id="password"><br><br>

        <label for="email">Email:</label><br>
        <input type="email" name="customer_email" id="email"><br><br>

        <label for="phone">Phone Number:</label><br>
        <input type="text" name="customer_phonenumb" id="phone"><br><br>

        <label for="address">Address:</label><br>
        <textarea name="customer_address" id="address"></textarea><br><br>

        <button type="submit">Tambah</button>
        <a href="<?php echo site_url('customer'); ?>">Kembali</a>
    </form>
</body>
</html>
