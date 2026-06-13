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
        <h1 class="text-center mb-4">Edit Car</h1>
        <form action="<?= base_url('car/update/' . $car['car_id']); ?>" method="post" enctype="multipart/form-data" class="needs-validation" novalidate>
            <div class="mb-3">
                <label for="car_name" class="form-label">Car Name:</label>
                <input type="text" class="form-control" id="car_name" name="car_name" value="<?= $car['car_name']; ?>" required>
                <div class="invalid-feedback">Please enter the car name.</div>
            </div>

            <div class="mb-3">
                <label for="car_brand" class="form-label">Brand:</label>
                <select class="form-select" id="car_brand" name="car_brand" required>
                    <option value="" disabled selected><?= $car['car_brand']; ?></option>
                    <?php foreach ($brands as $brand): ?>
                        <option value="<?= $brand['brand_id']; ?>" <?= $brand['brand_id'] == $car['car_brand'] ? 'selected' : ''; ?>><?= $brand['car_brand']; ?></option>
                    <?php endforeach; ?>
                </select>
                <div class="invalid-feedback">Please select a brand.</div>
            </div>

            <div class="mb-3">
                <label for="car_type" class="form-label">Type:</label>
                <input type="text" class="form-control" id="car_type" name="car_type" value="<?= $car['car_type']; ?>" required>
                <div class="invalid-feedback">Please enter the car type.</div>
            </div>

            <div class="mb-3">
                <label for="year_made" class="form-label">Year:</label>
                <input type="number" class="form-control" id="year_made" name="year_made" value="<?= $car['year_made']; ?>" required>
                <div class="invalid-feedback">Please enter the manufacturing year.</div>
            </div>

            <div class="mb-3">
                <label for="price" class="form-label">Price:</label>
                <input type="text" class="form-control" id="price" name="price" value="<?= $car['price']; ?>" required>
                <div class="invalid-feedback">Please enter the car price.</div>
            </div>

            <div class="mb-3">
                <label for="stock" class="form-label">Stock:</label>
                <input type="number" class="form-control" id="stock" name="stock" value="<?= $car['stock']; ?>" required>
                <div class="invalid-feedback">Please enter the stock quantity.</div>
            </div>

            <div class="mb-3">
                <label for="status" class="form-label">Status:</label>
                <select class="form-select" id="status" name="status" required>
                    <option value="Available" <?= $car['status'] == 'Available' ? 'selected' : ''; ?>>Available</option>
                    <option value="Unavailable" <?= $car['status'] == 'Unavailable' ? 'selected' : ''; ?>>Unavailable</option>
                </select>
                <div class="invalid-feedback">Please select the car status.</div>
            </div>

            <div class="mb-3">
                <label for="car_spec" class="form-label">Specification:</label>
                <textarea class="form-control" id="car_spec" name="car_spec" rows="4" required><?= $car['car_spec']; ?></textarea>
                <div class="invalid-feedback">Please enter the car specifications.</div>
            </div>

            <div class="mb-3">
                <label for="car_image" class="form-label">Car Image:</label>
                <input type="file" class="form-control" id="car_image" name="car_image">
                <div class="mt-2">
                    <img src="<?= base_url('public/src/images/cars/' . $car['car_image']); ?>" alt="Car Image" class="img-thumbnail" width="150">
                </div>
            </div>

            <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary">Update</button>
                <a href="<?= base_url('dashboard/cars'); ?>" class="btn btn-secondary">Cancel</a>
            </div>
        </form>
    </div>
</div>