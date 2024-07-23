import Customer from "../entity/customer";
import RepositoryInteface from "../../@shared/repository/repository-interface";

export default interface CustomerRepositoryInterface 
    extends RepositoryInteface<Customer> {}