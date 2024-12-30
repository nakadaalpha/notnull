<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Pelanggan</title>
</head>
<body>
    <h1>Edit Pelanggan</h1>
    <form action="<?php echo site_url('customer/edit/' . $customer['customer_id']); ?>" method="post">
        <label for="name">Nama:</label><br>
        <input type="text" name="username" id="name" value="<?php echo $customer['customer_username']; ?>"><br><br>

        <label for="name">Nama:</label><br>
        <input type="text" name="username" id="name" value="<?php echo $customer['customer_username']; ?>"><br><br>

        <label for="email">Email:</label><br>
        <input type="email" name="email" id="email" value="<?php echo $customer['customer_email']; ?>"><br><br>

        <label for="phone">Nomor Telepon:</label><br>
        <input type="text" name="phone" id="phone" value="<?php echo $customer['customer_phonenumb']; ?>"><br><br>

        <label for="address">Alamat:</label><br>
        <textarea name="address" id="address"><?php echo $customer['customer_address']; ?></textarea><br><br>

        <button type="submit">Simpan</button>
        <a href="<?php echo site_url('customer'); ?>">Kembali</a>
    </form>
</body>
</html>
