<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Home extends CI_Controller
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
        $query['cars'] = $this->Cars->get_home_cars(6); // Ambil data mobil untuk ditampilkan

        // Load view dengan data
        $this->load->view("templates/header", $query);
        $this->load->view("pages/home/index", $query);
        $this->load->view("templates/footer");
    }
}
