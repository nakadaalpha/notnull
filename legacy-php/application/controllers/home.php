<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Home extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Cars');
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

        $query['admin']     = $admin_data;
        $query['user']      = $user_data;
        $query['cars']      = $this->Cars->get_home_cars(6); // Ambil data mobil untuk ditampilkan
        $query['brands']    = $this->brands->get_home_brands(8); // Ambil data brand untuk ditampilkan

        // Load view dengan data
        $this->load->view("templates/header", $query);
        $this->load->view("pages/home/index", $query);
        $this->load->view("templates/footer");
    }

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

        $data['admin']  = $admin_data;
        $data['user']   = $user_data;
        $this->load->model('cars');
        $data['car']    = $this->cars->get_car_by_id($car_id);

        if (empty($data['car'])) {
            show_404(); // Tampilkan halaman 404 jika data tidak ditemukan
        }

        $this->load->view("templates/header", $data);
        $this->load->view("pages/warehouse/detail", $data);
        $this->load->view("templates/footer");
    }
}
