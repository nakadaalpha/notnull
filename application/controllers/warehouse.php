<?php
class warehouse extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('cars');
        $this->load->model('brands');
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

        $admin_data = null; // Default user data kosong
        if ($this->session->userdata('admin_id')) {
            $admin_id = $this->session->userdata('admin_id'); // Ambil user_id dari session
            $admin_data = $this->UserModel->get_admin_by_id($admin_id); // Ambil data user
        }

        // Ambil parameter sorting dari URL
        $sort_year = $this->input->get('sort_year');
        $sort_price = $this->input->get('sort_price');

        $brand_id = $this->input->get('brand_id'); // Ambil brand_id dari query parameter

        if ($brand_id) {
            $query['cars'] = $this->cars->get_cars_by_brand($brand_id); // Ambil mobil berdasarkan brand
            $query['selected_brand'] = $this->brands->get_brands_by_id($brand_id); // Opsional: Detail brand
        } else {
            $query['cars'] = $this->cars->get_all_cars(); // Jika tidak ada filter, tampilkan semua mobil
        }

        // Ambil data mobil untuk halaman home
        $query['admin']     = $admin_data;
        $query['user']      = $user_data;
        $query['cars']      = $this->cars->get_all_cars($sort_year, $sort_price);
        $query['brands'] = $this->brands->get_all_brands();

        $this->load->view("templates/header", $query);
        $this->load->view("pages/warehouse/index", $query);
        $this->load->view("templates/footer");
    }

    // public function filter_by_brand()
    // {
        

    //     $query['brands'] = $this->brands->get_all_brands(); // Semua brand untuk dropdown filter

    //     $this->load->view('warehouse', $data);
    // }

    public function detail($car_id)
    {
        $user_data = null; // Default user data kosong
        if ($this->session->userdata('user_id')) {
            $user_id = $this->session->userdata('user_id'); // Ambil user_id dari session
            $user_data = $this->UserModel->get_user_by_id($user_id); // Ambil data user
        }

        $admin_data = null; // Default user data kosong
        if ($this->session->userdata('admin_id')) {
            $admin_id = $this->session->userdata('admin_id'); // Ambil user_id dari session
            $admin_data = $this->UserModel->get_admin_by_id($admin_id); // Ambil data user
        }

        $query['admin']     = $admin_data;
        $query['user']      = $user_data;
        $query['car']       = $this->cars->get_car_by_id($car_id);

        if (empty($query['car'])) {
            show_404();
        }

        $this->load->view("templates/header", $query);
        $this->load->view("pages/warehouse/detail", $query);
        $this->load->view("templates/footer");
    }
}
