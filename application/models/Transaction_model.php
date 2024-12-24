<?php
class Transaction_model extends CI_Model {

public function get_all_transactions() {
    return $this->db->get('transaction')->result_array();
}

public function insert_transaction($data) {
    return $this->db->insert('transaction', $data);
}

public function get_transaction($id) {
    return $this->db->get_where('transaction', ['transaction_id' => $id])->row_array();
}

public function update_transaction($id, $data) {
    $this->db->where('transaction_id', $id);
    return $this->db->update('transaction', $data);
}

public function delete_transaction($id) {
    $this->db->where('transaction_id', $id);
    return $this->db->delete('transaction');
}
}
?>