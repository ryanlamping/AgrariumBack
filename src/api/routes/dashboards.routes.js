const express = require('express');
const dashboardService = require('../services/dashboard.service');
const router = express.Router();

router.get('/totalSales', async (req, res) => {
  try {
    const sales = await dashboardService.getTotalSales();
    res.json(sales);
  } catch (error) {
    console.error("Error fetching total sales", error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

router.get('/totalSalesSup', async(req, res) => {
  const sup_id = req.query.sup_id;
  try {
    const sales = await dashboardService.getTotalSalesSup(sup_id);
    res.json(sales);
  } catch (error) {
    console.error("Error fetching total sales", error);
    res.status(500).json({error: 'Internal Server Error'});
  }
})

router.get('/totalOrders', async (req, res) => {
    try {
        const orders = await dashboardService.getTotalOrders();
        res.json(orders);
    } catch (error) {
        console.error("Error fetching total sales", error);
        res.status(500).json({error: "Failed to retrieve total orders"});
    }
});

router.get('/totalOrdersSup', async (req, res) => {
  const sup_id = req.query.sup_id;
  try {
      const orders = await dashboardService.getTotalOrdersSup(sup_id);
      res.json(orders);
  } catch (error) {
      console.error("Error fetching total sales", error);
      res.status(500).json({error: "Failed to retrieve total orders"});
  }
});

router.get('/ordersByProduct', async(req, res) => {
    try {
        const orders = await dashboardService.getOrdersByProduct();
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders by product: ", orders);
        res.status(500).json({error: "Failed to retrieve orders by product"});
    }
});
router.get('/ordersByProductSup', async(req, res) => {
  const sup_id = req.query.sup_id;
  try {
      const orders = await dashboardService.getOrdersByProductSup(sup_id);
      res.json(orders);
  } catch (error) {
      console.error("Error fetching orders by product: ", orders);
      res.status(500).json({error: "Failed to retrieve orders by product"});
  }
});

router.get('/ordersByLocation', async (req, res) => {
  try {
    const orders = await dashboardService.getOrdersByLocation();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders by location", error);
    res.status(500).json({error: "Failed to retrieve orders by location"});

  }
});

router.get('/salesByProduct', async (req, res) => {
  try {
    const sales = await dashboardService.getSalesByProduct();
    res.json(sales);
  } catch (error) {
    console.error("Error fetching sales by product");
    res.status(500).json({error: "Failed to get sales by product"});
  }
});

router.get('/salesByProductSup', async (req, res) => {
  const sup_id = req.query.sup_id;
  try {
    const sales = await dashboardService.getSalesByProductSup(sup_id);
    res.json(sales);
  } catch (error) {
    console.error("Error fetching sales by product");
    res.status(500).json({error: "Failed to get sales by product"});
  }
});

router.get('/salesByLocation', async (req, res) => {
  try {
    const sales = await dashboardService.getSalesByLocation();
    res.json(sales);
  } catch (error) {
    console.error("Error fetching sales by location", error);
    res.status(500).json({error: "Failed to get sales by location"});
  }
});

router.get('/salesBySupplier', async (req, res) => {
  try { 
    const sales = await dashboardService.getSalesBySupplier();
    res.json(sales);
  } catch (error) {
    console.error("Error fetching sales by supplier: ", error);
    res.status(500).json({error: "Failed to get sales by supplier"});
  }
});

router.get('/ordersBySupplier', async (req, res) => {
  try {
    const sales = await dashboardService.getOrdersBySupplier();
    res.json(sales);
  } catch (error) {
    console.error("Error fetching orders by supplier: ", error);
    res.status(500).json({error: "Failed to get orders by supplier"});
  }
});

module.exports = router;