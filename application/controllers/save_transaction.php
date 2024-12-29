<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class save_Transaction extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->model('Mtransaction');
    }

    // Method untuk menampilkan form
    public function index() {
        $data['transactions'] = $this->Mtransaction->get_all_transactions();
        $this->load->view('templates/header');
        $this->load->view('transaction/save_transaction', $data);
        $this->load->view('templates/footer');
    }

    // Method untuk menangani form submission dan menampilkan detail
    public function store()
    {
        // Validasi input
        $this->load->library('form_validation');
        $this->form_validation->set_rules('customer_id', 'Customer ID', 'required');
        $this->form_validation->set_rules('car_id', 'Car ID', 'required');
        $this->form_validation->set_rules('transaction_date', 'Transaction Date', 'required');
        $this->form_validation->set_rules('amount', 'Amount', 'required|numeric');
        $this->form_validation->set_rules('total_price', 'Total Price', 'required|numeric');
        $this->form_validation->set_rules('payment_method', 'Payment Method', 'required');
        $this->form_validation->set_rules('status', 'Status', 'required');

        if ($this->form_validation->run() == FALSE) {
            // Jika validasi gagal, kembali ke form dengan pesan error
            $this->load->view('save_transaction'); // Kembali ke save_transaction
        } else {
            // Ambil data dari form
            $data = [
                'customer_id' => $this->input->post('customer_id'),
                'car_id' => $this->input->post('car_id'),
                'transaction_date' => $this->input->post('transaction_date'),
                'amount' => $this->input->post('amount'),
                'total_price' => $this->input->post('total_price'),
                'payment_method' => $this->input->post('payment_method'),
                'status' => $this->input->post('status'),
            ];

            // Kirim data ke view detail
            $this->load->view('detail', $data); // Pastikan ada file detail.php
        }
    }
}
