<div class="container py-5">
    <div class="row">
        <div class="col-md-6">
            <img src="<?php echo base_url('public/src/images/cars/' . $car['car_image']); ?>" alt="<?php echo $car['car_name']; ?>" class="img-fluid">
        </div>
        <div class="col-md-6">
            <h1><?php echo $car['car_brand']; ?> <?php echo $car['car_name']; ?> <?php echo $car['car_type']; ?></h1>
            <p><strong>Year Made:</strong> <?php echo $car['year_made']; ?></p>
            <p><strong>Price:</strong> $<?php echo number_format($car['price'], 0, '.', ','); ?></p>
            <p><strong>Description:</strong> <?php echo $car['car_spec']; ?></p>
            <!-- Tombol Checkout -->
            <a href="<?php echo site_url('warehouse/checkout/' . $car['car_id']); ?>" class="btn btn-success">Checkout</a>
        </div>
    </div>
</div>
