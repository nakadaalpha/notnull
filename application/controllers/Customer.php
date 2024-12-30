<?php
// application/controllers/Customer.php

class Customer extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->model('CustomerModel');
        $this->load->helper('url');
        $this->load->library('form_validation');
    }

    public function index() {
        $data['customers'] = $this->CustomerModel->getAllCustomers();
        $this->load->view('customer/index', $data);
    }

    public function tambah() {
        $this->form_validation->set_rules('customer_username', 'Username', 'required');
        $this->form_validation->set_rules('customer_password', 'Password', 'required');
        $this->form_validation->set_rules('customer_email', 'Email', 'required|valid_email');
        $this->form_validation->set_rules('customer_phonenumb', 'Phone Number', 'required');
        $this->form_validation->set_rules('customer_address', 'Address', 'required');
    
        if ($this->form_validation->run() === FALSE) {
            $this->load->view('customer/tambah');
        } else {
            $data = [
                'customer_username' => $this->input->post('customer_username'),
                'customer_password' => $this->input->post('customer_password'),
                'customer_email' => $this->input->post('customer_email'),
                'customer_phonenumb' => $this->input->post('customer_phonenumb'),
                'customer_address' => $this->input->post('customer_address')
            ];
    
            if ($this->CustomerModel->addCustomer($data)) {
                redirect('customer');
            } else {
                show_error('Gagal menambahkan data pelanggan');
            }
        }
    }
    

    public function edit($id) {
        $data['customer'] = $this->CustomerModel->getCustomerById($id);

        $this->form_validation->set_rules('customer_username', 'username', 'required');
        $this->form_validation->set_rules('customer_password', 'password', 'required');
        $this->form_validation->set_rules('customer_email', 'email', 'required|valid_email');
        $this->form_validation->set_rules('customer_phonenumb', 'phone number', 'required');
        $this->form_validation->set_rules('customer_address', 'address', 'required');

        if ($this->form_validation->run() === FALSE) {
            $this->load->view('customer/edit', $data);  
        } else {
            $data = [
                'customer_username' => $this->input->post('customer_username'),
                'customer_password' => $this->input->post('customer_password'),
                'customer_email' => $this->input->post('customer_email'),
                'customer_phonenumb' => $this->input->post('customer_phonenumb'),
                'customer_address' => $this->input->post('customer_address')
            ];
            $this->CustomerModel->updateCustomer($id, $data);
            redirect('customer');
        }
    }

    public function hapus($id) {
        $this->CustomerModel->deleteCustomer($id);
        redirect('customer');
    }
}
