<?php
class Transaction extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('Mtransaction');
        $this->load->model('UserModel');
        $this->load->model('cars');
        $this->load->library('form_validation');
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

        // Ambil data mobil untuk halaman home
        $data['admin'] = $admin_data;
        $data['user'] = $user_data; // Jika user tidak login, ini tetap null
        $data['transactions'] = $this->Mtransaction->get_all_transactions();
        $this->load->view('templates/header',$data);
        $this->load->view('transaction/index', $data);
        $this->load->view('templates/footer');
    }

    public function create()
    {
        $this->load->library('form_validation');
        $this->form_validation->set_rules('customer_id', 'Customer ID', 'required');
        $this->form_validation->set_rules('car_id', 'Car ID', 'required');
        $this->form_validation->set_rules('transaction_date', 'Transaction Date', 'required');
        $this->form_validation->set_rules('amount', 'Amount', 'required|integer');
        $this->form_validation->set_rules('total_price', 'Total Price', 'required');
        $this->form_validation->set_rules('payment_method', 'Payment Method', 'required');
        $this->form_validation->set_rules('status', 'Status', 'required');

        if ($this->form_validation->run() === FALSE) {
            $this->load->view('transaction/index');
        } else {
            $customer_id = $this->input->post('customer_id');
            $car_id = $this->input->post('car_id');

            // Validasi apakah customer_id dan car_id valid
            if (!$this->Mtransaction->check_customer_exists($customer_id) || !$this->cars->check_car_exists($car_id)) {
                $this->session->set_flashdata('error', 'Customer ID atau Car ID tidak valid.');
                redirect('transaction/create');
            }

            $data = [
                'customer_id' => $customer_id,
                'car_id' => $car_id,
                'transaction_date' => $this->input->post('transaction_date'),
                'amount' => $this->input->post('amount'),
                'total_price' => $this->input->post('total_price'),
                'payment_method' => $this->input->post('payment_method'),
                'status' => $this->input->post('status')
            ];

            $this->Mtransaction->insert_transaction($data);
            redirect('transaction/save_transaction');
        }
    }


    public function save_transaction()
    {
        // Ambil semua data transaksi dari database
        $data['transactions'] = $this->Mtransaction->get_all_transactions();

        // Load view dengan data transaksi
        $this->load->view('templates/header');
        $this->load->view('transaction/save_transaction', $data);
        $this->load->view('templates/footer');
    }


    public function delete($id)
    {
        $this->Transaction_model->delete_transaction($id);
        redirect('transaction');
    }
}
