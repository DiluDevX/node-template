import { Item } from '@prisma/client';
import { itemDatabaseService } from './item.database.service';
import { NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';
import { ERROR_MESSAGES } from '../utils/constants';

export const itemService = {
  async createItem(name: string, description?: string): Promise<Item> {
    logger.info({ name }, 'Creating new item');

    const item = await itemDatabaseService.create({ name, description });

    logger.info({ itemId: item.id, name }, 'Item created successfully');

    return item;
  },

  async getItemById(id: string): Promise<Item> {
    logger.debug({ itemId: id }, 'Fetching item by id');

    const item = await itemDatabaseService.findOneById(id);

    if (!item) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return item;
  },

  async getAllItems(): Promise<Item[]> {
    logger.debug('Fetching all items');

    return itemDatabaseService.findMany();
  },

  async updateItem(id: string, data: Partial<Pick<Item, 'name' | 'description'>>): Promise<Item> {
    logger.info({ itemId: id }, 'Updating item');

    const item = await itemDatabaseService.update(id, data);

    logger.info({ itemId: id }, 'Item updated successfully');

    return item;
  },

  async deleteItem(id: string): Promise<void> {
    logger.info({ itemId: id }, 'Soft deleting item');

    await itemDatabaseService.softDelete(id);

    logger.info({ itemId: id }, 'Item deleted successfully');
  },
};
