<?php

class CustomerModel extends CI_Model {
    public function getAllCustomers() {
        return $this->db->get('customer')->result_array();
    }
    public function addCustomer($data) {
        return $this->db->insert('customer', $data);
    }

    public function getCustomerById($id) {
    /**
     * Get customer by ID.
     *
     * @param int $id The customer ID.
     * @return array The customer data.
     */
        return $this->db->get_where('customer', ['customer_id' => $id])->row_array();
    }
    public function updateCustomer($id, $data)
    {
        $this->db->where('customer_id', $id);
        return $this->db->update('customer', $data);
    }
    
    public function deleteCustomer($id) {
        $this->db->where('customer_id', $id);
        return $this->db->delete('customer');
    }
}