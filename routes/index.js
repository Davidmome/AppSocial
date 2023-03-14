const router = require("express").Router();
const apiRoutes = require("./api/index");

router.use("/api", apiRoutes);
router.use((req, res) => res.send("Ruta no valida!"));

module.exports = router;
