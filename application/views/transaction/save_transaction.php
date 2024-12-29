<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Details</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        body {
            background-color: #f4f4f4;
        }
        .detail-container {
            max-width: 600px;
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
        .btn-back {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="detail-container">
        <h1>Transaction Details</h1>
        <ul class="list-group mb-3">
            <li class="list-group-item"><strong>Customer ID:</strong> <?php echo htmlspecialchars($customer_id); ?></li>
            <li class="list-group-item"><strong>Car ID:</strong> <?php echo htmlspecialchars($car_id); ?></li>
            <li class="list-group-item"><strong>Transaction Date:</strong> <?php echo htmlspecialchars($transaction_date); ?></li>
            <li class="list-group-item"><strong>Amount:</strong> <?php echo htmlspecialchars($amount); ?></li>
            <li class="list-group-item"><strong>Total Price:</strong> <?php echo htmlspecialchars($total_price); ?></li>
            <li class="list-group-item"><strong>Payment Method:</strong> <?php echo htmlspecialchars($payment_method); ?></li>
            <li class="list-group-item"><strong>Status:</strong> <?php echo htmlspecialchars($status); ?></li>
        </ul>
        <a href="<?php echo site_url('transaction/create'); ?>" class="btn btn-primary btn-back">Back to Form</a>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
