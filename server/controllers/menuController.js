import MenuItem from '../models/MenuItem.js';

// Get all menu items
export const getAllMenuItems = async (req, res) => {
  try {
    console.log('Fetching all menu items...');
    
    const items = await MenuItem.find().sort({ category: 1, name: 1 });
    
    console.log(`Found ${items.length} menu items`);
    
    if (items.length === 0) {
      return res.status(200).json([]);
    }
    
    res.status(200).json(items);
  } catch (error) {
    console.error('Error in getAllMenuItems:', error);
    res.status(500).json({ 
      message: 'Failed to fetch menu items',
      error: error.message 
    });
  }
};

// Get menu items by category
export const getMenuByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    console.log(`Fetching menu items for category: ${category}`);

    // Validate category
    const validCategories = ['appetizers', 'mains', 'desserts', 'beverages'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        message: `Invalid category. Valid categories are: ${validCategories.join(', ')}` 
      });
    }

    const items = await MenuItem.find({ category }).sort({ name: 1 });

    console.log(`Found ${items.length} items in ${category} category`);

    if (items.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(items);
  } catch (error) {
    console.error('Error in getMenuByCategory:', error);
    res.status(500).json({ 
      message: 'Failed to fetch menu items by category',
      error: error.message 
    });
  }
};

// Initialize menu with default items
export const initializeMenu = async (req, res) => {
  try {
    console.log('Initializing menu...');
    
    const existingItems = await MenuItem.countDocuments();

    if (existingItems > 0) {
      console.log(`Menu already initialized with ${existingItems} items`);
      return res.status(400).json({ 
        message: `Menu already initialized with ${existingItems} items`,
        count: existingItems
      });
    }

    const menuItems = [
      // APPETIZERS
      { 
        name: 'Bruschetta', 
        description: 'Toasted bread with tomatoes and garlic', 
        price: 8.99, 
        category: 'appetizers', 
        vegetarian: true,
        available: true
      },
      { 
        name: 'Calamari Fritti', 
        description: 'Crispy fried squid', 
        price: 12.99, 
        category: 'appetizers',
        vegetarian: false,
        available: true
      },
      { 
        name: 'Shrimp Cocktail', 
        description: 'Chilled shrimp with cocktail sauce', 
        price: 11.99, 
        category: 'appetizers',
        vegetarian: false,
        available: true
      },

      // MAINS
      { 
        name: 'Grilled Salmon', 
        description: 'Fresh salmon with lemon butter sauce', 
        price: 24.99, 
        category: 'mains',
        vegetarian: false,
        available: true
      },
      { 
        name: 'Ribeye Steak', 
        description: 'Premium 12oz ribeye with garlic mashed potatoes', 
        price: 32.99, 
        category: 'mains',
        vegetarian: false,
        available: true
      },
      { 
        name: 'Vegetable Pasta', 
        description: 'Fresh pasta with seasonal vegetables and olive oil', 
        price: 16.99, 
        category: 'mains',
        vegetarian: true,
        available: true
      },
      { 
        name: 'Chicken Piccata', 
        description: 'Tender chicken with lemon and capers', 
        price: 22.99, 
        category: 'mains',
        vegetarian: false,
        available: true
      },

      // DESSERTS
      { 
        name: 'Tiramisu', 
        description: 'Classic Italian dessert with mascarpone and espresso', 
        price: 7.99, 
        category: 'desserts',
        vegetarian: true,
        available: true
      },
      { 
        name: 'Chocolate Lava Cake', 
        description: 'Warm chocolate cake with molten center', 
        price: 8.99, 
        category: 'desserts',
        vegetarian: true,
        available: true
      },

      // BEVERAGES
      { 
        name: 'Espresso', 
        description: 'Rich Italian espresso', 
        price: 3.99, 
        category: 'beverages',
        vegetarian: true,
        available: true
      },
      { 
        name: 'House Red Wine', 
        description: 'Selected house wine - glass', 
        price: 7.99, 
        category: 'beverages',
        vegetarian: true,
        available: true
      }
    ];

    const createdItems = await MenuItem.insertMany(menuItems);

    console.log(`✅ Menu initialized with ${createdItems.length} items`);

    res.status(201).json({
      message: `✅ Menu initialized successfully with ${createdItems.length} items`,
      total: createdItems.length,
      categories: {
        appetizers: 3,
        mains: 4,
        desserts: 2,
        beverages: 2
      },
      items: createdItems
    });
  } catch (error) {
    console.error('Error in initializeMenu:', error);
    res.status(500).json({ 
      message: 'Failed to initialize menu',
      error: error.message
    });
  }
};

// Get menu statistics
export const getMenuStats = async (req, res) => {
  try {
    console.log('Fetching menu stats...');
    
    const total = await MenuItem.countDocuments();
    const vegetarian = await MenuItem.countDocuments({ vegetarian: true });
    const available = await MenuItem.countDocuments({ available: true });
    
    const avgPrice = await MenuItem.aggregate([
      { $group: { _id: null, avgPrice: { $avg: '$price' } } }
    ]);

    const stats = {
      total,
      vegetarian,
      available,
      unavailable: total - available,
      averagePrice: avgPrice[0]?.avgPrice.toFixed(2) || 0
    };

    console.log('Menu stats:', stats);

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error in getMenuStats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch menu statistics',
      error: error.message 
    });
  }
};