<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Car_model extends CI_Model {

    public function insert($data) {
        return $this->db->insert('car', $data);
    }
}