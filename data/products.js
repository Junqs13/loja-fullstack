const products = [
  {
    name: {
      pt: 'Fones de Ouvido Bluetooth sem Fio Airpods',
      en: 'Airpods Wireless Bluetooth Headphones',
    },
    image: '/images/airpods.jpg',
    description: {
      pt: 'A tecnologia Bluetooth permite conectar com dispositivos compatíveis sem fio. Áudio de alta qualidade AAC oferece uma experiência de audição imersiva. Microfone embutido permite atender chamadas enquanto trabalha.',
      en: 'Bluetooth technology lets you connect it with compatible devices wirelessly. High-quality AAC audio offers immersive listening experience. Built-in microphone allows you to take calls while working.',
    },
    brand: { pt: 'Apple', en: 'Apple' },
    category: { pt: 'Eletrônicos', en: 'Electronics' },
    price: 89.99,
    countInStock: 10,
  },
  {
    name: { pt: 'iPhone 13 Pro 256GB', en: 'iPhone 13 Pro 256GB' },
    image: '/images/phone.jpg',
    description: {
      pt: 'Apresentando o iPhone 13 Pro. Um sistema de câmera tripla transformador que adiciona toneladas de capacidade sem complexidade. Um salto sem precedentes na vida útil da bateria.',
      en: 'Introducing the iPhone 13 Pro. A transformative triple-camera system that adds tons of capability without complexity. An unprecedented leap in battery life.',
    },
    brand: { pt: 'Apple', en: 'Apple' },
    category: { pt: 'Eletrônicos', en: 'Electronics' },
    price: 599.99,
    countInStock: 7,
  },
  {
    name: { pt: 'Câmera Cannon EOS 80D DSLR', en: 'Cannon EOS 80D DSLR Camera' },
    image: '/images/camera.jpg',
    description: {
      pt: 'Caracterizada por especificações de imagem versáteis, a Canon EOS 80D se destaca ainda mais com um par de sistemas de foco robustos e um design intuitivo.',
      en: 'Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself using a pair of robust focusing systems and an intuitive design.',
    },
    brand: { pt: 'Cannon', en: 'Cannon' },
    category: { pt: 'Eletrônicos', en: 'Electronics' },
    price: 929.99,
    countInStock: 5,
  },
  {
    name: { pt: 'Sony Playstation 5', en: 'Sony Playstation 5' },
    image: '/images/playstation.jpg',
    description: {
      pt: 'A melhor experiência de jogo está aqui com o Playstation 5. Experimente carregamento ultrarrápido com um SSD de altíssima velocidade e imersão mais profunda.',
      en: 'The ultimate gaming experience is here with the Playstation 5. Experience lightning-fast loading with an ultra-high-speed SSD and deeper immersion.',
    },
    brand: { pt: 'Sony', en: 'Sony' },
    category: { pt: 'Eletrônicos', en: 'Electronics' },
    price: 399.99,
    countInStock: 11,
  },
  {
    name: { pt: 'Mouse Gamer Logitech G-Series', en: 'Logitech G-Series Gaming Mouse' },
    image: '/images/mouse.jpg',
    description: {
      pt: 'Tenha mais controle sobre seu jogo com o mouse gamer G-Series. Rastreamento de alta precisão e design ergonômico para longas sessões de jogo.',
      en: 'Get more control over your game with the G-Series gaming mouse. High-precision tracking and ergonomic design for long gaming sessions.',
    },
    brand: { pt: 'Logitech', en: 'Logitech' },
    category: { pt: 'Eletrônicos', en: 'Electronics' },
    price: 49.99,
    countInStock: 7,
  },
  {
    name: { pt: 'Amazon Echo Dot (4ª Geração)', en: 'Amazon Echo Dot (4th Generation)' },
    image: '/images/alexa.jpg',
    description: {
      pt: 'Conheça o Echo Dot. Nosso smart speaker mais popular com Alexa. O design elegante e compacto oferece vocais nítidos e graves equilibrados para um som completo.',
      en: 'Meet the Echo Dot. Our most popular smart speaker with Alexa. The sleek, compact design delivers crisp vocals and balanced bass for full sound.',
    },
    brand: { pt: 'Amazon', en: 'Amazon' },
    category: { pt: 'Eletrônicos', en: 'Electronics' },
    price: 29.99,
    countInStock: 0,
  },
  {
    name: { pt: 'Teclado Mecânico Gamer RGB', en: 'RGB Mechanical Gaming Keyboard' },
    image: '/images/keyboard.jpg',
    description: {
      pt: 'Domine o campo de batalha com este teclado mecânico. Switches de alta performance, iluminação RGB customizável e construção robusta para durabilidade.',
      en: 'Dominate the battlefield with this mechanical keyboard. High-performance switches, customizable RGB lighting, and rugged construction for durability.',
    },
    brand: { pt: 'SteelSeries', en: 'SteelSeries' },
    category: { pt: 'Eletrônicos', en: 'Electronics' },
    price: 119.99,
    countInStock: 8,
  },
  {
    name: { pt: 'Monitor Ultrawide 34 Polegadas', en: '34-Inch Ultrawide Monitor' },
    image: '/images/monitor.jpg',
    description: {
      pt: 'Expanda sua visão de jogo e produtividade. Este monitor ultrawide oferece uma experiência imersiva com cores vibrantes e alta taxa de atualização.',
      en: 'Expand your gaming and productivity view. This ultrawide monitor offers an immersive experience with vibrant colors and a high refresh rate.',
    },
    brand: { pt: 'LG', en: 'LG' },
    category: { pt: 'Eletrônicos', en: 'Electronics' },
    price: 499.99,
    countInStock: 4,
  },
  {
    name: { pt: 'Cadeira Gamer Ergonômica', en: 'Ergonomic Gaming Chair' },
    image: '/images/chair.jpg',
    description: {
      pt: 'Conforto e suporte para longas horas de trabalho ou jogo. Design ergonômico com múltiplos ajustes para se adaptar perfeitamente ao seu corpo.',
      en: 'Comfort and support for long hours of work or play. Ergonomic design with multiple adjustments to perfectly fit your body.',
    },
    brand: { pt: 'DXRacer', en: 'DXRacer' },
    category: { pt: 'Acessórios', en: 'Accessories' },
    price: 299.99,
    countInStock: 12,
  },
  {
    name: { pt: 'Webcam 4K com Microfone', en: '4K Webcam with Microphone' },
    image: '/images/webcam.jpg',
    description: {
      pt: 'Qualidade de imagem profissional para suas streams e videochamadas. Resolução 4K, foco automático e microfones com cancelamento de ruído.',
      en: 'Professional image quality for your streams and video calls. 4K resolution, autofocus, and noise-canceling microphones.',
    },
    brand: { pt: 'Razer', en: 'Razer' },
    category: { pt: 'Eletrônicos', en: 'Electronics' },
    price: 199.99,
    countInStock: 6,
  },
];

export default products;