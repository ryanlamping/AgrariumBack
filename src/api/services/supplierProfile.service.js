const pool = require('../../config/mySQL');

class supplierProfileService{
    async saveSupplierProfile(supplier_id, first_name, last_name, business_name, business_url, business_address, phone_no, region_id, country_id, province_id) {
        console.log("supplierProfile service: ", supplier_id, first_name, last_name, business_name, business_url, business_address, phone_no, region_id, country_id, province_id);
        try {
            const result = await pool.execute(
                'INSERT INTO supplier (supplier_id, first_name, last_name, business_name, business_url, business_address, phone_no, region_id, country_id, province_id) VALUES (?,?,?,?,?,?,?,?,?,?)',
                [supplier_id, first_name, last_name, business_name, business_url, business_address, phone_no, region_id, country_id, province_id]
            );
              console.log("user is successfully saved");
              return true;
            } catch (error) {
                console.error('Error in save:', error);
                throw error;
        }
    }
}  

module.exports = new supplierProfileService();