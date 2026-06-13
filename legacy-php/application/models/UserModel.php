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

    // Fungsi untuk mengambil data user berdasarkan ID
    public function get_user_by_id($user_id)
    {
        $this->db->where('customer_id', $user_id); // 'id' adalah kolom di database yang merepresentasikan user ID
        $query = $this->db->get('customer'); // 'users' adalah nama tabel di database Anda
        return $query->row(); // Mengembalikan satu baris data sebagai objek
    }

    // UserModel.php
    public function get_admin_by_id($admin_id)
    {
        $this->db->where('admin_id', $admin_id); // 'admin_id' adalah kolom di database untuk admin
        $query = $this->db->get('admin'); // 'admin' adalah nama tabel untuk admin
        return $query->row(); // Mengembalikan satu baris data sebagai objek
    }
}
