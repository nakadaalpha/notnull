<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class login_admin extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->model('Admin_model');
    }

    public function index() {
        $this->load->view('templates/header');
        $this->load->view('pages/login_admin');
        $this->load->view('templates/footer');
    }

    public function process() {
        $username = $this->input->post('username');
        $password = $this->input->post('password');

        $admin = $this->Admin_model->check_login($username, $password);

        if ($admin) {
            $this->session->set_userdata('admin_id', $admin['admin_id']);
            $this->session->set_userdata('admin_name', $admin['admin_name']);
            redirect('dashboard') ;
        } else {
            $this->session->set_flashdata('error', 'Invalid username or password');
            redirect('login_admin');
        }
    }

    public function logout() {
        $this->session->unset_userdata('admin_id');
        $this->session->unset_userdata('admin_name');
        redirect('login_admin');
    }
}