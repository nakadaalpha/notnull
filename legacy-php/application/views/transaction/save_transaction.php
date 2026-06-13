<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saved Transactions</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Saved Transactions</h1>
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Transaction ID</th>
                    <th>Customer ID</th>
                    <th>Car ID</th>
                    <th>Transaction Date</th>
                    <th>Amount</th>
                    <th>Total Price</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!empty($transactions)) : ?>
                    <?php foreach ($transactions as $transaction) : ?>
                        <tr>
                            <td><?= $transaction['transaction_id']; ?></td>
                            <td><?= $transaction['customer_id']; ?></td>
                            <td><?= $transaction['car_id']; ?></td>
                            <td><?= $transaction['transaction_date']; ?></td>
                            <td><?= $transaction['amount']; ?></td>
                            <td><?= $transaction['total_price']; ?></td>
                            <td><?= $transaction['payment_method']; ?></td>
                            <td><?= $transaction['status']; ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php else : ?>
                    <tr>
                        <td colspan="8" class="text-center">No transactions found.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
        <a href="<?= site_url('home'); ?>" class="btn btn-primary mt-3">Back to Home</a>
    </div>
</body>
</html>
