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
            <div class="row brand-slider-row flex-nowrap overflow-auto">
              <!-- Loop Cards -->
              <div class="col-1 slider-item">
                <div class="card text-center border-0">
                  <div class="card-body p-2">
                    <img src="public/src/images/brand/1.png" class="img-fluid" alt="Brand 1">
                  </div>
                </div>
              </div>
              <div class="col-1 slider-item">
                <div class="card text-center border-0">
                  <div class="card-body p-2">
                    <img src="public/src/images/brand/1.png" class="img-fluid" alt="Brand 2">
                  </div>
                </div>
              </div>
              <div class="col-1 slider-item">
                <div class="card text-center border-0">
                  <div class="card-body p-2">
                    <img src="public/src/images/brand/1.png" class="img-fluid" alt="Brand 3">
                  </div>
                </div>
              </div>
              <div class="col-1 slider-item">
                <div class="card text-center border-0">
                  <div class="card-body p-2">
                    <img src="public/src/images/brand/1.png" class="img-fluid" alt="Brand 3">
                  </div>
                </div>
              </div>
              <div class="col-1 slider-item">
                <div class="card text-center border-0">
                  <div class="card-body p-2">
                    <img src="public/src/images/brand/1.png" class="img-fluid" alt="Brand 3">
                  </div>
                </div>
              </div>
              <div class="col-1 slider-item">
                <div class="card text-center border-0">
                  <div class="card-body p-2">
                    <img src="public/src/images/brand/1.png" class="img-fluid" alt="Brand 3">
                  </div>
                </div>
              </div>
              <div class="col-1 slider-item">
                <div class="card text-center border-0">
                  <div class="card-body p-2">
                    <img src="public/src/images/brand/1.png" class="img-fluid" alt="Brand 3">
                  </div>
                </div>
              </div>
              <div class="col-1 slider-item">
                <div class="card text-center border-0">
                  <div class="card-body p-2">
                    <img src="public/src/images/brand/1.png" class="img-fluid" alt="Brand 3">
                  </div>
                </div>
              </div>
              <div class="col-1 slider-item">
                <div class="card text-center border-0">
                  <div class="card-body p-2">
                    <img src="public/src/images/brand/1.png" class="img-fluid" alt="Brand 3">
                  </div>
                </div>
              </div>
              <div class="col-1 slider-item">
                <div class="card text-center border-0">
                  <div class="card-body p-2">
                    <img src="public/src/images/brand/1.png" class="img-fluid" alt="Brand 3">
                  </div>
                </div>
              </div>
              <div class="col-1 slider-item">
                <div class="card text-center border-0">
                  <div class="card-body p-2">
                    <img src="public/src/images/brand/1.png" class="img-fluid" alt="Brand 3">
                  </div>
                </div>
              </div>
              <div class="col-1 slider-item">
                <div class="card text-center border-0">
                  <div class="card-body p-2">
                    <img src="public/src/images/brand/1.png" class="img-fluid" alt="Brand 3">
                  </div>
                </div>
              </div>
              <div class="col-1 slider-item">
                <div class="card text-center border-0">
                  <div class="card-body p-2">
                    <img src="public/src/images/brand/1.png" class="img-fluid" alt="Brand 3">
                  </div>
                </div>
              </div>
              <div class="col-1 slider-item">
                <div class="card text-center border-0">
                  <div class="card-body p-2">
                    <img src="public/src/images/brand/1.png" class="img-fluid" alt="Brand 3">
                  </div>
                </div>
              </div>
              <div class="col-1 slider-item">
                <div class="card text-center border-0">
                  <div class="card-body p-2">
                    <img src="public/src/images/brand/1.png" class="img-fluid" alt="Brand 3">
                  </div>
                </div>
              </div>
              <div class="col-1 slider-item">
                <div class="card text-center border-0">
                  <div class="card-body p-2">
                    <img src="public/src/images/brand/1.png" class="img-fluid" alt="Brand 3">
                  </div>
                </div>
              </div>
              <!-- Additional cards can be added here -->
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="col-12 col-md-3">
        <div data-aos="fade-up" data-aos-once="true" data-aos-duration="450">
          <div class="p-3 border bg-white rounded shadow-sm">
            <h5 class="fw-bold border-bottom pb-2 mb-3">Filter</h5>
            <ul class="list-unstyled">
              <li class="mb-1">
                <button class="btn btn-toggle d-flex align-items-center w-100 border-0 bg-transparent p-0" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false">
                  Home
                </button>
                <div class="collapse" id="home-collapse">
                  <ul class="list-unstyled ps-3">
                    <li><a href="#" class="text-decoration-none">Overview</a></li>
                    <li><a href="#" class="text-decoration-none">Updates</a></li>
                    <li><a href="#" class="text-decoration-none">Reports</a></li>
                  </ul>
                </div>
              </li>
              <!-- Additional navigation items can be added here -->
            </ul>
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
                  <div class="card border-0 wrapper-car" onclick="location.href='catalog'">
                    <div class="parent-H">
                      <div class="parent-car">
                        <div class="child-car">
                          <img src="<?php echo base_url($item['car_image']); ?>" class="card-img-top" alt="Car Image">
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