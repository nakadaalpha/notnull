<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction List</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        .table thead th {
            background-color: #f8f9fa;
        }
        .action-buttons a {
            margin-right: 5px;
        }
    </style>
</head>
<body>
    <div class="container mt-5">
        <h1 class="mb-4 text-center">Transaction List</h1>
        
        <!-- Button to Add New Transaction -->
        <div class="d-flex justify-content-between mb-3">
            <a href="<?php echo site_url('transaction/create'); ?>" class="btn btn-primary">Add New Transaction</a>
            <form method="GET" action="<?php echo site_url('transaction'); ?>" class="d-flex">
                <input type="text" name="search" class="form-control me-2" placeholder="Search transactions..." value="<?php echo $this->input->get('search'); ?>">
                <button type="submit" class="btn btn-outline-secondary">Search</button>
            </form>
        </div>

        <!-- Transaction Table -->
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer ID</th>
                        <th>Car ID</th>
                        <th>Transaction Date</th>
                        <th>Amount</th>
                        <th>Total Price</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (!empty($transactions)): ?>
                        <?php foreach ($transactions as $transaction): ?>
                            <tr>
                                <td><?php echo $transaction['transaction_id']; ?></td>
                                <td><?php echo $transaction['customer_id']; ?></td>
                                <td><?php echo $transaction['car_id']; ?></td>
                                <td><?php echo $transaction['transaction_date']; ?></td>
                                <td><?php echo number_format($transaction['amount']); ?></td>
                                <td><?php echo number_format($transaction['total_price']); ?></td>
                                <td><?php echo ucfirst($transaction['payment_method']); ?></td>
                                <td>
                                    <span class="badge <?php echo $transaction['status'] == 'completed' ? 'bg-success' : 'bg-warning'; ?>">
                                        <?php echo ucfirst($transaction['status']); ?>
                                    </span>
                                </td>
                                <td class="action-buttons">
                                    <a href="<?php echo site_url('transaction/edit/' . $transaction['transaction_id']); ?>" class="btn btn-sm btn-warning">Edit</a>
                                    <a href="<?php echo site_url('transaction/delete/' . $transaction['transaction_id']); ?>" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this transaction?');">Delete</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="9" class="text-center">No transactions found.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
