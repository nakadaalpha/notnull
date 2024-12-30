<?php
class images extends CI_Controller{

    public function index(){
        $this->load->view("templates/Header");
        $this->load->view("templates/footer");
    }

    public function test(){
        $this->load->view('templates/Header');
        $this->load->view("templates/footer");
    }
}
?>