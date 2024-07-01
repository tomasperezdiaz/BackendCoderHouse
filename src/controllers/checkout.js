import { ticketModel } from "../dao/mongo/models/ticket.js";
import { request, response } from "express";
import { CustomError } from "../utils/CustomError.js";
import ERROR_TYPES from "../utils/EErrors.js";


class CheckoutController {
  async viewCheckout(req = request, res = response, next) {
    const { ticketId } = req.params;

    try {
      const ticket = await ticketModel.findById(ticketId).populate("purchaser");
      if (!ticket) {
        return CustomError.createError(
          "ERROR",
          null,
          "Enter a valid Mongo ID",
          ERROR_TYPES.ARGUMENTOS_INVALIDOS
        );
      }

      const { purchaser } = ticket;
      if (!purchaser) {
        return CustomError.createError(
          "ERROR",
          null,
          "Enter a valid Mongo ID",
          ERROR_TYPES.ARGUMENTOS_INVALIDOS
        );
      }

      const { name, lastName, email } = purchaser;
      const user = req.session.user;
      res.render("checkout", {
        cliente: `${name} ${lastName}`,
        numTicket: ticket.code,
        email: email,
        amount: ticket.amount,
        user
      });
    } catch (error) {
     next(error)
    }
  }
}

export default new CheckoutController();
