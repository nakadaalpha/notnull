<?php
class Dashboard extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        if (!$this->session->userdata('admin_id')) {
            redirect('auth/login');
        }
        $this->load->model('Mtransaction');
        $this->load->model('UserModel');
        $this->load->model('cars');
        $this->load->model('brands');
        $this->load->library('form_validation');
    }
    public function index()
    {
        if ($this->session->userdata('admin_id')) {
            $admin_id = $this->session->userdata('admin_id'); // Ambil user_id dari session
            $admin_data = $this->UserModel->get_admin_by_id($admin_id); // Ambil data user
        }

        $query['admin'] = $admin_data;
        $this->load->view('templates/dashboard_head');
        $this->load->view('pages/dashboard/index', $query);
    }

    public function cars()
    {
        if ($this->session->userdata('admin_id')) {
            $admin_id = $this->session->userdata('admin_id'); // Ambil user_id dari session
            $admin_data = $this->UserModel->get_admin_by_id($admin_id); // Ambil data user
        }

        $query['admin'] = $admin_data;
        $query['cars']  = $this->cars->get_all_cars();
        $this->load->view('templates/dashboard_head');
        $this->load->view('pages/dashboard/car/index', $query);
    }

    public function add_car()
    {
        if ($this->session->userdata('admin_id')) {
            $admin_id = $this->session->userdata('admin_id'); // Ambil user_id dari session
            $admin_data = $this->UserModel->get_admin_by_id($admin_id); // Ambil data user
        }

        $query['admin'] = $admin_data;
        $query['brands'] = $this->db->get('brand')->result_array();
        $this->load->view('templates/dashboard_head');
        $this->load->view('pages/dashboard/car/add', $query);
    }

    public function add_cars_action()
    {
        $name   = $this->input->post('car_name');
        $brand  = $this->input->post('car_brand');
        $type   = $this->input->post('car_type');
        $year   = $this->input->post('year_made');
        $price  = $this->input->post('price');
        $stock  = $this->input->post('stock');
        $status = $this->input->post('status');
        $spec   = $this->input->post('car_spec');

        $config['upload_path'] = './public/src/images/cars';
        $config['allowed_types'] = 'jpg|jpeg|png|gif';

        $this->load->library('upload', $config);

        if ($this->upload->do_upload('image')) {
            $image = $this->upload->data('file_name');
        } else {
            $image = null;
            $error = $this->upload->display_errors();
        }

        $data = array(
            'car_name' => $name,
            'car_brand' => $brand,
            'car_type' => $type,
            'year_made' => $year,
            'price' => $price,
            'stock' => $stock,
            'status' => $status,
            'car_spec' => $spec,
            'car_image' => $image
        );
        $this->cars->add_cars($data);

        $this->db->select_max('car_id');
        $query = $this->db->get('car')->row_array();
        $id = $query['car_id'];


        if ($this->db->affected_rows()) {
            $this->session->set_flashdata('success', 'Add Product successfully.');
            redirect('dashboard/cars' . $id);
        } else {
            $this->session->display_errors();
        }
    }

    public function _upload_image()
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
    }

    public function edit_car($car_id)
    {
        $data['car'] = $this->cars->get_car_by_id($car_id);
        $data['brands'] = $this->db->get('brand')->result_array();

        if (empty($data['car'])) {
            $this->session->set_flashdata('error', 'Car not found.');
            redirect('dashboard/cars');
        }
        if ($this->session->userdata('admin_id')) {
            $admin_id = $this->session->userdata('admin_id'); // Ambil user_id dari session
            $admin_data = $this->UserModel->get_admin_by_id($admin_id); // Ambil data user
        }

        $data['admin'] = $admin_data;
        $this->load->view('templates/dashboard_head');
        $this->load->view('pages/dashboard/car/edit', $data);
    }

    public function update($car_id)
    {
        $name   = $this->input->post('car_name');
        $brand  = $this->input->post('car_brand');
        $type   = $this->input->post('car_type');
        $year   = $this->input->post('year_made');
        $price  = $this->input->post('price');
        $stock  = $this->input->post('stock');
        $status = $this->input->post('status');
        $spec   = $this->input->post('car_spec');

        $data = array(
            'car_name' => $name,
            'car_brand' => $brand,
            'car_type' => $type,
            'year_made' => $year,
            'price' => $price,
            'stock' => $stock,
            'status' => $status,
            'car_spec' => $spec
        );

        if (!empty($_FILES['car_image']['name'])) {
            $data['car_image'] = $this->_upload_image();
        }

        if ($this->cars->update_car($car_id, $data)) {
            $this->session->set_flashdata('success', 'Car updated successfully.');
        } else {
            $this->session->set_flashdata('error', 'Failed to update car.');
        }
        redirect('dashboard/cars');
    }

    public function delete_car($car_id)
    {
        if ($this->cars->check_car_exists($car_id)) {
            $this->cars->delete_car($car_id);
            $this->session->set_flashdata('success', 'Car deleted successfully.');
        } else {
            $this->session->set_flashdata('error', 'Car not found.');
        }
        redirect('dashboard/cars');
    }

    public function brands()
    {
        if ($this->session->userdata('admin_id')) {
            $admin_id = $this->session->userdata('admin_id'); // Ambil user_id dari session
            $admin_data = $this->UserModel->get_admin_by_id($admin_id); // Ambil data user

        }

        $query['admin'] = $admin_data;
        $query['brands']  = $this->brands->get_all_brands();
        $this->load->view('templates/dashboard_head');
        $this->load->view('pages/dashboard/brand/index', $query);
    }

    public function transactions()
    {
        if ($this->session->userdata('admin_id')) {
            $admin_id = $this->session->userdata('admin_id'); // Ambil user_id dari session
            $admin_data = $this->UserModel->get_admin_by_id($admin_id); // Ambil data user
        }

        // Ambil data mobil untuk halaman home
        $data['admin'] = $admin_data; // Jika user tidak login, ini tetap null
        $data['transactions'] = $this->Mtransaction->get_all_transactions();
        $this->load->view('templates/dashboard_head');
        $this->load->view('pages/dashboard/transaction/index', $data);
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

    public function logout()
    {
        // Hapus session terkait admin
        $this->session->unset_userdata('admin_id');
        $this->session->unset_userdata('admin_name');
        $this->session->sess_destroy();

        // Redirect ke halaman login
        redirect('auth/login');
    }
}
