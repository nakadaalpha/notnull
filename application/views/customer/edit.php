<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Pelanggan</title>
    <!-- Link Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1 class="mb-4">Edit Pelanggan</h1>
        <form action="<?php echo site_url('customer/edit/' . $customer['customer_id']); ?>" method="post">
            <div class="mb-3">
                <label for="username" class="form-label">Nama:</label>
                <input type="text" name="username" id="username" class="form-control" value="<?php echo $customer['customer_username']; ?>" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email:</label>
                <input type="email" name="email" id="email" class="form-control" value="<?php echo $customer['customer_email']; ?>" required>
            </div>
            <div class="mb-3">
                <label for="phone" class="form-label">Nomor Telepon:</label>
                <input type="text" name="phone" id="phone" class="form-control" value="<?php echo $customer['customer_phonenumb']; ?>" required>
            </div>
            <div class="mb-3">
                <label for="address" class="form-label">Alamat:</label>
                <textarea name="address" id="address" class="form-control" rows="3" required><?php echo $customer['customer_address']; ?></textarea>
            </div>
            <button type="submit" class="btn btn-success">Simpan</button>
            <a href="<?php echo site_url('customer'); ?>" class="btn btn-secondary">Kembali</a>
        </form>
    </div>

    <!-- Link Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
