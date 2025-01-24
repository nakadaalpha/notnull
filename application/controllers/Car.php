<?php
// Controller: Car.php

defined('BASEPATH') or exit('No direct script access allowed');

class car extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->library('form_validation');
        $this->load->library('session');
        $this->load->model('cars');
        $this->load->model('brands');
    }

    public function index()
    {
        $data['cars'] = $this->Car_model->get_all_cars();
        $this->load->view('car/index', $data);
    }

    public function add()
    {
        // Load view
        $query['brands'] = $this->db->get('brand')->result_array();
        $this->load->view('pages/dashboard/car/add', $query);
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
    
    public function edit($car_id)
{
    $data['car'] = $this->cars->get_car_by_id($car_id);
    $data['brands'] = $this->db->get('brand')->result_array();

    if (empty($data['car'])) {
        $this->session->set_flashdata('error', 'Car not found.');
        redirect('dashboard/cars');
    }

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

    public function delete($car_id)
{
    if ($this->cars->check_car_exists($car_id)) {
        $this->cars->delete_car($car_id);
        $this->session->set_flashdata('success', 'Car deleted successfully.');
    } else {
        $this->session->set_flashdata('error', 'Car not found.');
    }
    redirect('dashboard/cars');
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
}
