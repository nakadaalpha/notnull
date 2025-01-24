<div class="container mt-5">
    <h2 class="mb-4">Add New Car</h2>
    <?php if ($this->session->flashdata('success')): ?>
        <div class="alert alert-success">
            <?= $this->session->flashdata('success'); ?>
        </div>
    <?php endif; ?>
    <?= validation_errors('<div class="alert alert-danger">', '</div>'); ?>
    <form action="<?= base_url('dashboard/add_brands_action') ?>" method="post" enctype="multipart/form-data">
        <div class="mb-3">
            <label for="brand_id" class="form-label">Car Name</label>
            <input type="text" class="form-control" id="brand_id" name="brand_id" required>
        </div>
        <div class="mb-3">
            <label for="car_brand" class="form-label">Car Type</label>
            <input type="text" class="form-control" id="car_brand" name="car_brand">
        </div>
        <div class="mb-3">
            <label for="car_image" class="form-label">Car Image</label>
            <input type="file" class="form-control" id="image" name="image">
        </div>
        <button type="submit" class="btn btn-primary">Add Car</button>
    </form>
</div>