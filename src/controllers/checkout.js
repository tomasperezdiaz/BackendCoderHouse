import { ticketModel } from "../dao/mongo/models/ticket.js";
import { userModel } from "../dao/mongo/models/user.js";

class CheckoutController {
    async viewCheckout(req, res) {
        const { ticketId } = req.params;

        try {
           
            const ticket = await ticketModel.findById(ticketId).populate('purchaser');
            if (!ticket) {
                return res.status(404).send('Ticket no encontrado');
            }

           
            const { purchaser } = ticket;
            if (!purchaser) {
                return res.status(404).send('Usuario no encontrado');
            }

            const { name, lastName, email } = purchaser;

            res.render('checkout', {
                cliente: `${name} ${lastName}`,
                numTicket: ticket.code,
                email: email,
            });
        } catch (error) {
            console.error('Error al obtener el ticket:', error);
            res.status(500).send('Error interno del servidor');
        }
    }
}

export default new CheckoutController();