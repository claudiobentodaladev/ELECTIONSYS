import { validationResult } from "express-validator";
import { authResponse, validationResponse } from "./response.class.mjs";
import { updateElectionStatus } from "./sql/sql.helpers.mjs";

export const isAuthenticated = (request, response, next) => {
    if (!request.user) {
        return response.status(401).json(new authResponse("not authenticated").not());
    }
    next();
};

export const validator = (request, response, next) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(400).json(new validationResponse("validation error").error(errors.array()));
    }
    next();
};

export const isAdmin = (request, response, next) => {
    const { role } = request.user;
    if (role !== "admin") {
        return response.status(403).json({ message: "access denied, only for admin", your_role: role });
    }
    next();
};

export const isEleitor = (request, response, next) => {
    const { role } = request.user;
    if (role !== "eleitor") {
        return response.status(403).json({ message: "access denied, only for eleitor", your_role: role });
    }
    next();
};

/**
 * Middleware para atualizar automaticamente o status das eleições
 * Deve ser usado em rotas que recebem election_id ou candidate_id como parâmetro
 */
export const autoUpdateElectionStatus = async (request, response, next) => {
    const { election_id, candidate_id } = request.params;

    try {
        if (election_id) {
            await updateElectionStatus(election_id);
        } else if (candidate_id) {
            // Para rotas que usam candidate_id, precisamos encontrar a election_id primeiro
            const mysql = (await import("../database/mysql/db.connection.mjs")).default;
            const electionIdResult = await new Promise((resolve) => {
                mysql.execute(
                    "SELECT p.election_id FROM candidates c JOIN participation p ON c.participation_id = p.id WHERE c.id = ?",
                    [candidate_id],
                    (err, result) => {
                        if (err || result.length === 0) resolve(null);
                        else resolve(result[0].election_id);
                    }
                );
            });

            if (electionIdResult) {
                await updateElectionStatus(electionIdResult);
            }
        }
    } catch (error) {
        console.error("Failed to auto-update election status:", error);
        // Não bloqueia a requisição, apenas loga o erro
    }

    next();
};