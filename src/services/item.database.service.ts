import { Prisma, Item } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../utils/errors';
import { logger } from '../utils/logger';

const PRISMA_NOT_FOUND_CODE = 'P2025';

export const itemDatabaseService = {
  async findMany(where?: Prisma.ItemWhereInput): Promise<Item[]> {
    return prisma.item.findMany({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  },

  async findOneById(id: string): Promise<Item | null> {
    return prisma.item.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  },

  async create(data: Prisma.ItemCreateInput): Promise<Item> {
    try {
      return await prisma.item.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictError('An item with this identifier already exists');
      }
      throw error;
    }
  },

  async update(id: string, data: Prisma.ItemUpdateInput): Promise<Item> {
    try {
      return await prisma.item.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_NOT_FOUND_CODE
      ) {
        throw new NotFoundError(`Item with id ${id} not found`);
      }
      throw error;
    }
  },

  async softDelete(id: string): Promise<Item> {
    try {
      return await prisma.item.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_NOT_FOUND_CODE
      ) {
        throw new NotFoundError(`Item with id ${id} not found`);
      }
      throw error;
    }
  },

  async hardDelete(id: string): Promise<Item> {
    try {
      return await prisma.item.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_NOT_FOUND_CODE
      ) {
        throw new NotFoundError(`Item with id ${id} not found`);
      }
      throw error;
    }
  },
};

logger.debug('ItemDatabaseService initialized');
