<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin extends CI_Controller {
    public function __construct() {
        parent::__construct();
        // Periksa apakah admin sudah login, jika belum, arahkan ke halaman login
        if (!$this->session->userdata('admin_id')) {
            redirect('admin/login');
        }
    }

    public function index() {
        // Data untuk ditampilkan di dashboard
        $data['admin_name'] = $this->session->userdata('admin_name');
        $this->load->view('pages/dashboard/index', $data);
    }

    public function logout() {
        // Hapus session terkait admin
        $this->session->unset_userdata('admin_id');
        $this->session->unset_userdata('admin_name');
        $this->session->sess_destroy();

        // Redirect ke halaman login admin
        redirect('login_admin');
    }
}