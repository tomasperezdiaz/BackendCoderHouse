import { createCart } from "./cartsManager.js";
import { productoModel } from "./models/products.js";
import { request, response } from "express";

export const getProducts = async ({ limit = 10, page = 1, sort, query }) => {
  page = page == 0 ? 1 : page;
  page = Number(page);
  limit = Number(limit);
  
  const skip = (page - 1) * limit;
  const sortOrderOptions = {
    asc: -1,
    desc: 1,
  };
  sort = sortOrderOptions[sort] || null;

  try {
    if (query) query = JSON.parse(decodeURIComponent(query));
  } catch (error) {
    query = {};
  }

  const queryProducts = productoModel
    .find(query)
    .limit(limit)
    .skip(skip)
    .lean();
  if (sort !== null) {
    queryProducts.sort({ price: sort });
  }
  const [productos, totalDocs] = await Promise.all([
    queryProducts,
    productoModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;
  const hasPrePage = page > 1;
  const prevPage = hasPrePage ? page - 1 : null;
  const nextPage = hasNextPage ? page + 1 : null;




  return {
    page,
    totalDocs,
    totalPages,
    limit,
    query: JSON.stringify(query),
    hasNextPage,
    hasPrePage,
    prevPage,
    nextPage,
    payload: productos,
   
    //Tengo que pasar el parmetro del carro para aca, asi la busqueda en handlebars es mas facil, hacer mañana y despues con eso fijarse como hacer lo del ticket
  };
};

export const getProductsById = async (id) => await productoModel.findById(id);

export const addProduct = async ({
  title,
  description,
  price,
  thumbnails,
  code,
  stock,
  category,
  status,
}) => {
  return await productoModel.create({
    title,
    description,
    price,
    thumbnails,
    code,
    stock,
    category,
    status,
  });
};

export const updateProduct = async (id, rest) =>
  await productoModel.findByIdAndUpdate(id, { ...rest }, { new: true });

export const deleteProduct = async (id) =>
  await productoModel.findByIdAndDelete(id);
