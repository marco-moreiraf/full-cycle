import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import PaymentFacadeInterface, {
  ProcessPaymentFacadeInputDto,
  ProcessPaymentFacadeOutputDto,
} from "./payment.facade.interface";

export default class PaymentFacade implements PaymentFacadeInterface {
  private _processPaymentUseCase: UseCaseInterface;

  constructor(processPaymentInterface: UseCaseInterface) {
    this._processPaymentUseCase = processPaymentInterface;
  }

  async process(
    input: ProcessPaymentFacadeInputDto
  ): Promise<ProcessPaymentFacadeOutputDto> {
    return await this._processPaymentUseCase.execute(input);
  }
}
