<?php 
class carlist extends CI_Controller{

    public function index(){
        $this->load->view('templates/header');
        $this->load->view('pages/carlist');
        $this->load->view('templates/footer');
    }
}
?>