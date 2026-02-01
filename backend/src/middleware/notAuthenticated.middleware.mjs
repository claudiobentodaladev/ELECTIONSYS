import { apiResponse } from "../utils/response.class.mjs";

export const notAuthenticated = (request, response, next) => {
  const { user } = request;
  if (user) return response.status(400).json(
    new apiResponse("must be logged out to sign up", request).error(user)
  )
  next()
}