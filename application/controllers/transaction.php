<?php
class Transaction extends CI_Controller {

public function __construct() {
    parent::__construct();
    $this->load->model('Mtransaction');
}

public function index() {
    $data['transactions'] = $this->Mtransaction->get_all_transactions();
    $this->load->view('templates/header');
    $this->load->view('transaction/index', $data);
    $this->load->view('templates/footer');
}

public function create() {
    $this->load->library('form_validation');

    $this->form_validation->set_rules('customer_id', 'Customer ID', 'required');
    $this->form_validation->set_rules('car_id', 'Car ID', 'required');
    $this->form_validation->set_rules('transaction_date', 'Transaction Date', 'required');
    $this->form_validation->set_rules('amount', 'Amount', 'required|integer');
    $this->form_validation->set_rules('total_price', 'Total Price', 'required|decimal');
    $this->form_validation->set_rules('payment_method', 'Payment Method', 'required');
    $this->form_validation->set_rules('status', 'Status', 'required');

    if ($this->form_validation->run() === FALSE) {
        $this->load->view('transaction_form');
    } else {
        $data = [
            'customer_id' => $this->input->post('customer_id'),
            'car_id' => $this->input->post('car_id'),
            'transaction_date' => $this->input->post('transaction_date'),
            'amount' => $this->input->post('amount'),
            'total_price' => $this->input->post('total_price'),
            'payment_method' => $this->input->post('payment_method'),
            'status' => $this->input->post('status')
        ];

        $this->Transaction_model->insert_transaction($data);
        redirect('transaction');
    }
}

public function delete($id) {
    $this->Transaction_model->delete_transaction($id);
    redirect('transaction');
}
}
?>