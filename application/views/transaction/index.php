<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Form</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        body {
            background-color: #f8f9fa;
        }
        h1 {
            font-size: 2rem;
            font-weight: bold;
            color: #343a40;
        }
        .form-container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        }
        .btn-primary {
            background-color: #007bff;
            border-color: #007bff;
        }
        .btn-primary:hover {
            background-color: #0056b3;
            border-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container mt-5">
        <h1 class="mb-4 text-center">Add New Transaction</h1>
        <div class="form-container mx-auto">
            <form action="<?php echo site_url('transaction/store'); ?>" method="POST">
                <div class="mb-3">
                    <label for="customer_id" class="form-label">Customer ID</label>
                    <input type="text" class="form-control" id="customer_id" name="customer_id" placeholder="Enter Customer ID" required>
                </div>
                <div class="mb-3">
                    <label for="car_id" class="form-label">Car ID</label>
                    <input type="text" class="form-control" id="car_id" name="car_id" placeholder="Enter Car ID" required>
                </div>
                <div class="mb-3">
                    <label for="transaction_date" class="form-label">Transaction Date</label>
                    <input type="date" class="form-control" id="transaction_date" name="transaction_date" required>
                </div>
                <div class="mb-3">
                    <label for="amount" class="form-label">Amount</label>
                    <input type="number" class="form-control" id="amount" name="amount" placeholder="Enter Amount" required>
                </div>
                <div class="mb-3">
                    <label for="total_price" class="form-label">Total Price</label>
                    <input type="text" class="form-control" id="total_price" name="total_price" placeholder="Enter Total Price" required>
                </div>
                <div class="mb-3">
                    <label for="payment_method" class="form-label">Payment Method</label>
                    <select class="form-select" id="payment_method" name="payment_method" required>
                        <option value="" selected disabled>Select Payment Method</option>
                        <option value="cash">Cash</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="bank_transfer">Bank Transfer</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="status" class="form-label">Status</label>
                    <select class="form-select" id="status" name="status" required>
                        <option value="" selected disabled>Select Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary w-100">Submit</button>
            </form>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
