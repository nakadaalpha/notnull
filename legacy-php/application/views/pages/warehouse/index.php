<div class="hero-wrapper position-relative">
  <img src="public/src/images/hero/warehouse.png" alt="Hero Image" class="img-fluid w-100">
</div>

<section class="position-relative warehouse">
  <div class="container py-5">
    <div class="row g-4">
      <!-- Brand Slider -->
      <div class="col-12">
        <div class="brand-slider bg-white shadow-sm">
          <div class="container">
            <div class="row brand-slider-row flex-nowrap overflow-auto" id="brandSlider">
              <!-- Loop Cards -->
              <?php if (!empty($brands)) { ?>
                <?php foreach ($brands as $key => $brand) { ?>
                  <div class="col-1 slider-item">
                    <div class="cardio text-center border-0">
                      <div class="card-body p-2">
                        <img src="<?= base_url('public/src/images/brands/' . $brand['image']) ?>" class="img-fluid" alt="Brand <?= $key + 1 ?>">
                      </div>
                    </div>
                  </div>
                <?php } ?>
                <!-- Duplikasi Elemen -->
                <?php foreach ($brands as $key => $brand) { ?>
                  <div class="col-1 slider-item">
                    <div class="cardio text-center border-0">
                      <div class="card-body p-2">
                        <img src="<?= base_url('public/src/images/brands/' . $brand['image']) ?>" class="img-fluid" alt="Brand <?= $key + 1 ?> (Copy)">
                      </div>
                    </div>
                  </div>
                <?php } ?>
              <?php } else { ?>
                <p>No brands available.</p>
              <?php } ?>

            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="col-12 col-md-3">
        <div data-aos="fade-right" data-aos-once="true" data-aos-duration="450">
          <div class="p-3 border bg-white rounded shadow-sm">
            <h5 class="fw-bold border-bottom pb-2 mb-3">Filter</h5>
            <form method="GET" action="<?php echo site_url('warehouse'); ?>">
              <!-- Sort by Year -->
              <div class="mb-3">
                <label for="sortYear" class="form-label">Sort by Year</label>
                <select class="form-select" name="sort_year" id="sortYear">
                  <option value="">Select</option>
                  <option value="asc">Oldest to Newest</option>
                  <option value="desc">Newest to Oldest</option>
                </select>
              </div>
              <!-- Sort by Price -->
              <div class="mb-3">
                <label for="sortPrice" class="form-label">Sort by Price</label>
                <select class="form-select" name="sort_price" id="sortPrice">
                  <option value="">Select</option>
                  <option value="asc">Lowest to Highest</option>
                  <option value="desc">Highest to Lowest</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary w-100">Apply</button>
            </form>
          </div>
        </div>
      </div>


      <!-- Car Content -->
      <div class="col-12 col-md-9">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          <?php if (!empty($cars)) { ?>
            <?php foreach ($cars as $key => $item) {
              $aos_duration = 500 + (($key % 3) * 250); ?>
              <div class="col">
                <div data-aos="fade-up" data-aos-once="true" data-aos-duration="<?php echo $aos_duration; ?>">
                  <div class="card border-0 wrapper-car" onclick="location.href='<?php echo site_url('warehouse/detail/' . $item['car_id']); ?>'">
                    <div class="parent-H">
                      <div class="parent-car">
                        <div class="child-car">
                          <img src="<?php echo base_url('public/src/images/cars/' . $item['car_image']); ?>" class="card-img-top" alt="Car Image">
                        </div>
                      </div>
                    </div>
                    <div class="card-body bg-light">
                      <h5 class="card-title">
                        <?php echo $item['car_brand']; ?> <?php echo $item['car_name']; ?> <?php echo $item['car_type']; ?>
                      </h5>
                      <p class="card-text">Year: <?php echo $item['year_made']; ?></p>
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="text-body fw-bold">$
                          <?php echo number_format($item['price'], 0, '.', ','); ?>
                        </span>
                        <a href="#" class="btn btn-primary">View Details</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            <?php } ?>
          <?php } else { ?>
            <p>No cars available.</p>
          <?php } ?>
        </div>
      </div>
    </div>
  </div>
</section>