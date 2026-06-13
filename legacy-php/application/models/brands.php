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

    public function get_brand_by_id($brand_id) {
        $this->db->where('brand_id', $brand_id);
        $query = $this->db->get('brand');
        return $query->row_array(); // Mengembalikan data sebagai array
    }

    public function add_brands($data)
    {
        $this->db->insert('brand', $data);
    }

    public function update_brand($brand_id, $data)
    {
        $this->db->where('brand_id', $brand_id);
        return $this->db->update('brand', $data);
    }

    // Delete a car
    public function delete_brand($brand_id)
    {
        $this->db->where('brand_id', $brand_id);
        return $this->db->delete('brand');
    }
}
