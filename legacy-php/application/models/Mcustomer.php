<?php
class MCustomer extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function check_customer_exists($customer_id) {
        $query = $this->db->get_where('customer', ['customer_id' => $customer_id]);
        return $query->num_rows() > 0;
    }

}
