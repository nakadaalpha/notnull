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
    <div class="container vh-100 p-5" style="overflow-y: auto; width:100vw;">
        <h1 class="text-center mb-4">Edit Brand</h1>
        <form action="<?= base_url('dashboard/update_brand/' . $brand['brand_id']); ?>" method="post" enctype="multipart/form-data" class="needs-validation" novalidate>
            <div class="mb-3">
                <label for="brand_id" class="form-label">Brand Id</label>
                <input type="text" class="form-control" id="brand_id" name="brand_id" value="<?= $brand['brand_id']; ?>" required>
                <div class="invalid-feedback">Please enter the brand name.</div>
            </div>
            <div class="mb-3">
                <label for="car_brand" class="form-label">Brand Name</label>
                <input type="text" class="form-control" id="car_brand" name="car_brand" value="<?= $brand['car_brand']; ?>" required>
                <div class="invalid-feedback">Please enter the car type.</div>
            </div>
            <div class="mb-3">
                <label for="image" class="form-label">Car Image:</label>
                <input type="file" class="form-control" id="image" name="image">
                <div class="mt-2">
                    <img src="<?= base_url('public/src/images/brands/' . $brand['image']); ?>" alt="Car Image" class="img-thumbnail" width="150">
                </div>
            </div>

            <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary">Update</button>
                <a href="<?= base_url('dashboard/brands'); ?>" class="btn btn-secondary">Cancel</a>
            </div>
        </form>
    </div>
</div>