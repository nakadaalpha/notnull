<div class="d-flex overflow-hidden">
    <div class="d-flex flex-column flex-shrink-0 p-3 bg-light vh-100" style="width: 280px;">
        <a href="<?= base_url('dashboard'); ?>" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
            <i class="bi bi-display" style="font-size: 1.5rem; margin-right: .5rem;"></i>
            <span class="fs-4">Dashboard</span>
        </a>
        <hr>
        <ul class="nav nav-pills flex-column mb-auto">
            <li class="nav-item">
                <a href="<?= base_url('dashboard/cars'); ?>" class="nav-link text-dark">
                    <i class="bi bi-car-front-fill me-2"></i> Cars
                </a>
            </li>
            <li>
                <a href="<?= base_url('dashboard/brands'); ?>" class="nav-link text-dark">
                    <i class="bi bi-globe-americas me-2"></i> Brands
                </a>
            </li>
            <li>
                <a href="<?= base_url('dashboard/transactions'); ?>" class="nav-link text-dark">
                    <i class="bi bi-journal-text me-2"></i> Transactions
                </a>
            </li>
            <li>
                <a href="<?= base_url('dashboard/customers'); ?>" class="nav-link text-dark">
                    <i class="bi bi-people me-2"></i> Customers
                </a>
            </li>
            <li>
                <a href="<?= base_url('home'); ?>" class="nav-link text-dark">
                    <i class="bi bi-house me-2"></i> Home
                </a>
            </li>
        </ul>
        <hr>
        <div>
            <span class="fw-bold"><?= htmlspecialchars($admin->admin_name); ?></span>
            <a href="<?= base_url('auth/logout'); ?>" class="btn btn-danger btn-sm float-end">Logout</a>
        </div>
    </div>
    <div class="container mt-5 flex-grow-1">
        <h1 class="mb-4">Daftar Pelanggan</h1>
        <a href="<?php echo site_url('customer/tambah'); ?>" class="btn btn-success mb-3">Add customer</a>
        <div class="table-responsive" style="max-height: 70vh; overflow-y: auto;">
            <table class="table table-bordered table-hover table-striped">
                <thead class="table-dark" style="position: sticky; top: 0; z-index: 1020;">
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
    </div>
</div>

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