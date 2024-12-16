<?php
class Catalog extends CI_Controller{

    public function index(){
        $this->load->view('templates/header');
        $this->load->view('pages/catalog');
        $this->load->view('templates/footer');
        $this->load->view('templates/footer');
    }
}
?>