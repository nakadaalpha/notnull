<?php
defined('BASEPATH') or exit('No direct script access allowed');

class UserModel extends CI_Model
{

    // Cek login untuk Admin
    public function login_admin($username, $password)
    {
        $this->db->where('admin_username', $username);
        $this->db->where('admin_password', $password);
        return $this->db->get('admin')->row_array();
    }

    // Cek login untuk Customer
    public function login_customer($username, $password)
    {
        $this->db->where('customer_username', $username);
        $this->db->where('customer_password', $password);
        return $this->db->get('customer')->row_array();
    }
}
