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
    

        public function edit($id)
    {
        $data['customer'] = $this->CustomerModel->getCustomerById($id);

        // Validasi input
        $this->form_validation->set_rules('customer_username', 'Username', 'required');
        $this->form_validation->set_rules('customer_email', 'Email', 'required|valid_email');
        $this->form_validation->set_rules('customer_phonenumb', 'Phone Number', 'required');
        $this->form_validation->set_rules('customer_address', 'Address', 'required');

        if ($this->form_validation->run() == FALSE) {
            // Jika validasi gagal, kembalikan ke halaman edit dengan pesan error
            $this->load->view('customer/edit', $data);
        } else {
            // Ambil data dari form
            $updated_data = [
                'customer_username' => $this->input->post('customer_username'),
                'customer_email' => $this->input->post('customer_email'),
                'customer_phonenumb' => $this->input->post('customer_phonenumb'),
                'customer_address' => $this->input->post('customer_address')
            ];

            // Simpan data ke database
            if ($this->CustomerModel->updateCustomer($id, $updated_data)) {
                $this->session->set_flashdata('success', 'Data pelanggan berhasil diperbarui.');
            } else {
                $this->session->set_flashdata('error', 'Terjadi kesalahan saat memperbarui data.');
            }

        // Redirect kembali ke halaman daftar pelanggan
        redirect('customer');
    }
}


    public function hapus($id) {
        $this->CustomerModel->deleteCustomer($id);
        redirect('customer');
    }
}