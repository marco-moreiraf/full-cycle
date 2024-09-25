import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ProductGateway from "../../gateway/product.gateway";
import { FindAllProductsOutputDto } from "./find-all-products.dto";

export default class FindAllProductsUseCase implements UseCaseInterface {
  private _productRespository: ProductGateway;

  constructor(productRepository: ProductGateway) {
    this._productRespository = productRepository;
  }

  async execute(): Promise<FindAllProductsOutputDto> {
    const products = await this._productRespository.findAll();

    return {
      products: products.map((product) => ({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),
    };
  }
}
