import mysql from "../../database/mysql/db.connection.mjs";

/**
 * Checks if the theme belongs to the admin user
 * @param {number} themeId - Theme ID
 * @param {number} userId - User ID
 * @returns {Promise<{success: boolean, themeId?: number}>}
 */
export function verifyThemeOwnership(themeId, userId) {
    return new Promise((resolve) => {
        mysql.execute(
            "SELECT id FROM theme WHERE id = ? AND user_id = ?",
            [themeId, userId],
            (err, result) => {
                if (err) {
                    resolve({ success: false, message: err.message });
                    return;
                }
                if (result.length === 0) {
                    resolve({ success: false, message: "Theme not found or not owned by user" });
                    return;
                }
                resolve({ success: true, themeId: result[0].id });
            }
        );
    });
}

/**
 * Checks the user's participation in an election
 * @param {number} userId - User ID
 * @param {number} electionId - Election ID
 * @returns {Promise<{success: boolean, participation?: object}>}
 */
export function getUserParticipation(userId, electionId) {
    return new Promise((resolve) => {
        mysql.execute(
            "SELECT * FROM participation WHERE user_id = ? AND election_id = ?",
            [userId, electionId],
            (err, result) => {
                if (err) {
                    resolve({ success: false, message: err.message });
                    return;
                }
                if (result.length === 0) {
                    resolve({ success: false, message: "No participation found" });
                    return;
                }
                resolve({ success: true, participation: result[0] });
            }
        );
    });
}

/**
 * Gets election information
 * @param {number} electionId - Election ID
 * @param {number} themeId - Theme ID (optional, for filtering)
 * @returns {Promise<{success: boolean, election?: object}>}
 */
export function getElectionInfo(electionId, themeId = null) {
    return new Promise((resolve) => {
        const query = themeId
            ? "SELECT * FROM elections WHERE id = ? AND theme_id = ?"
            : "SELECT * FROM elections WHERE id = ?";
        const params = themeId ? [electionId, themeId] : [electionId];

        mysql.execute(query, params, (err, result) => {
            if (err) {
                resolve({ success: false, message: err.message });
                return;
            }
            if (result.length === 0) {
                resolve({ success: false, message: "Election not found" });
                return;
            }
            resolve({ success: true, election: result[0] });
        });
    });
}

/**
 * Gets all elections for a theme
 * @param {number} themeId - Theme ID
 * @returns {Promise<{success: boolean, elections?: Array}>}
 */
export function getElectionsByTheme(themeId) {
    return new Promise((resolve) => {
        mysql.execute(
            "SELECT * FROM elections WHERE theme_id = ?",
            [themeId], (err, result) => {
                if (err) {
                    resolve({ success: false, message: err.message });
                    return;
                }
                resolve({ success: true, elections: result });
            }
        );
    });
}

/**
 * Inserts an audit log
 * @param {number} userId - User ID
 * @param {string} action - Action performed
 * @param {number} electionId - Election ID
 * @param {number} candidateId - Candidate ID (optional)
 * @returns {Promise<{success: boolean}>}
 */
export function insertAuditLog(userId, action, electionId, candidateId = null) {
    return new Promise((resolve) => {
        mysql.execute(
            "INSERT INTO audit_logs VALUES (default,?,?,?,null,default)",
            [userId, action, electionId],
            (err) => {
                if (err) {
                    resolve({ success: false, message: err.message });
                    return;
                }
                resolve({ success: true });
            }
        );
    });
}

/**
 * Updates the election status based on dates
 * @param {number} electionId - Election ID
 * @returns {Promise<{success: boolean}>}
 */
export function updateElectionStatus(electionId) {
    return new Promise((resolve) => {
        mysql.execute(
            "SELECT id, start_at, end_at, status FROM elections WHERE id = ?",
            [electionId],
            (err, result) => {
                if (err) {
                    resolve({ success: false, message: err.message });
                    return;
                }
                if (result.length === 0) {
                    resolve({ success: false, message: "Election not found" });
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
                                resolve({ success: false, message: err.message });
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
 * Checks if an election can accept candidates/votes based on status and dates
 * @param {number} electionId - Election ID
 * @param {string} action - Action type: 'candidacy' or 'vote'
 * @returns {Promise<{success: boolean, canParticipate: boolean, status: string}>}
 */
export function checkElectionEligibility(electionId, action = 'vote') {
    return new Promise(async (resolve) => {
        // Primeiro atualiza o status
        const updateResult = await updateElectionStatus(electionId);
        if (!updateResult.success) {
            resolve({ success: false, message: updateResult.error });
            return;
        }

        // Depois verifica o status atual
        const electionResult = await getElectionInfo(electionId);
        if (!electionResult.success) {
            resolve({ success: false, message: electionResult.error });
            return;
        }

        const election = electionResult.election;
        const now = new Date();
        const startAt = new Date(election.start_at);
        const endAt = new Date(election.end_at);

        let canParticipate = false;

        if (action === 'candidacy') {
            // Candidacies are allowed only during the 'active' status
            canParticipate = election.status === 'active';
        } else if (action === 'vote') {
            // Votes are allowed only during the 'ongoing' status
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
 * Validates election dates (does not allow past dates)
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export function validateElectionDates(startDate, endDate) {
    const now = new Date();
    return new Promise((resolve) => {
        if (startDate > now && startDate < endDate) {
            resolve({ success: true, message: "Validate date" });
            return;
        }
        resolve({
            success: false,
            message: "Invalid dates: start date must be in the future and before end date"
        });
    })
}

/**
 * Validates election dates if is in the same time
 * @param {number} themeId - Theme ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export function validateElectionInSameDates(themeId, startDate, endDate) {
    return new Promise((resolve) => {
        mysql.execute(
            "SELECT id FROM elections WHERE theme_id = ? AND start_at >= ? AND end_at <= ?",
            [themeId, startDate, endDate], (err, result) => {
                if (err) {
                    resolve({ success: false, message: err.message });
                    return;
                }
                if (result.length > 0) {
                    resolve({ success: false, message: "there's already election on this time" });
                    return;
                }
                resolve({ success: true, message: "there's no election on this time" });
            }
        )
    })
}