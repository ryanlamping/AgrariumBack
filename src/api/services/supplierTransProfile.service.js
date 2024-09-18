const pool = require('../../config/mySQL');

class supplierTransProfileService{
    async saveSupplierTransProfile(supplier_id, name_on_account, account_number, routing_number) {
        console.log("supplierTransProfile service: ", supplier_id, name_on_account, account_number, routing_number);
        try {
            const result = await pool.execute(
                'INSERT INTO supplier_billing (supplier_id, payment_method_no, name_on_account, account_number, routing_number) VALUES (?,?,?,?,?)',
                [supplier_id, '1', name_on_account, account_number, routing_number]
              );
              
              console.log("transaction profile is successfully saved");
              return true;
            } catch (error) {
                console.error('Error in save:', error);
                throw error;
        }
    }
}  

module.exports = new supplierTransProfileService();