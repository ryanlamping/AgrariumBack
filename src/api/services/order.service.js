const pool = require('../../config/mySQL');

class OrderService {
    async putOrder(metadata) {
        console.log('metadata: ', metadata);

        try {
            return metadata;
        } catch (error) {
            console.log('Error getting orders: ', error)
            throw error;
        }
    }
}
