<div class="mb-1">
    <img src="public/src/images/hero/warehouse.png" alt="Hero Image" width="100%">
</div>
<div class="container my-5">
  <div class="row g-4">
    <!-- Sidebar -->
    <div class="col-12 col-md-3">
      <div class="flex-shrink-0 p-3 border bg-white rounded shadow-sm">
        <a href="/" class="d-flex align-items-center pb-3 mb-3 link-body-emphasis text-decoration-none border-bottom">
          <svg class="bi pe-none me-2" width="30" height="24">
            <use xlink:href="#bootstrap" />
          </svg>
          <span class="fs-5 fw-semibold">Collapsible</span>
        </a>
        <ul class="list-unstyled ps-0">
          <li class="mb-1">
            <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false">
              Home
            </button>
            <div class="collapse" id="home-collapse">
              <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                <li><a href="#" class="link-body-emphasis d-inline-flex text-decoration-none rounded">Overview</a></li>
                <li><a href="#" class="link-body-emphasis d-inline-flex text-decoration-none rounded">Updates</a></li>
                <li><a href="#" class="link-body-emphasis d-inline-flex text-decoration-none rounded">Reports</a></li>
              </ul>
            </div>
          </li>
          <!-- Tambahkan opsi lain di sini -->
        </ul>
      </div>
    </div>

    <!-- Konten Mobil -->
    <div class="col-12 col-md-9">
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        <?php if (!empty($cars)) { // Pastikan data tidak kosong ?>
          <?php foreach ($cars as $key => $item) {
            $aos_duration = 500 + (($key % 3) * 250); ?>
            <div class="col">
              <div data-aos="fade-up" data-aos-once="true" data-aos-duration="<?php echo $aos_duration; ?>">
                <div class="card border-0 wrapper-car" onclick="location.href='catalog'">
                  <div class="parent-car">
                    <div class="child-car">
                      <img src="<?php echo base_url($item['car_image']); ?>" class="card-img-top" alt="Car Image">
                    </div>
                  </div>
                  <div class="card-body">
                    <h5 class="card-title"><?php echo $item['car_brand']; ?>
                      <?php echo $item['car_name']; ?>
                      <?php echo $item['car_type']; ?></h5>
                    <p class="card-text">Year: <?php echo $item['year_made'] ?></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="text-body fw-bold">$<?php echo number_format($item['price'], 0, '.', ','); ?></span>
                      <a href="#" class="btn btn-primary">View Details</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          <?php } ?>
        <?php } else { ?>
          <p>Tidak ada data mobil tersedia.</p>
        <?php } ?>
      </div>
    </div>
  </div>
</div>


