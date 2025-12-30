import { checkSchema } from "express-validator";

export const loginSchema = checkSchema({

  // email
  "email": {
    in: ["body"],
    isEmail: {
      errorMessage: "Email inválido"
    },
    normalizeEmail: true
  },

  // password
  "password": {
    in: ["body"],
    isLength: {
      options: { min: 5 },
      errorMessage: "Password deve ter no mínimo 5 caracteres"
    }
  }

});

export const signSchema = checkSchema({
  email: {
    in: ["body"],
    isEmail: { errorMessage: "email inválido" },
    notEmpty: { errorMessage: "email é obrigatório" }
  },

  password: {
    in: ["body"],
    isLength: {
      options: { min: 6 },
      errorMessage: "password deve ter no mínimo 6 caracteres"
    }
  },

  role: {
    in: ["body"],
    isIn: {
      options: [["admin", "eleitor"]],
      errorMessage: "role deve ser admin ou eleitor"
    }
  },

  "profile.name": {
    in: ["body"],
    notEmpty: { errorMessage: "name é obrigatório" }
  },

  "profile.surname": {
    in: ["body"],
    optional: true
  },

  "profile.sex": {
    in: ["body"],
    optional: true,
    isIn: {
      options: [["M", "F"]],
      errorMessage: "sex deve ser M ou F"
    }
  },

  "profile.born_date": {
    in: ["body"],
    optional: true,
    isISO8601: {
      errorMessage: "born_date deve ser YYYY-MM-DD"
    }
  },

  "profile.photo_url": {
    in: ["body"],
    optional: true,
    isURL: {
      errorMessage: "photo_url deve ser uma URL válida"
    }
  }
});
