<div class="form-container">
    <h1>Checkout Transaction</h1>
    <?php echo validation_errors(); ?>
    <form action="<?php echo site_url('transaction/create'); ?>" method="POST">
        <div class="mb-3">
            <input type="text" class="form-control" name="customer_id" value="<?php echo $customer_id; ?>" readonly>
        </div>
        <div class="mb-3">
            <input type="text" class="form-control" name="car_id" value="<?php echo $car_id; ?>" readonly>
        </div>
        <div class="mb-3">
            <input type="text" class="form-control" value="<?php echo $car_name; ?>" readonly>
        </div>
        <div class="mb-3">
            <input type="number" class="form-control" name="amount" placeholder="Amount" required>
        </div>
        <div class="mb-3">
            <input type="text" class="form-control" name="total_price" value="<?php echo $price; ?>" readonly>
        </div>
        <div class="mb-3">
            <select class="form-select" name="payment_method" required>
                <option value="" disabled selected>Payment Method</option>
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
            </select>
        </div>
        <div class="mb-3">
            <select class="form-select" name="status" required>
                <option value="pending" selected>Pending</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">Confirm Transaction</button>
    </form>
</div>
