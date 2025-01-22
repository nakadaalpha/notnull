<?php
class brands extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function get_all_brands()
    {
        $query = $this->db->get('brand');
        return $query->result_array();
    }

    public function get_home_brands($limit = null)
    {
        $this->db->select('brand_id, car_brand, image'); // Memilih kolom yang diperlukan
        $this->db->from('brand'); // Pastikan nama tabel sesuai

        if ($limit) {
            $this->db->limit($limit); // Tambahkan limit pada query
        }
        $query = $this->db->get();
        return $query->result_array();
    }
}
