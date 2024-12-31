<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class cars extends CI_Model {

    public function __construct(){
        parent::__construct();
            $this->load->database();
        
    }

    public function check_car_exists($car_id) {
        $query = $this->db->get_where('car', ['car_id' => $car_id]);
        return $query->num_rows() > 0;
    }
    // Fetch all cars
    public function get_all_cars($sort_year = null, $sort_price = null) {
        if ($sort_year) {
            $this->db->order_by('year_made', $sort_year);
        }
        if ($sort_price) {
            $this->db->order_by('price', $sort_price);
        }
        $query = $this->db->get('car');
        return $query->result_array();
    }
    
    public function get_home_cars($limit = null) {
        if ($limit) {
            $this->db->limit($limit); // Tambahkan limit pada query
        }
        $query = $this->db->get('car');
        return $query->result_array();
    }

    // Fetch a single car by ID
    public function get_car_by_id($car_id) {
        $query = $this->db->get_where('car', ['car_id' => $car_id]);
        return $query->row_array();
    }

    // Add a new car
    public function add_car($data) {
        return $this->db->insert('car', $data);
    }

    // Update a car's details
    public function update_car($car_id, $data) {
        $this->db->where('car_id', $car_id);
        return $this->db->update('car', $data);
    }

    // Delete a car
    public function delete_car($car_id) {
        $this->db->where('car_id', $car_id);
        return $this->db->delete('car');
    }
}
