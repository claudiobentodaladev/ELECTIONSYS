import { Router } from "express";
import { validator } from "../../middleware/validator.middleware.mjs";
import { createCandidateSchema, editCandidateSchema } from "../../validator/candidate.schema.mjs";
import { CandidateController } from "../../controllers/candidate.controller.mjs";
import { isEleitor } from "../../middleware/role.middleware.mjs";
import { isAdmin } from "../../middleware/role.middleware.mjs";
import { autoUpdateElectionStatus } from "../../middleware/autoUpdateElectionStatus.middleware.mjs";
import propose from "./propose/candidates_propose.route.mjs";

const router = Router()

// Create candidate
router.post("/:election_id", autoUpdateElectionStatus, isEleitor, createCandidateSchema, validator, CandidateController.createCandidate)

// Get candidates
router.get("/:election_id", CandidateController.getCandidates)

// Edit candidate
router.patch("/edit/:candidate_id", isEleitor, editCandidateSchema, validator, CandidateController.updateCandidate)

// Review candidate
router.patch("/:candidate_id", isAdmin, CandidateController.reviewCandidate)

// Propose routes
router.use("/proposes", propose)

export default router;