<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin_model extends CI_Model {
    public function check_login($username, $password) {
        $this->db->where('admin_username', $username);
        $this->db->where('admin_password', $password);
        return $this->db->get('admin')->row_array();
    }
}