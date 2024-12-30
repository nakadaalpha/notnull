<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin_register_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->database();
    }

    public function insert_admin($data) {
        return $this->db->insert('admin', $data);
    }
}