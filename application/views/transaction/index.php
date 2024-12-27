<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Transaction</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        body {
            background-color: #f4f4f4;
        }
        .form-container {
            max-width: 500px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            margin: 50px auto;
        }
        h1 {
            font-size: 1.5rem;
            margin-bottom: 20px;
            text-align: center;
            color: #333;
        }
        .btn-primary {
            width: 100%;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <h1>Add Transaction</h1>
        <form action="<?php echo site_url('transaction/store'); ?>" method="POST">
            <div class="mb-3">
                <input type="text" class="form-control" name="customer_id" placeholder="Customer ID" required>
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" name="car_id" placeholder="Car ID" required>
            </div>
            <div class="mb-3">
                <input type="date" class="form-control" name="transaction_date" required>
            </div>
            <div class="mb-3">
                <input type="number" class="form-control" name="amount" placeholder="Amount" required>
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" name="total_price" placeholder="Total Price" required>
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
                    <option value="" disabled selected>Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Save Transaction</button>
        </form>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
