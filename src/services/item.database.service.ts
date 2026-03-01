import { Prisma, Item } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../utils/errors';

import { PRISMA_CODE } from '../utils/constants';

export const findMany = async (
  where?: Prisma.ItemWhereInput,
  pagination?: { skip?: number; take?: number }
): Promise<Item[]> => {
  return prisma.item.findMany({
    where: {
      ...where,
      deletedAt: null,
    },
    skip: pagination?.skip,
    take: pagination?.take,
  });
};

export const count = async (where?: Prisma.ItemWhereInput): Promise<number> => {
  return prisma.item.count({
    where: {
      ...where,
      deletedAt: null,
    },
  });
};

export const findOneById = async (id: string): Promise<Item | null> => {
  return prisma.item.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
};

export const create = async (data: Prisma.ItemCreateInput): Promise<Item> => {
  try {
    return await prisma.item.create({ data });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PRISMA_CODE.CONFLICT
    ) {
      throw new ConflictError('An item with this identifier already exists');
    }

    throw error;
  }
};

export const update = async (id: string, data: Prisma.ItemUpdateInput): Promise<Item> => {
  try {
    return await prisma.item.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PRISMA_CODE.NOT_FOUND
    ) {
      throw new NotFoundError(`Item with id ${id} not found`);
    }

    throw error;
  }
};

export const softDelete = async (id: string): Promise<Item> => {
  try {
    return await prisma.item.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PRISMA_CODE.NOT_FOUND
    ) {
      throw new NotFoundError(`Item with id ${id} not found`);
    }

    throw error;
  }
};

export const hardDelete = async (id: string): Promise<Item> => {
  try {
    return await prisma.item.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PRISMA_CODE.NOT_FOUND
    ) {
      throw new NotFoundError(`Item with id ${id} not found`);
    }

    throw error;
  }
};
