<!------ Hero Section Start ------>
<section>
  <div class="mb-5">
    <img src="public/src/images/hero/home-hero.png" alt="Hero Image" width="100%">
  </div>
  <div class="container py-5">
    <div class="brand-header">
      HIGHLIGHT
    </div>
    <div class="row">
      <!-- Items -->
      <?php if (!empty($cars)) { // Pastikan data tidak kosong 
      ?>
        <?php foreach ($cars as $key => $item) {
          // Menghitung durasi AOS
          $aos_duration = 500 + (($key % 3) * 250);
        ?>
          <div class="col-lg-4 col-md-6 col-12 my-3">
            <div data-aos="fade-up" data-aos-once="true" data-aos-duration="<?php echo $aos_duration; ?>">
              <div class="wrapper-H rounded-4">
                <div class="parent-H">
                  <a href="https://www.koenigsegg.com/">
                    <div class="child-H">
                      <img src="<?php echo base_url($item['car_image']); ?>" class="img-fluid">
                    </div>
                    <div class="child-title-H">
                      <?php echo $item['car_brand']; ?>
                      <?php echo $item['car_name']; ?>
                      <?php echo $item['car_type']; ?>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        <?php } ?>
      <?php } else { ?>
        <p>Tidak ada data mobil tersedia.</p>
      <?php } ?>
<!------ Hero Section End ------>



<!------ Brand Selection Start ------>
<section class="brand-selection">
  <div class="container">
    <div class="brand-header">
      BRANDS
    </div>
    <div class="row">
      <div class="col-6 col-md-4 col-lg-3 my-3">
        <div data-aos="fade-up" data-aos-once="true" data-aos-duration="250">
          <div class="wrapper-brand-Home shadow rounded-4">
            <div class="parent-brand-Home">
              <a href="catalog">
                <div class="child-brand-Home">
                  <img src="public/src/images/brand/1.png" width="400px">
                </div>
                <div class="child-title-Home">
                  Koenigsegg
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-lg-3 my-3">
        <div data-aos="fade-up" data-aos-once="true" data-aos-duration="500">
          <div class="wrapper-brand-Home shadow rounded-4">
            <div class="parent-brand-Home">
              <a href="catalog">
                <div class="child-brand-Home">
                  <img src="public/src/images/brand/2.png" width="400px">
                </div>
                <div class="child-title-Home">
                  Ferrari
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-lg-3 my-3">
        <div data-aos="fade-up" data-aos-once="true" data-aos-duration="750">
          <div class="wrapper-brand-Home shadow rounded-4">
            <div class="parent-brand-Home">
              <a href="catalog">
                <div class="child-brand-Home">
                  <img src="public/src/images/brand/3.png" width="400px">
                </div>
                <div class="child-title-Home">
                  BMW
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-lg-3 my-3">
        <div data-aos="fade-up" data-aos-once="true" data-aos-duration="1000">
          <div class="wrapper-brand-Home shadow rounded-4">
            <div class="parent-brand-Home">
              <a href="catalog">
                <div class="child-brand-Home">
                  <img src="public/src/images/brand/4.png" width="400px">
                </div>
                <div class="child-title-Home">
                  Mercedes-Benz
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-lg-3 my-3">
        <div data-aos="fade-up" data-aos-once="true" data-aos-duration="250">
          <div class="wrapper-brand-Home shadow rounded-4">
            <div class="parent-brand-Home">
              <a href="catalog">
                <div class="child-brand-Home">
                  <img src="public/src/images/brand/5.png" width="400px">
                </div>
                <div class="child-title-Home">
                  McLaren
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-lg-3 my-3">
        <div data-aos="fade-up" data-aos-once="true" data-aos-duration="500">
          <div class="wrapper-brand-Home shadow rounded-">
            <div class="parent-brand-Home">
              <a href="catalog">
                <div class="child-brand-Home">
                  <img src="public/src/images/brand/6.png" width="400px">
                </div>
                <div class="child-title-Home">
                  Cadillac
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-lg-3 my-3">
        <div data-aos="fade-up" data-aos-once="true" data-aos-duration="750">
          <div class="wrapper-brand-Home shadow rounded-4">
            <div class="parent-brand-Home">
              <a href="catalog">
                <div class="child-brand-Home">
                  <img src="public/src/images/brand/7.png" width="400px">
                </div>
                <div class="child-title-Home">
                  Honda
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-lg-3 my-3">
        <div data-aos="fade-up" data-aos-once="true" data-aos-duration="1000">
          <div class="wrapper-brand-Home shadow rounded-4">
            <div class="parent-brand-Home">
              <a href="catalog">
                <div class="child-brand-Home">
                  <img src="public/src/images/brand/8.png" width="400px">
                </div>
                <div class="child-title-Home">
                  Bugatti
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<!------ Brand Selection End ------>

<!-- Tester Section Start-->

<section>

</section>


<!-- Tester Section End-->