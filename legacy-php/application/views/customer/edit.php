<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Pelanggan</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1 class="mb-4">Edit Pelanggan</h1>
        
        <!-- Menampilkan pesan error atau sukses -->
        <?php if ($this->session->flashdata('success')): ?>
            <div class="alert alert-success"><?php echo $this->session->flashdata('success'); ?></div>
        <?php elseif ($this->session->flashdata('error')): ?>
            <div class="alert alert-danger"><?php echo $this->session->flashdata('error'); ?></div>
        <?php endif; ?>

        <form action="<?php echo site_url('customer/edit/' . $customer['customer_id']); ?>" method="post">

            <div class="mb-3">
                <label for="customer_username" class="form-label">Nama:</label>
                <input type="text" name="customer_username" id="customer_username" class="form-control" value="<?php echo $customer['customer_username']; ?>" required>
            </div>
            <div class="mb-3">
                <label for="customer_email" class="form-label">Email:</label>
                <input type="email" name="customer_email" id="customer_email" class="form-control" value="<?php echo $customer['customer_email']; ?>" required>
            </div>
            <div class="mb-3">
                <label for="customer_phonenumb" class="form-label">Nomor Telepon:</label>
                <input type="text" name="customer_phonenumb" id="customer_phonenumb" class="form-control" value="<?php echo $customer['customer_phonenumb']; ?>" required>
            </div>
            <div class="mb-3">
                <label for="customer_address" class="form-label">Alamat:</label>
                <textarea name="customer_address" id="customer_address" class="form-control" rows="3" required><?php echo $customer['customer_address']; ?></textarea>
            </div>
            <button type="submit" class="btn btn-success">Simpan</button>
            <a href="<?php echo site_url('customer'); ?>" class="btn btn-secondary">Kembali</a>
        </form>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
