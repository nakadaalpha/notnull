<?php
class warehouse extends CI_Controller{

    public function index() {
        $this->load->model('cars');
        
        // Ambil parameter sorting dari URL
        $sort_year = $this->input->get('sort_year');
        $sort_price = $this->input->get('sort_price');
        
        // Dapatkan data mobil dengan pengurutan
        $query['cars'] = $this->cars->get_all_cars($sort_year, $sort_price);
        
        $this->load->view("templates/header");
        $this->load->view("pages/warehouse/index", $query);
        $this->load->view("templates/footer");
    }
    

    public function detail($car_id) {
        $this->load->model('cars');
        $data['car'] = $this->cars->get_car_by_id($car_id);
        
        if (empty($data['car'])) {
            show_404(); // Tampilkan halaman 404 jika data tidak ditemukan
        }
        
        $this->load->view("templates/header");
        $this->load->view("pages/warehouse/detail", $data);
        $this->load->view("templates/footer");
    }
    
}
?>