import Customer from "../entity/customer";
import RepositoryInteface from "./repository-interface";

export default interface CustomerRepositoryInterface 
    extends RepositoryInteface<Customer> {}