import express, { Request, Response } from "express";
import InvoiceFacadeFactory from "../../modules/invoice/factory/facade.factory";
import { FindInvoiceFacadeInputDto } from "../../modules/invoice/facade/invoice.facade.interface";

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
  const invoiceFacade = InvoiceFacadeFactory.create();

  try {
    const input: FindInvoiceFacadeInputDto = {
      invoiceId: req.params.id,
    };

    const output = await invoiceFacade.findInvoice(input);

    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
