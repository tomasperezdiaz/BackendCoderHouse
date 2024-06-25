import express from "express";
import checkout from "../controllers/checkout.js";

const router = express.Router();

router.get("/:ticketId", checkout.viewCheckout);

export default router;
