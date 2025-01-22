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
            <a href="<?= base_url('dashboard/users'); ?>" class="nav-link text-dark">
                <i class="bi bi-people me-2"></i> Users
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
        <span class="fw-bold"><?= $admin_name; ?></span>
        <a href="<?= base_url('auth/logout'); ?>" class="btn btn-danger btn-sm float-end">Logout</a>
    </div>
</div>

<!-- ``<div class="container mt-5">
    <h1 class="mb-4">Welcome, <?= $admin_name; ?>!</h1>
    <div class="row">
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body text-center">
                    <h5 class="card-title">Manage Cars</h5>
                    <p class="card-text">Manage Cars Data/Stock</p>
                    <a href="<?= base_url('car'); ?>" class="btn btn-primary">Cars Management</a>
                 </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body text-center">
                    <h5 class="card-title">Manage Brands</h5>
                    <p class="card-text">Manage Brands Data</p>
                    <a href="<?= base_url('brand'); ?>" class="btn btn-success">Brands Management</a>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body text-center">
                    <h5 class="card-title">Manage Transactions</h5>
                    <p class="card-text">Manage Transaction Data</p>
                    <a href="<?= base_url('transaction/save_transaction'); ?>" class="btn btn-info">Access Report</a>
                </div>
            </div>
        </div>
    </div>
</div> -->