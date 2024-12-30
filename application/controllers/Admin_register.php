<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin_register extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Admin_register_model');
        $this->load->helper(array('form', 'url'));
        $this->load->library('form_validation');
    }

    public function index() {
        $this->form_validation->set_rules('username', 'Username', 'required|is_unique[admin.admin_username]');
        $this->form_validation->set_rules('name', 'Name', 'required');
        $this->form_validation->set_rules('password', 'Password', 'required');
        $this->form_validation->set_rules('email', 'Email', 'required|valid_email|is_unique[admin.admin_email]');

        if ($this->form_validation->run() == FALSE) {
            $this->load->view('admin_register');
        } else {
            $data = array(
                'admin_username' => $this->input->post('username'),
                'admin_name' => $this->input->post('name'),
                'admin_password' => $this->input->post('password'),
                'admin_email' => $this->input->post('email')
            );

            if ($this->Admin_register_model->insert_admin($data)) {
                $this->session->set_flashdata('success', 'Admin registered successfully!');
                redirect('admin_register');
            } else {
                $this->session->set_flashdata('error', 'Failed to register admin.');
                $this->load->view('admin_register');
            }
        }
    }
}