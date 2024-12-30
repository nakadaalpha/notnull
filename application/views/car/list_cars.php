<h1>Daftar Mobil</h1>
<a href="<?= base_url('Car/add'); ?>">Tambah Mobil</a>
<table border="1">
    <thead>
        <tr>
            <th>Nama</th>
            <th>Merek</th>
            <th>Harga</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($cars as $car): ?>
            <tr>
                <td><?= $car['car_name']; ?></td>
                <td><?= $car['car_brand']; ?></td>
                <td><?= $car['price']; ?></td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>
