<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Car</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <div class="container mt-5">
        <h2 class="mb-4">Add New Car</h2>
        <?php if ($this->session->flashdata('success')): ?>
            <div class="alert alert-success">
                <?= $this->session->flashdata('success'); ?>
            </div>
        <?php endif; ?>
        <?= validation_errors('<div class="alert alert-danger">', '</div>'); ?>
        <form action="<?= base_url('car/add_cars_action') ?>" method="post" enctype="multipart/form-data">
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
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>