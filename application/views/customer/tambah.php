<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tambah Pelanggan</title>
    <!-- Link Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <?php echo validation_errors(); ?>
        <h1 class="mb-4">Tambah Pelanggan</h1>
        <form action="<?php echo site_url('customer/tambah'); ?>" method="post">
            <div class="mb-3">
                <label for="username" class="form-label">Username:</label>
                <input type="text" name="customer_username" id="username" class="form-control">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password:</label>
                <input type="text" name="customer_password" id="password" class="form-control">
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email:</label>
                <input type="email" name="customer_email" id="email" class="form-control">
            </div>
            <div class="mb-3">
                <label for="phone" class="form-label">Phone Number:</label>
                <input type="text" name="customer_phonenumb" id="phone" class="form-control">
            </div>
            <div class="mb-3">
                <label for="address" class="form-label">Address:</label>
                <textarea name="customer_address" id="address" class="form-control"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Tambah</button>
            <a href="<?php echo site_url('customer'); ?>" class="btn btn-secondary">Kembali</a>
        </form>
    </div>

    <!-- Link Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
