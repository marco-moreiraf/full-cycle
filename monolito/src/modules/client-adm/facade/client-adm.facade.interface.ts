import Address from "../../@shared/domain/value-object/address.value-object";

export interface AddClientFacadeInputDto {
  id?: string;
  name: string;
  email: string;
  document: string;
  address: Address;
}

export interface AddClientFacadeOutputDto {
  id: string;
  name: string;
  email: string;
  document: string;
  address: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface FindClientFacadeInputDto {
  id: string;
}

export interface FindClientFacadeOutputDto {
  id: string;
  name: string;
  email: string;
  document: string;
  address: Address;
  createdAt: Date;
  updatedAt: Date;
}

export default interface ClientAdmFacadeInterface {
  addClient(input: AddClientFacadeInputDto): Promise<AddClientFacadeOutputDto>;
  findClient(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto>;
}
