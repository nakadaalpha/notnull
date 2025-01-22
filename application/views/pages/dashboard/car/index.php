<div class="container mt-5">
    <h1 class="mb-4">Daftar Mobil</h1>
    <a href="<?= base_url('Car/add'); ?>" class="btn btn-primary mb-3">Tambah Mobil</a>
    <div class="table-responsive">
        <table class="table table-bordered table-hover">
            <thead class="table-dark">
                <tr>
                    <th>Brand</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Year</th>
                    <th>Specification</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Stock</th>

                </tr>
            </thead>
            <tbody>
                <?php foreach ($cars as $car): ?>
                    <tr>
                        <td><?= $car['car_brand']; ?></td>
                        <td><?= $car['car_name']; ?></td>
                        <td><?= $car['car_type']; ?></td>
                        <td><?= $car['year_made']; ?></td>
                        <td><?= $car['car_spec']; ?></td>
                        <td><?= number_format($car['price'], 0, ',', '.'); ?></td>
                        <td><?= $car['status']; ?></td>
                        <td><?= $car['stock']; ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>