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
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
          'user',
          'name email'
        );

        if (order) {
            res.json(order);
        } else {
            res.status(404);
            throw new Error('Pedido não encontrado');
        }
    } catch (error) {
        res.status(404).json({ message: 'Pedido não encontrado' });
    }
};
const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = { // Detalhes vindos do PayPal
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer.email_address,
            };
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Pedido não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};
// @desc    Buscar pedidos do usuário logado
// @route   GET /api/orders/myorders
// @access  Privado
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};
// @desc    Buscar todos os pedidos (admin)
// @route   GET /api/orders
// @access  Privado/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor" });
    }
};

// @desc    Atualizar pedido para entregue (admin)
// @route   PUT /api/orders/:id/deliver
// @access  Privado/Admin
const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Pedido não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};
export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered  };