<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar Pelanggan</title>
</head>
<body>
    <h1>Daftar Pelanggan</h1>
    <a href="<?php echo site_url('customer/tambah'); ?>">Tambah Pelanggan</a>
    <table border="1">
        <thead>
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
                            <a href="<?php echo site_url('customer/edit/' . $customer['customer_id']); ?>">Edit</a> |
                            <a href="<?php echo site_url('customer/hapus/' . $customer['customer_id']); ?>" onclick="return confirm('Apakah Anda yakin ingin menghapus?');">Hapus</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="7">Tidak ada data pelanggan.</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
</body>
</html>
