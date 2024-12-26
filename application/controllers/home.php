<?php
class home extends CI_Controller{

    public function index(){
        $this->load->model('cars');
        $query['cars'] = $this->cars->get_home_cars(6);
        $this->load->view("templates/header");
        $this->load->view("pages/home/index", $query);
        $this->load->view("templates/footer");
    }
}
?>