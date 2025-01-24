<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Car</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <h2 class="text-center mb-4">Edit Car</h2>
        
        <!-- Flash Message -->
        <?php if ($this->session->flashdata('success')): ?>
            <div class="alert alert-success"><?= $this->session->flashdata('success'); ?></div>
        <?php elseif ($this->session->flashdata('error')): ?>
            <div class="alert alert-danger"><?= $this->session->flashdata('error'); ?></div>
        <?php endif; ?>

        <form action="<?= base_url('Car/update/' . $car['car_id']); ?>" method="post">
            <div class="card shadow-lg p-4">
                <!-- Car Name -->
                <div class="mb-3">
                    <label for="name" class="form-label">Car Name</label>
                    <input type="text" class="form-control" id="name" name="name" value="<?= $car['name']; ?>" required>
                </div>

                <!-- Brand -->
                <div class="mb-3">
                    <label for="brand" class="form-label">Brand</label>
                    <input type="text" class="form-control" id="brand" name="brand" value="<?= $car['brand']; ?>" required>
                </div>

                <!-- Type -->
                <div class="mb-3">
                    <label for="type" class="form-label">Type</label>
                    <input type="text" class="form-control" id="type" name="type" value="<?= $car['type']; ?>" required>
                </div>

                <!-- Year -->
                <div class="mb-3">
                    <label for="year" class="form-label">Year</label>
                    <input type="number" class="form-control" id="year" name="year" value="<?= $car['year']; ?>" required>
                </div>

                <!-- Price -->
                <div class="mb-3">
                    <label for="price" class="form-label">Price</label>
                    <input type="number" class="form-control" id="price" name="price" value="<?= $car['price']; ?>" required>
                </div>

                <!-- Status -->
                <div class="mb-3">
                    <label for="status" class="form-label">Status</label>
                    <select class="form-select" id="status" name="status" required>
                        <option value="Available" <?= $car['status'] == 'Available' ? 'selected' : ''; ?>>Available</option>
                        <option value="Unavailable" <?= $car['status'] == 'Unavailable' ? 'selected' : ''; ?>>Unavailable</option>
                    </select>
                </div>

                <!-- Stock -->
                <div class="mb-3">
                    <label for="stock" class="form-label">Stock</label>
                    <input type="number" class="form-control" id="stock" name="stock" value="<?= $car['stock']; ?>" required>
                </div>

                <!-- Buttons -->
                <div class="d-flex justify-content-between">
                    <a href="<?= base_url('Car'); ?>" class="btn btn-secondary">Back</a>
                    <button type="submit" class="btn btn-primary">Update Car</button>
                </div>
            </div>
        </form>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
