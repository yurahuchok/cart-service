import { z } from "zod";

const getValidator = () => {
  return z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  });
};

export type UpsertProductToCartRequest = z.infer<
  ReturnType<typeof getValidator>
>;

export default getValidator;
