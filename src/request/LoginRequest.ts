import { z } from "zod";

const getValidator = () => {
  return z.object({
    login: z.string(),
    password: z.string(),
  });
};

export type LoginRequest = z.infer<ReturnType<typeof getValidator>>;

export default getValidator;
