import {
  type ClientProduct,
  type ClientLoginResponse,
  type ClientUser,
} from "./types";

export const isClientProduct = (product: any): product is ClientProduct => {
  return true; // TODO. Implement type guard.
};

export const isClientProducts = (
  products: any[],
): products is ClientProduct[] => {
  return true; // TODO. Implement type guard.
};

export const isClientLoginResponse = (
  loginResponse: any,
): loginResponse is ClientLoginResponse => {
  return true; // TODO. Implement type guard.
};

export const isClientUser = (clientUser: any): clientUser is ClientUser => {
  return true; // TODO. Implement type guard.
};
