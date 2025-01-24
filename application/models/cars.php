<?php
defined('BASEPATH') or exit('No direct script access allowed');

class cars extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function check_car_exists($car_id)
    {
        $query = $this->db->get_where('car', ['car_id' => $car_id]);
        return $query->num_rows() > 0;
    }
    // Fetch all cars
    public function get_warehouse_cars($sort_year = null, $sort_price = null)
    {
        $this->db->select('car.*, brand.car_brand');
        $this->db->from('car');
        $this->db->join('brand', 'car.car_brand = brand.brand_id');

        if ($sort_year) {
            $this->db->order_by('year_made', $sort_year);
        }
        if ($sort_price) {
            $this->db->order_by('price', $sort_price);
        }

        $query = $this->db->get();
        return $query->result_array();
    }

    public function get_home_cars($limit = null)
    {
        $this->db->select('car.*, brand.car_brand');
        $this->db->from('car');
        $this->db->join('brand', 'car.car_brand = brand.brand_id');

        if ($limit) {
            $this->db->limit($limit); // Tambahkan limit pada query
        }

        $query = $this->db->get();
        return $query->result_array();
    }

    // Fetch a single car by ID
    public function get_car_by_id($car_id)
    {
        $this->db->select('car.*, brand.car_brand');
        $this->db->from('car');
        $this->db->join('brand', 'car.car_brand = brand.brand_id');
        $this->db->where('car.car_id', $car_id);

        $query = $this->db->get(); // Mengganti get_where dengan get karena where sudah dipanggil sebelumnya
        return $query->row_array();
    }

    public function get_all_cars()
    {
        $this->db->select('car.*, brand.car_brand');
        $this->db->from('car');
        $this->db->join('brand', 'car.car_brand = brand.brand_id');
        return $this->db->get()->result_array();
    }

    public function get_cars_by_brand($brand_id)
    {
        $this->db->select('*'); // Pilih semua kolom
        $this->db->from('cars'); // Nama tabel mobil
        $this->db->where('car_brand', $brand_id); // Filter berdasarkan brand_id
        $query = $this->db->get(); // Eksekusi query

        return $query->result_array(); // Kembalikan hasil sebagai array
    }

    // Add a new car
    public function add_cars($data)
    {
        $this->db->insert('car', $data);
    }

    // Update a car's details
    public function update_car($car_id, $data)
    {
        $this->db->where('car_id', $car_id);
        return $this->db->update('car', $data);
    }

    // Delete a car
    public function delete_car($car_id)
    {
        $this->db->where('car_id', $car_id);
        return $this->db->delete('car');
    }
}
