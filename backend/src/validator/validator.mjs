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
  // -------- USER BASE --------
  "user[0].email": {
    in: ["body"],
    isEmail: {
      errorMessage: "email inválido"
    },
    notEmpty: {
      errorMessage: "email é obrigatório"
    }
  },

  "user[0].password": {
    in: ["body"],
    isLength: {
      options: { min: 6 },
      errorMessage: "password deve ter no mínimo 6 caracteres"
    }
  },

  "user[0].role": {
    in: ["body"],
    isIn: {
      options: [["admin", "eleitor"]],
      errorMessage: "role deve ser admin ou eleitor"
    }
  },

  // -------- PROFILE --------
  "user[1].name": {
    in: ["body"],
    notEmpty: {
      errorMessage: "name é obrigatório"
    },
    isLength: {
      options: { min: 2 },
      errorMessage: "name muito curto"
    }
  },

  "user[1].surname": {
    in: ["body"],
    optional: true,
    isLength: {
      options: { min: 2 },
      errorMessage: "surname muito curto"
    }
  },

  "user[1].sex": {
    in: ["body"],
    optional: true,
    isIn: {
      options: [["M", "F"]],
      errorMessage: "sex deve ser M ou F"
    }
  },

  "user[1].born_date": {
    in: ["body"],
    optional: true,
    isISO8601: {
      errorMessage: "born_date deve ser uma data válida (YYYY-MM-DD)"
    }
  },

  "user[1].photo_url": {
    in: ["body"],
    optional: true,
    isURL: {
      errorMessage: "photo_url deve ser uma URL válida"
    }
  }
});
