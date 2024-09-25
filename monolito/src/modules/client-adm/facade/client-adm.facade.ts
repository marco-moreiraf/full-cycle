import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface, {
  AddClientFacadeInputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from "./client-adm.facade.interface";

export interface UseCaseProps {
  addClientUseCase: UseCaseInterface;
  findClientUseCase: UseCaseInterface;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  private _addClientUseCase: UseCaseInterface;
  private _findClientUseCase: UseCaseInterface;

  constructor(props: UseCaseProps) {
    this._addClientUseCase = props.addClientUseCase;
    this._findClientUseCase = props.findClientUseCase;
  }

  async addClient(input: AddClientFacadeInputDto): Promise<void> {
    await this._addClientUseCase.execute(input);
  }

  async findClient(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto> {
    return await this._findClientUseCase.execute(input);
  }
}
