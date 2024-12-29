<?php 
class Dash extends CI_Controller {

    public function index(){
        $this->load->view('templates/header');
        $this->load->view('pages/dashboard/index');
        $this->load->view('templates/footer');
    }
} 
?>