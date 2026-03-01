import { CommonResponseDTO, PaginatedResponseDTO } from './common.dto';

export interface CreateItemRequestBodyDTO {
  name: string;
  description?: string;
}

export interface UpdateItemRequestBodyDTO {
  name?: string;
  description?: string;
}

export interface ItemResponseDTO {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateItemResponseDTO = CommonResponseDTO<ItemResponseDTO>;
export type GetItemResponseDTO = CommonResponseDTO<ItemResponseDTO>;
export type UpdateItemResponseDTO = CommonResponseDTO<ItemResponseDTO>;
export type DeleteItemResponseDTO = CommonResponseDTO<null>;
export type GetItemsResponseDTO = PaginatedResponseDTO<ItemResponseDTO>;
