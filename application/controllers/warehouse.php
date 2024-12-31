<?php
class warehouse extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('Cars');
        $this->load->model('UserModel');
        $this->load->library('session');
    }

    public function index()
    {
        // Periksa apakah ada session aktif
        $user_data = null; // Default user data kosong
        if ($this->session->userdata('user_id')) {
            $user_id = $this->session->userdata('user_id'); // Ambil user_id dari session
            $user_data = $this->UserModel->get_user_by_id($user_id); // Ambil data user
        }

        // Ambil data mobil untuk halaman home
        $query['user'] = $user_data; // Jika user tidak login, ini tetap null
        $this->load->model('cars');

        // Ambil parameter sorting dari URL
        $sort_year = $this->input->get('sort_year');
        $sort_price = $this->input->get('sort_price');

        // Dapatkan data mobil dengan pengurutan
        $query['cars'] = $this->cars->get_all_cars($sort_year, $sort_price);

        $this->load->view("templates/header", $query);
        $this->load->view("pages/warehouse/index", $query);
        $this->load->view("templates/footer");
    }


    public function detail($car_id)
    {
        $user_data = null; // Default user data kosong
        if ($this->session->userdata('user_id')) {
            $user_id = $this->session->userdata('user_id'); // Ambil user_id dari session
            $user_data = $this->UserModel->get_user_by_id($user_id); // Ambil data user
        }

        $data['user'] = $user_data;
        $this->load->model('cars');
        $data['car'] = $this->cars->get_car_by_id($car_id);

        if (empty($data['car'])) {
            show_404(); // Tampilkan halaman 404 jika data tidak ditemukan
        }

        $this->load->view("templates/header", $data);
        $this->load->view("pages/warehouse/detail", $data);
        $this->load->view("templates/footer");
    }
}
