// controllers/orderController.js
import Order from '../models/orderModel.js';

// @desc    Criar novo pedido
// @route   POST /api/orders
// @access  Privado
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('Nenhum item no pedido');
    } else {
      const order = new Order({
        orderItems: orderItems.map(item => ({ ...item, product: item.product })),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
     res.status(400).json({ message: error.message });
  }
};

export { addOrderItems };