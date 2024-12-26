<?php
class Dashboard extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        if (!$this->session->userdata('admin_id')) {
            redirect('login');
        }
    }
    public function index()
    {
        $data['admin_name'] = $this->session->userdata('admin_name');
        $this->load->view('templates/header');
        $this->load->view('pages/admin_dashboard', $data);
        
    }
}
