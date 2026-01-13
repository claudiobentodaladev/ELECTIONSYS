import mysql from "../../database/mysql/db.connection.mjs";

/**
 * Verifica se o tema pertence ao usuário admin
 * @param {number} themeId - ID do tema
 * @param {number} userId - ID do usuário
 * @returns {Promise<{success: boolean, themeId?: number, error?: string}>}
 */
export function verifyThemeOwnership(themeId, userId) {
    return new Promise((resolve) => {
        mysql.execute(
            "SELECT id FROM theme WHERE id = ? AND user_id = ?",
            [themeId, userId],
            (err, result) => {
                if (err) {
                    resolve({ success: false, error: err.message });
                    return;
                }
                if (result.length === 0) {
                    resolve({ success: false, error: "Theme not found or not owned by user" });
                    return;
                }
                resolve({ success: true, themeId: result[0].id });
            }
        );
    });
}

/**
 * Verifica a participação do usuário em uma eleição
 * @param {number} userId - ID do usuário
 * @param {number} electionId - ID da eleição
 * @returns {Promise<{success: boolean, participation?: object, error?: string}>}
 */
export function getUserParticipation(userId, electionId) {
    return new Promise((resolve) => {
        mysql.execute(
            "SELECT * FROM participation WHERE user_id = ? AND election_id = ?",
            [userId, electionId],
            (err, result) => {
                if (err) {
                    resolve({ success: false, error: err.message });
                    return;
                }
                if (result.length === 0) {
                    resolve({ success: false, error: "No participation found" });
                    return;
                }
                resolve({ success: true, participation: result[0] });
            }
        );
    });
}

/**
 * Obtém informações da eleição
 * @param {number} electionId - ID da eleição
 * @param {number} themeId - ID do tema (opcional, para filtrar)
 * @returns {Promise<{success: boolean, election?: object, error?: string}>}
 */
export function getElectionInfo(electionId, themeId = null) {
    return new Promise((resolve) => {
        const query = themeId
            ? "SELECT * FROM elections WHERE id = ? AND theme_id = ?"
            : "SELECT * FROM elections WHERE id = ?";
        const params = themeId ? [electionId, themeId] : [electionId];

        mysql.execute(query, params, (err, result) => {
            if (err) {
                resolve({ success: false, error: err.message });
                return;
            }
            if (result.length === 0) {
                resolve({ success: false, error: "Election not found" });
                return;
            }
            resolve({ success: true, election: result[0] });
        });
    });
}

/**
 * Obtém todas as eleições de um tema
 * @param {number} themeId - ID do tema
 * @returns {Promise<{success: boolean, elections?: Array, error?: string}>}
 */
export function getElectionsByTheme(themeId) {
    return new Promise((resolve) => {
        mysql.execute(
            "SELECT * FROM elections WHERE theme_id = ?",
            [themeId],
            (err, result) => {
                if (err) {
                    resolve({ success: false, error: err.message });
                    return;
                }
                resolve({ success: true, elections: result });
            }
        );
    });
}

/**
 * Insere um log de auditoria
 * @param {number} userId - ID do usuário
 * @param {string} action - Ação realizada
 * @param {number} electionId - ID da eleição
 * @param {number} candidateId - ID do candidato (opcional)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export function insertAuditLog(userId, action, electionId, candidateId = null) {
    return new Promise((resolve) => {
        mysql.execute(
            "INSERT INTO audit_logs VALUES (default,?,?,?,null,default)",
            [userId, action, electionId],
            (err) => {
                if (err) {
                    resolve({ success: false, error: err.message });
                    return;
                }
                resolve({ success: true });
            }
        );
    });
}

/**
 * Atualiza o status da eleição baseado nas datas
 * @param {number} electionId - ID da eleição
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export function updateElectionStatus(electionId) {
    return new Promise((resolve) => {
        mysql.execute(
            "SELECT id, start_at, end_at, status FROM elections WHERE id = ?",
            [electionId],
            (err, result) => {
                if (err) {
                    resolve({ success: false, error: err.message });
                    return;
                }
                if (result.length === 0) {
                    resolve({ success: false, error: "Election not found" });
                    return;
                }

                const election = result[0];
                const now = new Date();
                const startAt = new Date(election.start_at);
                const endAt = new Date(election.end_at);

                let newStatus = election.status;

                if (now >= startAt && now <= endAt && election.status === 'active') {
                    newStatus = 'ongoing';
                } else if (now > endAt && election.status !== 'closed') {
                    newStatus = 'closed';
                }

                if (newStatus !== election.status) {
                    mysql.execute(
                        "UPDATE elections SET status = ? WHERE id = ?",
                        [newStatus, electionId],
                        (err) => {
                            if (err) {
                                resolve({ success: false, error: err.message });
                                return;
                            }
                            resolve({ success: true });
                        }
                    );
                } else {
                    resolve({ success: true });
                }
            }
        );
    });
}

/**
 * Verifica se uma eleição pode aceitar candidatos/votos baseado no status e datas
 * @param {number} electionId - ID da eleição
 * @param {string} action - Tipo de ação: 'candidacy' ou 'vote'
 * @returns {Promise<{success: boolean, canParticipate: boolean, status: string, error?: string}>}
 */
export function checkElectionEligibility(electionId, action = 'vote') {
    return new Promise(async (resolve) => {
        // Primeiro atualiza o status
        const updateResult = await updateElectionStatus(electionId);
        if (!updateResult.success) {
            resolve({ success: false, error: updateResult.error });
            return;
        }

        // Depois verifica o status atual
        const electionResult = await getElectionInfo(electionId);
        if (!electionResult.success) {
            resolve({ success: false, error: electionResult.error });
            return;
        }

        const election = electionResult.election;
        const now = new Date();
        const startAt = new Date(election.start_at);
        const endAt = new Date(election.end_at);

        let canParticipate = false;

        if (action === 'candidacy') {
            // Candidaturas são permitidas apenas durante o status 'active'
            canParticipate = election.status === 'active';
        } else if (action === 'vote') {
            // Votos são permitidos apenas durante o status 'ongoing'
            canParticipate = election.status === 'ongoing' && now >= startAt && now <= endAt;
        }

        resolve({
            success: true,
            canParticipate,
            status: election.status,
            election
        });
    });
}

/**
 * Valida datas de eleição (não permite datas no passado)
 * @param {Date} startDate - Data de início
 * @param {Date} endDate - Data de fim
 * @returns {boolean} - True se válido
 */
export function validateElectionDates(startDate, endDate) {
    const now = new Date();
    return startDate > now && startDate < endDate;
}