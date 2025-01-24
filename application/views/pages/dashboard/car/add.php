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
            <span class="fw-bold"><?= htmlspecialchars($admin->admin_name); ?></span>
            <a href="<?= base_url('auth/logout'); ?>" class="btn btn-danger btn-sm float-end">Logout</a>
        </div>
    </div>
    <div class="container vh-100 p-5" style="overflow-y: auto; width:100vw;">
        <h2 class="mb-4">Add New Car</h2>
        <?php if ($this->session->flashdata('success')): ?>
            <div class="alert alert-success">
                <?= $this->session->flashdata('success'); ?>
            </div>
        <?php endif; ?>
        <?= validation_errors('<div class="alert alert-danger">', '</div>'); ?>
        <form action="<?= base_url('dashboard/add_cars_action') ?>" method="post" enctype="multipart/form-data">
            <div class="mb-3">
                <label for="car_name" class="form-label">Car Name</label>
                <input type="text" class="form-control" id="car_name" name="car_name" required>
            </div>
            <div class="mb-3">
                <label for="car_brand" class="form-label">Brand</label>
                <select name="car_brand" id="car_brand" class="form-select">
                    <option value="" disabled selected>Select Brands</option>
                    <?php foreach ($brands as $brand): ?>
                        <option value="<?php echo $brand['brand_id'] ?>"><?php echo $brand['car_brand'] ?></option>
                    <?php endforeach ?>
                </select>
            </div>
            <div class="mb-3">
                <label for="car_type" class="form-label">Car Type</label>
                <input type="text" class="form-control" id="car_type" name="car_type">
            </div>
            <div class="mb-3">
                <label for="year_made" class="form-label">Year Made</label>
                <input type="number" class="form-control" id="year_made" name="year_made" required>
            </div>
            <div class="mb-3">
                <label for="price" class="form-label">Price</label>
                <input type="number" class="form-control" id="price" name="price" required>
            </div>
            <div class="mb-3">
                <label for="stock" class="form-label">Stock</label>
                <input type="number" class="form-control" id="stock" name="stock" required>
            </div>
            <div class="mb-3">
                <label for="status" class="form-label">Status</label>
                <select class="form-select" id="status" name="status">
                    <option value="Available">Available</option>
                    <option value="Sold Out">Sold Out</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="car_spec" class="form-label">Specifications</label>
                <textarea class="form-control" id="car_spec" name="car_spec" rows="4"></textarea>
            </div>
            <div class="mb-3">
                <label for="car_image" class="form-label">Car Image</label>
                <input type="file" class="form-control" id="image" name="image">
            </div>
            <button type="submit" class="btn btn-primary">Add Car</button>
        </form>
    </div>
</div>