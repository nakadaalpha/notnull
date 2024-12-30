<?php
class Aboutus extends CI_Controller
{

    public function index()
    {
        echo base_url('public/css/styles.css');
    }
    public function login()
    {
        $this->load->view('templates/header');
        $this->load->view('templates/footer');
    }
}
