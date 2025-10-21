// controllers/orderController.js
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { Parser } from 'json2csv';

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

// @desc    Obter pedido por ID
// @route   GET /api/orders/:id
// @access  Privado
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

// @desc    Atualizar pedido para pago
// @route   PUT /api/orders/:id/pay
// @access  Privado
const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
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

// @desc    Obter resumo do dashboard (admin)
// @route   GET /api/orders/summary
// @access  Privado/Admin
const getSalesSummary = async (req, res) => {
    try {
        const ordersSummary = await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, numOrders: { $sum: 1 }, totalSales: { $sum: '$totalPrice' } } }
        ]);
        const numUsers = await User.countDocuments();
        const numProducts = await Product.countDocuments();
        const salesOverTime = await Order.aggregate([
            { $match: { isPaid: true } },
            { $project: { date: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } }, totalPrice: 1 } },
            { $group: { _id: '$date', dailySales: { $sum: '$totalPrice' } } },
            { $sort: { _id: 1 } }
        ]);
        const topSellingProducts = await Order.aggregate([
            { $match: { isPaid: true } },
            { $unwind: '$orderItems' },
            { $group: { _id: '$orderItems.product', name: { $first: '$orderItems.name' }, totalQuantitySold: { $sum: '$orderItems.qty' } } },
            { $sort: { totalQuantitySold: -1 } },
            { $limit: 5 }
        ]);
        const salesByCategory = await Order.aggregate([
            { $match: { isPaid: true } },
            { $unwind: '$orderItems' },
            { $lookup: { from: 'products', localField: 'orderItems.product', foreignField: '_id', as: 'productInfo' } },
            { $unwind: '$productInfo' },
            { $group: { _id: '$productInfo.category.pt', totalSales: { $sum: { $multiply: ['$orderItems.qty', '$productInfo.price'] } } } },
            { $sort: { totalSales: -1 } }
        ]);
        const topCustomers = await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: '$user', totalSpent: { $sum: '$totalPrice' }, totalOrders: { $sum: 1 } } },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userInfo' } },
            { $unwind: '$userInfo' },
            { $project: { _id: 0, name: '$userInfo.name', email: '$userInfo.email', totalSpent: 1, totalOrders: 1 } },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            ordersSummary: ordersSummary.length > 0 ? ordersSummary[0] : { numOrders: 0, totalSales: 0 },
            numUsers,
            numProducts,
            salesOverTime,
            topSellingProducts,
            salesByCategory,
            topCustomers
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar resumo do dashboard" });
    }
};

// @desc    Exportar pedidos detalhados (admin)
// @route   GET /api/orders/export
// @access  Privado/Admin
const exportOrders = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const dateFilter = { isPaid: true };
        if (startDate && endDate) {
            dateFilter.paidAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const orders = await Order.aggregate([
            { $match: dateFilter },
            { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userInfo' } },
            { $unwind: '$userInfo' },
            { $unwind: '$orderItems' },
            { $project: { _id: 0, 'ID Pedido': '$_id', 'Data': { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$paidAt" } }, 'Cliente': '$userInfo.name', 'Cliente Email': '$userInfo.email', 'SKU (ID Produto)': '$orderItems.product', 'Produto': '$orderItems.name', 'Qtd.': '$orderItems.qty', 'Preço Unit.': '$orderItems.price', 'Total Item': { $multiply: ['$orderItems.qty', '$orderItems.price'] }, 'Endereço': '$shippingAddress.address', 'Cidade': '$shippingAddress.city', 'País': '$shippingAddress.country', 'CEP': '$shippingAddress.postalCode', 'Método Pgto.': '$paymentMethod', 'Subtotal Pedido': '$itemsPrice', 'Frete': '$shippingPrice', 'Taxa': '$taxPrice', 'Total Pedido': '$totalPrice' } },
            { $sort: { 'Data': 1 } }
        ]);

        if (orders.length === 0) {
            res.status(404).json({ message: 'Nenhum pedido encontrado para exportar.' });
            return;
        }

        const fields = ['ID Pedido', 'Data', 'Cliente', 'Cliente Email', 'SKU (ID Produto)', 'Produto', 'Qtd.', 'Preço Unit.', 'Total Item', 'Endereço', 'Cidade', 'País', 'CEP', 'Método Pgto.', 'Subtotal Pedido', 'Frete', 'Taxa', 'Total Pedido'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(orders);

        res.header('Content-Type', 'text/csv');
        res.attachment('relatorio-pedidos.csv');
        res.send(csv);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao exportar pedidos" });
    }
};

// @desc    Obter pedidos pendentes (admin)
// @route   GET /api/orders/pending
// @access  Privado/Admin
const getPendingOrders = async (req, res) => {
    try {
        const orders = await Order.find({ isPaid: true, isDelivered: false })
            .populate('user', 'name') // Pega o nome do utilizador
            .sort({ paidAt: 1 }); // Mostra os mais antigos primeiro

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar pedidos pendentes" });
    }
};

// --- GARANTA QUE getPendingOrders ESTÁ AQUI ---
export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
    getSalesSummary,
    exportOrders,
    getPendingOrders // <-- Tem que estar listado aqui!
};