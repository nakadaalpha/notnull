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
            <a class="nav-link" href="contact">Contact</a>
          </li>
          <!-- <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="macanDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Macan Electric
            </a>
            <ul class="dropdown-menu" aria-labelledby="macanDropdown">
              <li><a class="dropdown-item" href="macan-4s">Macan 4S</a></li>
              <li><a class="dropdown-item" href="macan-turbo">Macan Turbo</a></li>
            </ul>
          </li> -->
          <li class="nav-item">
            <a class="nav-link" href="auth/login">Login</a>
          </li>
          <li class="nav-item">
            <?php if ($user): ?>
              Logged In as <?= htmlspecialchars($user->customer_username); ?>
            <?php else: ?>

            <?php endif; ?>
          </li>
          <?php if ($user): ?>
            <li class="nav-item">
              <button class="btn btn-danger"><a class="text-decoration-none text-black" href="auth/logout">Logout</a></button>
            </li>
          <?php endif; ?>
        </ul>
      </div>
    </div>
  </div>
</nav>

</html>