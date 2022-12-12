const express = require("express");
const { execSMTP } = require("../services/batch");
const router = express.Router();
const Isemail = require("isemail");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { initPage: true });
});

router.post("/check-mail", async (req, res, next) => {
  const mails = req.body.emails;
  if (!mails) {
    return res.render("index", { initPage: true });
  }
  const mailList = mails
    .split(/[\,\n]/)
    .map((sm) => sm.trim())
    .filter((sf) => sf && Isemail.validate(sf));

  if (!mailList.length) {
    return res.render("index", { initPage: true });
  }
  const gmailChecker = await mailList.map(async (mail) => {
    const isExist = await execSMTP(mail);
    return {
      mail,
      isExist,
    };
  });
  const checkers = await Promise.all(gmailChecker);
  res.render("index", { initPage: false, listMail: checkers });
});

module.exports = router;
