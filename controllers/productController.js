// controllers/productController.js
import Product from '../models/productModel.js';

// @desc    Buscar todos os produtos
// @route   GET /api/products
// @access  Público
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Buscar um único produto por ID
// @route   GET /api/products/:id
// @access  Público
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Produto não encontrado' });
  }
};

export { getProducts, getProductById };