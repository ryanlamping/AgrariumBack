const pool = require('../../config/mySQL');

class customerTransProfileService{
    async saveCustomerTransProfile(customer_id, name_on_account, account_number, routing_number) {
        console.log("customerTransProfile service: ", customer_id, name_on_account, account_number, routing_number);
        try {
            const result = await pool.execute(
                'INSERT INTO customer_billing (customer_id, payment_method_no, name_on_account, account_number, routing_number) VALUES (?,?,?,?,?)',
                [customer_id, '1', name_on_account, account_number, routing_number]
              );
              
              console.log("transaction profile is successfully saved");
              return true;
            } catch (error) {
                console.error('Error in save:', error);
                throw error;
        }
    }
}  

module.exports = new customerTransProfileService();