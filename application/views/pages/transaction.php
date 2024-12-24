<html>
<head>
    <title>Transaction List</title>
</head>
<body>
    <h1>Transaction List</h1>
    <a href="<?php echo site_url('transaction/create'); ?>">Add New Transaction</a>
    <table border="1">
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
            <?php foreach ($transactions as $transaction): ?>
                <tr>
                    <td><?php echo $transaction['transaction_id']; ?></td>
                    <td><?php echo $transaction['customer_id']; ?></td>
                    <td><?php echo $transaction['car_id']; ?></td>
                    <td><?php echo $transaction['transaction_date']; ?></td>
                    <td><?php echo $transaction['amount']; ?></td>
                    <td><?php echo $transaction['total_price']; ?></td>
                    <td><?php echo $transaction['payment_method']; ?></td>
                    <td><?php echo $transaction['status']; ?></td>
                    <td>
                        <a href="<?php echo site_url('transaction/delete/' . $transaction['transaction_id']); ?>">Delete</a>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</body>
</html>
