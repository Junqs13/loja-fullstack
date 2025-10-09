// controllers/productController.js
import Product from '../models/productModel.js';

// @desc    Buscar todos os produtos
// @route   GET /api/products
// @access  Público
const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i' // 'i' para case-insensitive
        }
    } : {};
    const products = await Product.find({...keyword});
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
// @desc    Criar um produto (admin)
// @route   POST /api/products
// @access  Privado/Admin
const createProduct = async (req, res) => {
    try {
        const product = new Product({
            name: 'Produto de Amostra',
            price: 0,
            user: req.user._id,
            image: '/images/sample.jpg',
            brand: 'Marca de Amostra',
            category: 'Categoria de Amostra',
            countInStock: 0,
            description: 'Descrição de Amostra',
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

// @desc    Deletar um produto (admin)
// @route   DELETE /api/products/:id
// @access  Privado/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Produto removido' });
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};
// @desc    Atualizar um produto (admin)
// @route   PUT /api/products/:id
// @access  Privado/Admin
const updateProduct = async (req, res) => {
    try {
        const { name, price, description, image, brand, category, countInStock } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name;
            product.price = price;
            product.description = description;
            product.image = image;
            product.brand = brand;
            product.category = category;
            product.countInStock = countInStock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};
// @desc    Buscar os melhores produtos (para o carrossel)
// @route   GET /api/products/top
// @access  Público
const getTopProducts = async (req, res) => {
    try {
        // Encontra produtos, ordena pelo preço em ordem decrescente e limita a 3
        const products = await Product.find({}).sort({ price: -1 }).limit(3);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

export { getProducts, getProductById, createProduct, deleteProduct, updateProduct, getTopProducts  };