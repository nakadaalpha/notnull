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
    <div class="container mt-5 flex-grow-1">
        <h1 class="mb-4 text-center">Cars</h1>
        <a href="<?= base_url('dashboard/add_car'); ?>" class="btn btn-success mb-3">Add car</a>
        <div class="table-responsive" style="max-height: 70vh; overflow-y: auto;">
            <table class="table table-bordered table-hover table-striped">
                <thead class="table-dark" style="position: sticky; top: 0; z-index: 1020;">
                    <tr class="text-center">
                        <th>Image</th>
                        <th>Brand</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Year</th>
                        <th>Specification</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($cars as $car): ?>
                        <tr>
                            <!-- Kolom untuk Gambar -->
                            <td class="text-center">
                                <img src="<?= base_url('public/src/images/cars/' . $car['car_image']); ?>" 
                                     alt="Car Image" 
                                     class="img-thumbnail" 
                                     style="width: 100px; height: 75px; object-fit: cover;">
                            </td>
                            <td class="text-center"><?= $car['car_brand']; ?></td>
                            <td class="text-center"><?= $car['car_name']; ?></td>
                            <td class="text-center"><?= $car['car_type']; ?></td>
                            <td class="text-center"><?= $car['year_made']; ?></td>
                            <td class="text-center"><?= $car['car_spec']; ?></td>
                            <td class="text-end">$<?= number_format($car['price'], 0, ',', '.'); ?></td>
                            <td class="<?= $car['status'] === 'Available' ? 'text-success text-center' : 'text-danger text-center'; ?>">
                                <?= $car['status']; ?>
                            </td>
                            <td class="text-center"><?= $car['stock']; ?></td>
                            <td class="text-center">
                                <a href="<?= base_url('dashboard/edit_car/' . $car['car_id']); ?>" 
                                   class="btn btn-warning btn-sm">Edit</a>
                                <a href="<?= base_url('dashboard/delete_car/' . $car['car_id']); ?>" 
                                   class="btn btn-danger btn-sm" 
                                   onclick="return confirm('Are you sure you want to delete this car?');">Delete</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>