<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar Pelanggan</title>
    <!-- Link Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1 class="mb-4">Daftar Pelanggan</h1>
        <a href="<?php echo site_url('customer/tambah'); ?>" class="btn btn-primary mb-3">Tambah Pelanggan</a>
        <table class="table table-bordered">
            <thead class="table-dark">
                <tr>
                    <th>No</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Address</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!empty($customers)): ?>
                    <?php foreach ($customers as $key => $customer): ?>
                        <tr>
                            <td><?php echo $key + 1; ?></td>
                            <td><?php echo $customer['customer_username']; ?></td>
                            <td><?php echo $customer['customer_password']; ?></td>
                            <td><?php echo $customer['customer_email']; ?></td>
                            <td><?php echo $customer['customer_phonenumb']; ?></td>
                            <td><?php echo $customer['customer_address']; ?></td>
                            <td>
                                <a href="<?php echo site_url('customer/edit/' . $customer['customer_id']); ?>" class="btn btn-sm btn-warning">Edit</a>
                                <a href="<?php echo site_url('customer/hapus/' . $customer['customer_id']); ?>" class="btn btn-sm btn-danger" onclick="return confirm('Apakah Anda yakin ingin menghapus?');">Hapus</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="7" class="text-center">Tidak ada data pelanggan.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <!-- Link Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
