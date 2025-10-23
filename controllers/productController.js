// controllers/productController.js
import Product from '../models/productModel.js';

// Função auxiliar para traduzir um produto para o idioma solicitado
const translateProduct = (product, lang) => {
    // Adiciona uma verificação caso 'product' seja null ou undefined
    if (!product || !product.name) {
        return null; // Ou retorna um objeto vazio, dependendo da sua preferência
    }
    const currentLang = lang && ['pt', 'en'].includes(lang) ? lang : 'pt'; // Garante que lang seja 'pt' ou 'en'

    return {
        _id: product._id,
        user: product.user,
        name: product.name[currentLang] || product.name.pt, // Fallback para 'pt'
        image: product.image,
        brand: product.brand[currentLang] || product.brand.pt,
        category: product.category[currentLang] || product.category.pt,
        description: product.description[currentLang] || product.description.pt,
        price: product.price,
        countInStock: product.countInStock,
        reviews: product.reviews,
        rating: product.rating,
        numReviews: product.numReviews,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
};

// --- FUNÇÃO getProducts ATUALIZADA COM PAGINAÇÃO ---
const getProducts = async (req, res) => {
  try {
    const lang = (req.headers['accept-language'] || 'pt').split(',')[0].substring(0, 2);
    const pageSize = 10; // Ou o número de produtos por página que desejar
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? {
        $or: [
            { 'name.pt': { $regex: req.query.keyword, $options: 'i' } },
            { 'name.en': { $regex: req.query.keyword, $options: 'i' } }
        ]
    } : {};

    // Conta o número total de produtos que correspondem à keyword
    const count = await Product.countDocuments({ ...keyword });

    // Busca os produtos da página atual
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // Traduz os produtos encontrados
    const translatedProducts = products.map(p => translateProduct(p, lang)).filter(p => p !== null); // Filtra nulos se houver erro na tradução

    // Retorna o objeto com a estrutura esperada
    res.json({
        products: translatedProducts,
        page,
        pages: Math.ceil(count / pageSize)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
// ----------------------------------------------------

const getProductById = async (req, res) => {
  try {
    const lang = (req.headers['accept-language'] || 'pt').split(',')[0].substring(0, 2);
    const product = await Product.findById(req.params.id);
    if (product) {
      const translated = translateProduct(product, lang);
      if (translated) {
        res.json(translated);
      } else {
         res.status(404).json({ message: 'Erro ao processar o produto' }); // Caso translateProduct retorne null
      }
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error(error);
    // Verifica se o erro é de ObjectId inválido
    if (error.kind === 'ObjectId') {
        res.status(404).json({ message: 'ID do produto inválido' });
    } else {
        res.status(500).json({ message: 'Erro no servidor' });
    }
  }
};

const getProductForEdit = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product); // Retorna o produto completo, sem tradução
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error(error);
         if (error.kind === 'ObjectId') {
            res.status(404).json({ message: 'ID do produto inválido' });
        } else {
            res.status(500).json({ message: 'Erro no servidor' });
        }
    }
};

const getTopProducts = async (req, res) => {
    try {
        const lang = (req.headers['accept-language'] || 'pt').split(',')[0].substring(0, 2);
        const products = await Product.find({}).sort({ price: -1 }).limit(3);
        res.json(products.map(p => translateProduct(p, lang)).filter(p => p !== null));
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
            user: req.user._id, // Assume que o middleware 'protect' adiciona req.user
            image: '/images/sample.jpg',
            brand: { pt: 'Marca de Amostra', en: 'Sample Brand' },
            category: { pt: 'Categoria de Amostra', en: 'Sample Category' },
            countInStock: 0,
            description: { pt: 'Descrição de Amostra', en: 'Sample Description' },
            reviews: [], // Inicializa reviews como array vazio
            rating: 0,
            numReviews: 0,
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct); // Retorna o produto criado (sem tradução, normalmente)
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Erro ao criar produto', details: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        // Recebe o objeto completo com pt/en do frontend
        const { name, price, description, image, brand, category, countInStock } = req.body;
        const product = await Product.findById(req.params.id);
        if (product) {
            // Atualiza os campos diretamente com os objetos pt/en
            product.name = name || product.name;
            product.price = price === undefined ? product.price : price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.brand = brand || product.brand;
            product.category = category || product.category;
            product.countInStock = countInStock === undefined ? product.countInStock : countInStock;

            const updatedProduct = await product.save();
            // Retorna o produto atualizado completo (sem tradução específica aqui)
            // O frontend que chamar /edit receberá este objeto completo
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Erro ao atualizar o produto', details: error.message });
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
        if (error.kind === 'ObjectId') {
            res.status(404).json({ message: 'ID do produto inválido' });
        } else {
            res.status(500).json({ message: 'Erro no servidor' });
        }
    }
};

const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if(!rating || !comment){
             res.status(400);
             throw new Error('Avaliação e comentário são obrigatórios');
        }

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );
            if (alreadyReviewed) {
                res.status(400);
                throw new Error('Produto já avaliado por este utilizador');
            }
            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
            await product.save();
            res.status(201).json({ message: 'Avaliação adicionada' });
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error(error);
         if (error.kind === 'ObjectId') {
            res.status(404).json({ message: 'ID do produto inválido' });
        } else {
           res.status(res.statusCode || 400).json({ message: error.message });
        }
    }
};

const getLowStockProducts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 10;
    const products = await Product.find({ countInStock: { $lte: threshold } })
      .sort({ countInStock: 1 })
      .select('name category countInStock _id'); // Adicionado _id para o link no dashboard

    // Não precisa retornar 404 se não houver produtos, apenas um array vazio
    res.json(products);

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
    getProductForEdit,
    createProductReview,
    getLowStockProducts
};