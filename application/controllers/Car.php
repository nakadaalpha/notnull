<?php
// Controller: Car.php

defined('BASEPATH') OR exit('No direct script access allowed');

class Car extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->library('form_validation');
        $this->load->model('Car_model');
    }

    public function index() {
        $this->load->model('cars');
        $query['cars'] = $this->cars->get_all_cars();
        $this->load->view('car/list_cars', $query);
    }

    public function add() {
        if ($this->input->post()) {
            // Form validation rules
            $this->form_validation->set_rules('car_id', 'Car ID', 'required|is_unique[car.car_id]');
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

    private function _upload_image() {
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
}