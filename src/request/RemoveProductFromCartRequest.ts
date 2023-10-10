import { z } from "zod";

const getValidator = () => {
  return z.object({
    productId: z.string(),
  });
};

export type RemoveProductFromCartRequest = z.infer<
  ReturnType<typeof getValidator>
>;

export default getValidator;
