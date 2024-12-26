<?php
class warehouse extends CI_Controller{

    public function index(){
        $this->load->model('cars');
        $query['cars'] = $this->cars->get_all_cars();
        $this->load->view("templates/header");
        $this->load->view("pages/warehouse/index", $query);
        $this->load->view("templates/footer");
    }
}
?>