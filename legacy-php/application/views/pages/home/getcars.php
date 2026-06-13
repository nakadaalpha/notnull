<!DOCTYPE html>
<html>
<head>
    <title>Car List</title>
</head>
<body>
    <h1>Car List</h1>
    <table border="1">
        <thead>
            <tr>
                <th>Car ID</th>
                <th>Car Name</th>
                <th>Car Brand</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($cars as $car): ?>
                <tr>
                    <td><?php echo $car->car_id; ?></td>
                    <td><?php echo $car->car_name; ?></td>
                    <td><?php echo $car->car_brand; ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</body>
</html>
