import Table from '../models/Table.js';

// Get all tables
export const getAllTables = async (req, res) => {
  try {
    console.log('Fetching all tables...');
    
    const tables = await Table.find().sort({ tableNumber: 1 });
    
    console.log(`Found ${tables.length} tables`);
    
    if (tables.length === 0) {
      return res.status(200).json([]);
    }
    
    res.status(200).json(tables);
  } catch (error) {
    console.error('Error in getAllTables:', error);
    res.status(500).json({ 
      message: 'Failed to fetch tables',
      error: error.message 
    });
  }
};

// Get table statistics
export const getTableStats = async (req, res) => {
  try {
    console.log('Fetching table stats...');
    
    const total = await Table.countDocuments();
    const available = await Table.countDocuments({ status: 'available' });
    const occupied = await Table.countDocuments({ status: 'occupied' });
    const reserved = await Table.countDocuments({ status: 'reserved' });

    const stats = {
      total,
      available,
      occupied,
      reserved,
      occupancyRate: total > 0 ? Math.round(((occupied + reserved) / total) * 100) : 0
    };

    console.log('Stats:', stats);
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error in getTableStats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch table statistics',
      error: error.message 
    });
  }
};

// Initialize tables (create 10 default tables)
export const initializeTables = async (req, res) => {
  try {
    console.log('Initializing tables...');
    
    const existingTables = await Table.countDocuments();
    
    if (existingTables > 0) {
      console.log(`Tables already initialized with ${existingTables} tables`);
      return res.status(400).json({ 
        message: `Tables already initialized with ${existingTables} tables`,
        count: existingTables
      });
    }

    // Create 10 tables
    const tables = [
      { tableNumber: 1, capacity: 2, location: 'window', status: 'available' },
      { tableNumber: 2, capacity: 2, location: 'corner', status: 'available' },
      { tableNumber: 3, capacity: 4, location: 'center', status: 'available' },
      { tableNumber: 4, capacity: 4, location: 'center', status: 'available' },
      { tableNumber: 5, capacity: 4, location: 'window', status: 'available' },
      { tableNumber: 6, capacity: 6, location: 'corner', status: 'available' },
      { tableNumber: 7, capacity: 6, location: 'center', status: 'available' },
      { tableNumber: 8, capacity: 8, location: 'window', status: 'available' },
      { tableNumber: 9, capacity: 8, location: 'corner', status: 'available' },
      { tableNumber: 10, capacity: 10, location: 'center', status: 'available' }
    ];

    const createdTables = await Table.insertMany(tables);
    
    console.log(`✅ ${createdTables.length} tables initialized successfully`);
    
    res.status(201).json({
      message: `✅ ${createdTables.length} tables initialized successfully`,
      total: createdTables.length,
      tables: createdTables
    });
  } catch (error) {
    console.error('Error in initializeTables:', error);
    res.status(500).json({ 
      message: 'Failed to initialize tables',
      error: error.message
    });
  }
};

// Update table status
export const updateTableStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['available', 'occupied', 'reserved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` 
      });
    }

    const table = await Table.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    console.log(`Table ${table.tableNumber} status updated to ${status}`);

    res.status(200).json({
      message: '✅ Table status updated successfully',
      table
    });
  } catch (error) {
    console.error('Error in updateTableStatus:', error);
    res.status(500).json({ 
      message: 'Failed to update table status',
      error: error.message 
    });
  }
};