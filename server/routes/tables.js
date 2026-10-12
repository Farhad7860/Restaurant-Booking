import express from 'express';
import { 
  getAllTables, 
  getTableStats, 
  initializeTables, 
  updateTableStatus 
} from '../controllers/tableController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Initialize tables (no auth required for first time)
router.post('/initialize', initializeTables);

// Get table statistics (requires authentication)
router.get('/stats', authenticate, getTableStats);

// Get all tables (requires authentication)
router.get('/',getAllTables);

// Update table status (requires authentication)
router.put('/:id', updateTableStatus);

export default router;