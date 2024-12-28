<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class cars extends CI_Model {

    public function __construct(){
        parent::__construct();
            $this->load->database();
        
    }
    // Fetch all cars
    public function get_all_cars() {
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