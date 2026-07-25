const DoctorNote = require("../models/DoctorNote");
const AccessRequest = require("../models/AccessRequest");
const User = require("../models/User");

// POST /api/doctor-notes/:patientId
// Doctor creates a note for an approved patient
async function createDoctorNote(req, res) {
  try {
    const { patientId } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const approved = await AccessRequest.findOne({
      patientId,
      doctorId: req.user.id,
      requestStatus: "approved",
    });

    if (!approved) {
      return res.status(403).json({
        message: "You do not have access to this patient",
      });
    }

    const note = await DoctorNote.create({
      doctorId: req.user.id,
      patientId,
      title,
      content,
    });

    const populatedNote = await DoctorNote.findById(note._id)
      .populate("doctorId", "name email");

    res.status(201).json({
      message: "Doctor note created successfully",
      note: populatedNote,
    });
  } catch (err) {
    console.error("CREATE DOCTOR NOTE ERROR:", err);

    res.status(500).json({
      message: "Failed to create doctor note",
      error: err.message,
    });
  }
}


// GET /api/doctor-notes/patient/:patientId
// Doctor views notes for an approved patient
async function getNotesForDoctor(req, res) {
  try {
    const { patientId } = req.params;

    const approved = await AccessRequest.findOne({
      patientId,
      doctorId: req.user.id,
      requestStatus: "approved",
    });

    if (!approved) {
      return res.status(403).json({
        message: "You do not have access to this patient",
      });
    }

    const notes = await DoctorNote.find({
      patientId,
    })
      .populate("doctorId", "name email")
      .sort({ createdAt: -1 });

    res.json({ notes });
  } catch (err) {
    console.error("GET DOCTOR NOTES ERROR:", err);

    res.status(500).json({
      message: "Failed to load doctor notes",
      error: err.message,
    });
  }
}


// GET /api/doctor-notes/mine
// Patient views notes written for them
async function getMyDoctorNotes(req, res) {
  try {
    const notes = await DoctorNote.find({
      patientId: req.user.id,
    })
      .populate("doctorId", "name email")
      .sort({ createdAt: -1 });

    res.json({ notes });
  } catch (err) {
    console.error("GET MY DOCTOR NOTES ERROR:", err);

    res.status(500).json({
      message: "Failed to load doctor notes",
      error: err.message,
    });
  }
}


module.exports = {
  createDoctorNote,
  getNotesForDoctor,
  getMyDoctorNotes,
};