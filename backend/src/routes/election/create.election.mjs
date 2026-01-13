import { Router } from "express";
import { createElection } from "../../validator/validator.mjs";
import { validator } from "../../utils/middlewares.mjs";
import { isAdmin } from "../../utils/middlewares.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { buildDate, formatDate } from "../../utils/data.mjs";
import { create, found } from "../../utils/response.class.mjs";
import { verifyThemeOwnership, insertAuditLog, validateElectionDates } from "../../utils/sql/sql.helpers.mjs";

const router = Router();

router.post("/:theme_id", createElection, validator, isAdmin, async (request, response) => {
    const { user } = request;
    const { theme_id } = request.params;
    const { start_at, end_at } = request.body;

    const startDate = buildDate(start_at);
    const endDate = buildDate(end_at);

    // Validação de datas: não permitir eleições no passado
    if (!validateElectionDates(startDate, endDate)) {
        return response.status(400).json(new create("election").not("Invalid dates: start date must be in the future and before end date"));
    }

    try {
        // Verificar se o tema pertence ao usuário
        const themeResult = await verifyThemeOwnership(theme_id, user.id);
        if (!themeResult.success) {
            return response.status(404).json(new found("theme").not());
        }

        // Inserir eleição
        const insertResult = await new Promise((resolve) => {
            mysql.execute(
                "INSERT INTO elections VALUES (default,?,?,?,default)",
                [themeResult.themeId, formatDate(startDate), formatDate(endDate)],
                (err, result) => {
                    if (err) resolve({ success: false, error: err.message });
                    else resolve({ success: true, insertId: result.insertId });
                }
            );
        });

        if (!insertResult.success) {
            return response.status(500).json(new create("election").error());
        }

        // Inserir log de auditoria
        const auditResult = await insertAuditLog(user.id, "ELECTION_CREATED", insertResult.insertId);
        if (!auditResult.success) {
            console.error("Failed to insert audit log:", auditResult.error);
            // Não retorna erro, pois a eleição foi criada com sucesso
        }

        return response.status(201).json(new create("election", insertResult.insertId).ok());

    } catch (error) {
        console.error("Error creating election:", error);
        return response.status(500).json(new create("election").error());
    }
});

export default router;