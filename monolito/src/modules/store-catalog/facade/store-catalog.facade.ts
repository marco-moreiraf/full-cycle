import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import StoreCatalogFacadeInterface, {
  FindProductFacadeInputDto,
  FindProductOutputDto,
  ListProductsFacadeOutputDto,
} from "./store-catalog.facade.interface";

export interface UseCaseProps {
  findAllProductsUseCase: UseCaseInterface;
  findProductUseCase: UseCaseInterface;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private _findAllProductsUseCase: UseCaseInterface;
  private _findProductUseCase: UseCaseInterface;

  constructor(props: UseCaseProps) {
    this._findAllProductsUseCase = props.findAllProductsUseCase;
    this._findProductUseCase = props.findProductUseCase;
  }

  async listProducts(): Promise<ListProductsFacadeOutputDto> {
    return await this._findAllProductsUseCase.execute({});
  }

  async findProduct(
    input: FindProductFacadeInputDto
  ): Promise<FindProductOutputDto> {
    return await this._findProductUseCase.execute({ id: input.productId });
  }
}
