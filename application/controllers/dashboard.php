<?php
class Dashboard extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        if (!$this->session->userdata('admin_id')) {
            redirect('login');
        }
        $this->load->model('Mtransaction');
        $this->load->model('UserModel');
        $this->load->model('cars');
        $this->load->library('form_validation');
    }
    public function index()
    {
        $data['admin_name'] = $this->session->userdata('admin_name');
        $this->load->view('templates/dashboard_head');
        $this->load->view('pages/dashboard/index', $data);
    }

    public function cars()
    {
        $admin_data = null; // Default user data kosong
        if ($this->session->userdata('admin_id')) {
            $admin_id = $this->session->userdata('admin_id'); // Ambil user_id dari session
            $admin_data = $this->UserModel->get_admin_by_id($admin_id); // Ambil data user
        }

        $query['admin'] = $admin_data;
        $query['cars']  = $this->cars->get_all_cars();
        $this->load->view('templates/dashboard_head');
        $this->load->view('pages/dashboard/car/index', $query);
    }

    public function add()
    {
        if ($this->input->post()) {
            // Form validation rules
            $this->form_validation->set_rules('car_id', 'Car ID', 'required');
            $this->form_validation->set_rules('car_name', 'Car Name', 'required');
            $this->form_validation->set_rules('car_brand', 'Car Brand', 'required');
            $this->form_validation->set_rules('year_made', 'Year Made', 'required|numeric');
            $this->form_validation->set_rules('price', 'Price', 'required|numeric');
            $this->form_validation->set_rules('stock', 'Stock', 'required|integer');

            if ($this->form_validation->run() == TRUE) {
                // Prepare data to insert
                $data = [
                    'car_id' => $this->input->post('car_id'),
                    'car_name' => $this->input->post('car_name'),
                    'car_brand' => $this->input->post('car_brand'),
                    'car_type' => $this->input->post('car_type'),
                    'year_made' => $this->input->post('year_made'),
                    'price' => $this->input->post('price'),
                    'stock' => $this->input->post('stock'),
                    'status' => $this->input->post('status'),
                    'car_spec' => $this->input->post('car_spec'),
                    'car_image' => $this->_upload_image()
                ];

                $this->Car_model->insert($data);
                $this->session->set_flashdata('success', 'Car added successfully!');
                redirect('car/add');
            }
        }

        // Load view
        $this->load->view('car/add');
    }

    private function _upload_image()
    {
        if (!empty($_FILES['car_image']['name'])) {
            $config['upload_path'] = './uploads/cars/';
            $config['allowed_types'] = 'jpg|jpeg|png';
            $config['file_name'] = uniqid();

            $this->load->library('upload', $config);

            if ($this->upload->do_upload('car_image')) {
                return $this->upload->data('file_name');
            }
        }
        return 'default.jpg'; // Default image
    }

    public function transactions()
    {
        // Periksa apakah ada session aktif
        $admin_data = null; // Default user data kosong
        if ($this->session->userdata('admin_id')) {
            $admin_id = $this->session->userdata('admin_id'); // Ambil user_id dari session
            $admin_data = $this->UserModel->get_admin_by_id($admin_id); // Ambil data user
        }

        // Ambil data mobil untuk halaman home
        $data['admin'] = $admin_data; // Jika user tidak login, ini tetap null
        $data['transactions'] = $this->Mtransaction->get_all_transactions();
        $this->load->view('templates/header');
        $this->load->view('transaction/save_transaction', $data);
    }

    public function create_transaction()
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
}
