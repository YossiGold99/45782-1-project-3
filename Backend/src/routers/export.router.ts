import { Router } from 'express';
import * as exportController from '../controllers/export.controller';

const router = Router();

// Export routes (already protected by enforceAuth middleware in app.ts)
router.get('/users/csv', exportController.exportUsersCSV);
router.get('/users/excel', exportController.exportUsersExcel);
router.get('/tours/csv', exportController.exportToursCSV);
router.get('/tours/excel', exportController.exportToursExcel);

export default router;
