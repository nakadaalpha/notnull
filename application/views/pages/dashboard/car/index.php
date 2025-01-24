<div class="container mt-5">
    <h1 class="mb-4 text-center">Cars</h1>
    <a href="<?= base_url('Car/add'); ?>" class="btn btn-success mb-3">Add car</a>
    <div class="table-responsive">
        <table class="table table-bordered table-hover table-striped">
            <thead class="table-dark">
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
                            <a href="<?= base_url('Car/edit/' . $car['car_id']); ?>" 
                               class="btn btn-warning btn-sm">Edit</a>
                            <a href="<?= base_url('Car/delete/' . $car['car_id']); ?>" 
                               class="btn btn-danger btn-sm" 
                               onclick="return confirm('Are you sure you want to delete this car?');">Delete</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
