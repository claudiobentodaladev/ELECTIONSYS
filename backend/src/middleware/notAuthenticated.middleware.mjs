import { authResponse } from "../utils/response.class.mjs";

export const notAuthenticated = (request, response, next) => {
  const { user } = request;
  if (user) return response.status(400).json(
    new authResponse("must be logged out to sign up").ok(user)
  )
  next()
}