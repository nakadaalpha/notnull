<?php
defined('BASEPATH') or exit('No direct script access allowed');

class auth extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('UserModel');
        $this->load->library('session');
    }

    // Halaman Login
    public function index()
    {
        $this->load->view('templates/header');
        $this->load->view('login');
        $this->load->view('templates/footer');
    }

    // Proses Login
    public function logging_in()
    {
        $username = $this->input->post('username');
        $password = $this->input->post('password');

        // Cek login sebagai admin
        $admin = $this->UserModel->login_admin($username, $password);

        if ($admin) {
            $this->session->set_userdata([
                'admin_id' => $admin['admin_id'],
                'admin_name' => $admin['admin_username'],
                'role' => 'admin',
                'logged_in' => TRUE
            ]);
            redirect('dashboard');
        }

        // Cek login sebagai customer
        $customer = $this->UserModel->login_customer($username, $password);

        if ($customer) {
            $this->session->set_userdata([
                'user_id' => $customer['customer_id'],
                'username' => $customer['customer_username'],
                'role' => 'customer',
                'logged_in' => TRUE
            ]);
            redirect('home');
        }

        // Jika gagal
        $this->session->set_flashdata('error', 'Invalid username or password');
        redirect('auth/login');
    }

    // Logout
    public function logout()
    {
        $this->session->sess_destroy();
        redirect('auth/login');
    }
}
