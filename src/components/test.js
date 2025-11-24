  app.post('/:gfk/savecompactioncurves', checkSessionGFK, async (req, res) => {
    try {
      const gfk = new GFK();
      const { projectid, compactioncurves } = req.body;
      const myCompactionCurves = { projectid, compactioncurves }

      const updatedCompactionCurves = await gfk.saveCompactionCurves(myCompactionCurves);
      const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });

      return res.status(200).json({
        message: `CompactionCurves Saved Successfully - ${timestamp}`,
        compactioncurves: {
          projectid,
          compactioncurves: updatedCompactionCurves
        }
      });

    } catch (err) {
      console.error("Error saving compactioncurves:", err);
      return res.status(500).json({
        message: `Error saving compactioncurves: ${err.message}`
      });
    }
  });