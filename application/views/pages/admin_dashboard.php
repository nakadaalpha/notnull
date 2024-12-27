<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body>

    <!-- Main Content -->
    <div class="container mt-5">
        <h1 class="mb-4">Selamat datang, <?= $admin_name; ?>!</h1>
        
        <div class="row">
            <!-- Manage Cars -->
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Mengelola Data Mobil</h5>
                        <p class="card-text">Tambah, edit, atau hapus data mobil di sini.</p>
                        <a href="<?= base_url('car/manage'); ?>" class="btn btn-primary">Kelola Mobil</a>
                    </div>
                </div>
            </div>

            <!-- Sales and Stock Reports -->
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Laporan Penjualan dan Stok</h5>
                        <p class="card-text">Lihat laporan penjualan dan jumlah stok kendaraan.</p>
                        <a href="<?= base_url('reports/sales'); ?>" class="btn btn-success">Akses Laporan</a>
                    </div>
                </div>
            </div>

            <!-- Input Transactions -->
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Masukkan Data Transaksi Penjualan</h5>
                        <p class="card-text">Tambah data transaksi penjualan baru.</p>
                        <a href="<?= base_url('transactions/input'); ?>" class="btn btn-warning">Input Transaksi</a>
                    </div>
                </div>
            </div>

            <!-- Manage Stock -->
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Kelola Stok Kendaraan</h5>
                        <p class="card-text">Pantau dan kelola stok kendaraan yang tersedia.</p>
                        <a href="<?= base_url('stock/manage'); ?>" class="btn btn-info">Kelola Stok</a>
                    </div>
                </div>
            </div>
        </div>
        <a class="btn btn-danger btn-sm mb-3 float-end" href="<?= base_url('admin/logout'); ?>">Logout</a>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
