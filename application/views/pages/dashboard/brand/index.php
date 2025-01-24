<div class="container mt-5">
    <h1 class="mb-4 text-center">Brands</h1>
    <a href="<?= base_url('brand/add'); ?>" class="btn btn-success mb-3">Add brand</a>
    <div class="table-responsive">
        <table class="table table-bordered table-hover table-striped">
            <thead class="table-dark">
                <tr class="text-center">
                    <th>Brand id</th>
                    <th>Brand name</th>
                    <th>Image</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($brands as $brand): ?>
                    <tr>
                        <!-- Kolom untuk Gambar -->
                        <td class="text-center"><?= $brand['brand_id']; ?></td>
                        <td class="text-center"><?= $brand['car_brand']; ?></td>
                        <td class="text-center">
                            <img src="<?= base_url('public/src/images/brands/' . $brand['image']); ?>" 
                                 alt="Brand Image"
                                 class="img-thumbnail" 
                                 style="width: 100px; height: 100px; object-fit: cover;">
                        </td>
                        <td class="text-center">
                            <a href="<?= base_url('Car/edit/' . $brand['brand_id']); ?>" 
                               class="btn btn-warning btn-sm">Edit</a>
                            <a href="<?= base_url('Car/delete/' . $brand['brand_id']); ?>" 
                               class="btn btn-danger btn-sm" 
                               onclick="return confirm('Are you sure you want to delete this car?');">Delete</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
