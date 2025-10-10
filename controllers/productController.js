import Product from '../models/productModel.js';

// Função auxiliar para traduzir um produto para o idioma solicitado
const translateProduct = (product, lang) => {
    return {
        _id: product._id,
        user: product.user,
        name: product.name[lang] || product.name.pt,
        image: product.image,
        brand: product.brand[lang] || product.brand.pt,
        category: product.category[lang] || product.category.pt,
        description: product.description[lang] || product.description.pt,
        price: product.price,
        countInStock: product.countInStock,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
};

const getProducts = async (req, res) => {
  try {
    // LINHA DE DEPURAÇÃO
    console.log('GET /api/products -> Cabeçalho Accept-Language:', req.headers['accept-language']);

    const lang = (req.headers['accept-language'] || 'pt').split(',')[0].substring(0, 2);
    const keyword = req.query.keyword ? {
        $or: [
            { 'name.pt': { $regex: req.query.keyword, $options: 'i' } },
            { 'name.en': { $regex: req.query.keyword, $options: 'i' } }
        ]
    } : {};
    const products = await Product.find({ ...keyword });
    res.json(products.map(p => translateProduct(p, lang)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

const getProductById = async (req, res) => {
  try {
    // LINHA DE DEPURAÇÃO
    console.log(`GET /api/products/${req.params.id} -> Cabeçalho Accept-Language:`, req.headers['accept-language']);
    
    const lang = (req.headers['accept-language'] || 'pt').split(',')[0].substring(0, 2);
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(translateProduct(product, lang));
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// NOVA FUNÇÃO
const getProductForEdit = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product); // Retorna o objeto completo, sem tradução
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const getTopProducts = async (req, res) => {
    try {
        const lang = (req.headers['accept-language'] || 'pt').split(',')[0].substring(0, 2);
        const products = await Product.find({}).sort({ price: -1 }).limit(3);
        res.json(products.map(p => translateProduct(p, lang)));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = new Product({
            name: { pt: 'Produto de Amostra', en: 'Sample Product' },
            price: 0,
            user: req.user._id,
            image: '/images/sample.jpg',
            brand: { pt: 'Marca de Amostra', en: 'Sample Brand' },
            category: { pt: 'Categoria de Amostra', en: 'Sample Category' },
            countInStock: 0,
            description: { pt: 'Descrição de Amostra', en: 'Sample Description' },
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

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
            const lang = req.headers['accept-language'] || 'pt';
            res.json(translateProduct(updatedProduct, lang));
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Erro ao atualizar o produto' });
    }
};

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
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

export { 
    getProducts, 
    getProductById, 
    deleteProduct, 
    createProduct, 
    updateProduct, 
    getTopProducts,
    getProductForEdit 
};