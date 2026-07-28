const express = require("express");
const router = express.Router();

const {
  createDoctorNote,
  getNotesForDoctor,
  getMyDoctorNotes,
} = require("../controllers/doctorNoteController");

const {
  protect,
  requireRole,
} = require("../middleware/auth");


// Doctor creates a note for an approved patient
router.post(
  "/:patientId",
  protect,
  requireRole("doctor"),
  createDoctorNote
);


// Doctor views notes for an approved patient
router.get(
  "/patient/:patientId",
  protect,
  requireRole("doctor"),
  getNotesForDoctor
);


// Patient views notes written for them
router.get(
  "/mine",
  protect,
  requireRole("patient"),
  getMyDoctorNotes
);


module.exports = router;