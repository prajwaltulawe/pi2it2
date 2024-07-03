const express = require("express");
const Pattern = require("../models/Pattern");
const Class = require("../models/Class");
const Semester = require("../models/Semester");
const Subject = require("../models/Subject");
const Practicle = require("../models/Practicle");
const { body, validationResult } = require("express-validator");

const router = express.Router();
const fetchUser = require("../middleware/fetchUser");

// ADD PATTERN IN PATTERN USING GET "/API/ADDPATTERN"
router.post("/addPattern", 
  async (req, res) => {
    try {
      const year = req.body.year;
      if (!year) {
        return res.status(400).json({ error: "Year not mentioned" });
      }
      const pattern = new Pattern({
        year
      });
      const savePattern = await pattern.save();
      res.json(savePattern);
    } catch (error) {
        res.status(500).send("Some Error Occoured");
    }
  }
);

// ADD CLASS IN CLASS USING GET "/API/ADDCLASS"
router.post("/addClass", 
  async (req, res) => {
    try {
      const classs = new Class({
        class: req.body.class,
        pattern_id: req.body.patternId,
        classDescription: req.body.classDescription
      });
      const saveClass = await classs.save();
      res.json(saveClass);
    } catch (error) {
        res.status(500).send("Some Error Occoured");
    }
  }
);

// ADD SEMESTER IN SEMESTER USING GET "/API/ADDSEMESTER"
router.post("/addSemester", 
  async (req, res) => {
    try {
      const semester = new Semester({
        pattern_id: req.body.patternId,
        class_id: req.body.classId,
        semester: req.body.semester
      });
      const saveSemester = await semester.save();
      res.json(saveSemester);
    } catch (error) {
        res.status(500).send("Some Error Occoured");
    }
  }
);

// ADD SUBJECT IN SUBJECT USING GET "/API/ADDSUBJECT"
router.post("/addSubject", 
  async (req, res) => {
    try {
      const subject = new Subject({
        pattern_id: req.body.patternId,
        class_id: req.body.classId,
        semester_id: req.body.semId,
        subject: req.body.subject
      });
      const saveSubject = await subject.save();
      res.json(saveSubject);
    } catch (error) {
        res.status(500).send("Some Error Occoured");
    }
  }
);

// ADD PRACTICLE IN PRACTICLES USING GET "/API/ADDPRACTICLE"
router.post("/addPracticle", 
  async (req, res) => {
    try {
      const practicle = new Practicle({
        pattern_id: req.body.patternId,
        class_id: req.body.classId,
        semester_id: req.body.semId,
        subject_id: req.body.subjectId,
        practicle: req.body.practicle
      });
      const savePracticle = await practicle.save();
      res.json(savePracticle);
    } catch (error) {
        res.status(500).send("Some Error Occoured");
    }
  }
);

module.exports = router;