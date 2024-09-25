import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindProductUseCase from "./find-product.usecase";

const product = new Product({
  id: new Id(),
  name: "Product 1",
  description: "Product 1 description",
  salesPrice: 100,
});

const MockRepository = () => {
  return {
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
  };
};

describe("FindProduct usecase unit test", () => {
  it("should find a product", async () => {
    const productRepository = MockRepository();
    const usecase = new FindProductUseCase(productRepository);

    const productFound = await usecase.execute({ id: product.id.id });

    expect(productRepository.find).toHaveBeenCalled();
    expect(productFound.id).toBe(product.id.id);
    expect(productFound.name).toBe(product.name);
    expect(productFound.description).toBe(product.description);
    expect(productFound.salesPrice).toBe(product.salesPrice);
  });
});
