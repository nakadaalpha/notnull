<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Car extends CI_Controller
{
    public function index()
    {
        $this->load->model('Car_model');
        $data['cars'] = $this->Car_model->getAllCars();
        $this->load->view('car_list', $data);
    }

    public function add()
    {
        $this->load->view('add_car');
    }

    public function save()
    {
        $this->load->model('Car_model');
        $data = [
            'name' => $this->input->post('name'),
            'brand' => $this->input->post('brand'),
            'price' => $this->input->post('price')
        ];
        $this->Car_model->insertCar($data);
        redirect('Car');
    }
}
