import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { itemService } from '../services/item.service';
import { logger } from '../utils/logger';

export const itemController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description } = req.body as { name: string; description?: string };

      logger.info({ name }, 'Controller: create item request');

      const item = await itemService.createItem(name, description);

      logger.info({ itemId: item.id }, 'Controller: item created');

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Item created successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('Controller: get all items request');

      const items = await itemService.getAllItems();

      logger.info({ count: items.length }, 'Controller: items fetched');

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Items retrieved successfully',
        data: items,
        pagination: {
          page: 1,
          limit: items.length,
          total: items.length,
          totalPages: 1,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'] as string;

      logger.info({ itemId: id }, 'Controller: get item by id request');

      const item = await itemService.getItemById(id);

      logger.info({ itemId: id }, 'Controller: item fetched');

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Item retrieved successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'] as string;
      const updateData = req.body as { name?: string; description?: string };

      logger.info({ itemId: id }, 'Controller: update item request');

      const item = await itemService.updateItem(id, updateData);

      logger.info({ itemId: id }, 'Controller: item updated');

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Item updated successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'] as string;

      logger.info({ itemId: id }, 'Controller: delete item request');

      await itemService.deleteItem(id);

      logger.info({ itemId: id }, 'Controller: item deleted');

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Item deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
