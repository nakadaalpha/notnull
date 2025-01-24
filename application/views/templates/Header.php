<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>notnull</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <link href="<?= base_url('public/css/styles.css'); ?>" rel="stylesheet">
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
</head>
<nav class="navbar navbar-light bg-light sticky-top shadow-sm">
  <div class="container">

    <!-- Offcanvas Toggle Button -->
    <button class="navbar-button" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
      <img src="<?= base_url('public/src/icons/burger-icon.png'); ?>" alt="burger" width="70px">
    </button>

    <!-- Logo / Brand -->
    <div class="brand">
      <a class="navbar-brand" href="home">
        <img src="<?= base_url('public/src/images/logo/notnull-logo-text.png'); ?>" alt="brandlogo" width="200px">
      </a>
    </div>

    <!-- Offcanvas -->
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
      <div class="offcanvas-header">
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav justify-content-start flex-grow-1 pe-3">
          <li class="nav-item">
            <a class="nav-link" href="home">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="warehouse">Warehouse</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="transaction">Transaction</a>
          </li>
          <li class="nav-item">
            <?php if (!$user && !$admin): ?>
              <!-- Tampilkan tombol Login jika tidak ada user atau admin yang login -->
              <a class="nav-link" href="<?= base_url('auth/login'); ?>">Login</a>
            <?php endif; ?>
          </li>
          <li class="nav-item dropdown">
            <?php if ($user): ?>
              <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Logged In as <?= htmlspecialchars($user->customer_username); ?>
              </a>
            <?php else: ?>
            <?php endif; ?>
            <ul class="dropdown-menu">
              <?php if ($user): ?>
                <li class="nav-item">
                  <a class="dropdown-item text-decoration-none text-black" href="<?= base_url('auth/logout'); ?>">Logout</a>
                </li>
              <?php endif; ?>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <?php if ($admin): ?>
              <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Logged In as <?= htmlspecialchars($admin->admin_name); ?>
              </a>
            <?php else: ?>
            <?php endif; ?>
            <ul class="dropdown-menu">
              <?php if ($admin): ?>
                <li class="nav-item">
                  <a class="dropdown-item" href="dashboard">Dashboard</a>
                </li>
                <li class="nav-item">
                  <a class="dropdown-item text-decoration-none text-black" href="<?= base_url('auth/logout'); ?>">Logout</a>
                </li>
              <?php endif; ?>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>

</html>