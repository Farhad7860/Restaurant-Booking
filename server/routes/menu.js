import express from 'express';
import { getAllMenuItems, getMenuByCategory, initializeMenu } from '../controllers/menuController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Initialize menu (no auth required for first time)
router.post('/initialize', initializeMenu);

// Get all menu items (requires authentication)
router.get('/', authenticate, getAllMenuItems);

// Get menu items by category (requires authentication)
router.get('/category/:category', authenticate, getMenuByCategory);

export default router;