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
      <!----- CarItems ----->
      <?php if (!empty($cars)) { // Pastikan data tidak kosong 
      ?>
        <?php foreach ($cars as $key => $car) {
          // Menghitung durasi AOS
          $aos_duration = 500 + (($key % 3) * 250);
        ?>
          <div class="col-lg-4 col-md-6 col-12 my-3">
            <div data-aos="fade-up" data-aos-once="true" data-aos-duration="<?php echo $aos_duration; ?>">
              <div class="wrapper-H rounded-4" onclick="location.href='warehouse'">
                <div class="parent-H">
                  <div class="child-H">
                    <img src="<?php echo base_url($car['car_image']); ?>" class="img-fluid">
                  </div>
                  <div class="child-title-H">
                    <?php echo $car['car_brand']; ?>
                    <?php echo $car['car_name']; ?>
                    <?php echo $car['car_type']; ?>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <?php } ?>
      <?php } else { ?>
        <p>There is no car available right now</p>
      <?php } ?>
      <!------ Hero Section End ------>



      <!------ Brand Selection Start ------>
      <section class="brand-selection">
        <div class="container">
          <div class="brand-header">
            BRANDS
          </div>
          <div class="row">
            <!----- CarItems ----->
            <?php if (!empty($brands)) { // Pastikan data tidak kosong 
            ?>
              <?php foreach ($brands as $key => $brand) {
                // Menghitung durasi AOS
                $aos_duration = 500 + (($key % 4) * 250);
              ?>
                <div class="col-6 col-md-4 col-lg-3 my-3">
                  <div data-aos="fade-up" data-aos-once="true" data-aos-duration="<?php echo $aos_duration?>">
                    <div class="wrapper-brand-Home shadow-sm rounded-4">
                      <div class="parent-brand-Home">
                        <a href="catalog">
                          <div class="child-brand-Home">
                            <img src="<?php echo base_url($brand['image']); ?>" width="400px">
                          </div>
                          <div class="child-title-Home">
                            <?php echo $brand['brand_name']; ?>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              <?php } ?>
            <?php } else { ?>
              <p>There is no brand available right now</p>
            <?php } ?>
          </div>
        </div>
      </section>
      <!------ Brand Selection End ------>