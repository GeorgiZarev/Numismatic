import { Addresses } from "../utils/db/addresses.js";
import NotFoundError from "../errors/NotFoundError.js";

export const listAddresses = async (req, res, next) => {
  try { res.json(await Addresses.list(req.user.id)); } catch (error) { next(error); }
};

export const createAddress = async (req, res, next) => {
  try { res.status(201).json(await Addresses.create(req.user.id, req.body)); }
  catch (error) { next(error); }
};

export const updateAddress = async (req, res, next) => {
  try {
    const existing = (await Addresses.list(req.user.id)).find((item) => item.id === req.params.id);
    if (!existing) throw new NotFoundError("Address not found");
    res.json(await Addresses.update(req.user.id, req.params.id, req.body));
  } catch (error) { next(error); }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const deleted = await Addresses.remove(req.user.id, req.params.id);
    if (!deleted) throw new NotFoundError("Address not found");
    res.status(204).end();
  } catch (error) { next(error); }
};
