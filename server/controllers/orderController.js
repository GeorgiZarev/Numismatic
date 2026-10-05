import BadRequestError from "../errors/BadRequestError.js";
import NotFoundError from "../errors/NotFoundError.js";
import { Orders } from "../utils/db/orders.js";

export const createOrder = async (req, res, next) => {
  try {
    const { items, ...orderData } = req.body;
    const order = await Orders.create({
      userId: req.user.id,
      orderData,
      items,
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    if (err.message?.startsWith("Coin not found")) {
      return next(new BadRequestError(err.message));
    }
    if (err.message?.startsWith("Coin is not available")) {
      return next(new BadRequestError(err.message));
    }
    next(err);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Orders.getByUserId(req.user.id);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Orders.getAll(req.query);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Orders.getById(req.params.id);
    if (!order) throw new NotFoundError("Order not found");
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Orders.updateStatus(req.params.id, req.body.status);
    if (!order) throw new NotFoundError("Order not found");

    res.status(200).json({
      message: "Order status updated",
      order,
    });
  } catch (err) {
    next(err);
  }
};
