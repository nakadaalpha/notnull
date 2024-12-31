<?php
class Mtransaction extends CI_Model
{

    public function __construct(){
        parent::__construct();
            $this->load->database();
    }

    public function check_customer_exists($customer_id) {
        $query = $this->db->get_where('customer', ['customer_id' => $customer_id]);
        return $query->num_rows() > 0;
    }

    public function check_car_exists($car_id) {
        $query = $this->db->get_where('car', ['car_id' => $car_id]);
        return $query->num_rows() > 0;
    }

    public function get_all_transactions()
    {
        return $this->db->get('transaction')->result_array();
    }

    public function insert_transaction($data)
    {
        return $this->db->insert('transaction', $data);
    }

    public function get_transaction($id)
    {
        return $this->db->get_where('transaction', ['transaction_id' => $id])->row_array();
    }

    public function update_transaction($id, $data)
    {
        $this->db->where('transaction_id', $id);
        return $this->db->update('transaction', $data);
    }

    public function delete_transaction($id)
    {
        $this->db->where('transaction_id', $id);
        return $this->db->delete('transaction');
    }
}
