export interface ListProductsFacadeOutputDto {
  products: {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
  }[];
}

export interface FindProductFacadeInputDto {
  productId: string;
}

export interface FindProductOutputDto {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
}

export default interface StoreCatalogFacadeInterface {
  listProducts(): Promise<ListProductsFacadeOutputDto>;
  findProduct(input: FindProductFacadeInputDto): Promise<FindProductOutputDto>;
}
