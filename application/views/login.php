<div class="container">
    <div class="login-box rounded-5 bg-white">
        <?php if ($this->session->flashdata('error')): ?>
            <div class="alert alert-danger" role="alert">
                <?php echo $this->session->flashdata('error'); ?>
            </div>
        <?php endif; ?>
        <div class="row">
            <div class="col-sm-6">
                <div class="logo">
                    <span class="text-black">notnull</span>
                </div>
            </div>
        </div>
        <div class="row">

            <div class="col-sm-6 hide-on-mobile">
                <div id="demo" class="carousel slide" data-ride="carousel">
                    <div class="carousel">
                        <div class="carousel-item active rounded-1">
                            <div class="slider-feature-card rounded-5">
                                <img src="<?= base_url('public/src/images/brand/1.png'); ?>" alt="koenigsegg">
                                <h3 class="slider-title">Car Dealer</h3>
                                <p class="slider-description">Browse your favorite car!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6">
                <br>
                <h3 class="header-title">LOGIN</h3>
                <form class="login-form" action="<?php echo site_url('auth/logging_in'); ?>" method="post">
                    <div class="form-group">
                        <input type="text" class="form-control rounded-2" placeholder="username" name="username" id="password">
                    </div>
                    <div class="form-group">
                        <input type="Password" class="form-control rounded-2" placeholder="password" name="password" id="password">
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary btn-block">LOGIN</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>