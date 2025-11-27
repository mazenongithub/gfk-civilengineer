db.timesheets.insertOne({
  projectid: "534",
  labor: [
    {
      engineerid: "mazen",
      laborid: "lab001",
      timein: new Date(2025, 10, 27, 8, 0, 0),   // Nov 27, 2025 8:00 AM
      timeout: new Date(2025, 10, 27, 16, 30, 0), // Nov 27, 2025 4:30 PM
      laborrate: "150.00",
      description: "Field compaction testing"
    },
    {
      engineerid: "mazen",
      laborid: "lab002",
      timein: new Date(2025, 10, 28, 7, 30, 0),   // Nov 28, 2025 7:30 AM
      timeout: new Date(2025, 10, 28, 15, 0, 0),  // Nov 28, 2025 3:00 PM
      laborrate: "120.00",
      description: "Laboratory soil classification"
    }
  ],

  costs: [
    {
      costid: "cost001",
      datein: new Date(2025, 10, 26), // Nov 26, 2025 (midnight local)
      unitcost: "45.00",
      unit: "Per Test",
      quantity: "3",
      description: "Nuclear gauge usage"
    },
    {
      costid: "cost002",
      datein: new Date(2025, 10, 27), // Nov 27, 2025
      unitcost: "0.65",
      unit: "Per Mile",
      quantity: "42",
      description: "Mileage to project site"
    }
  ],

  invoices: [
    {
      invoiceid: "inv001",
      dateinvoice: new Date(2025, 10, 30), // Nov 30, 2025
      labor: ["lab001", "lab002"],
      costs: ["cost001"]
    },
    {
      invoiceid: "inv002",
      dateinvoice: new Date(2025, 11, 5), // Dec 5, 2025
      labor: [],
      costs: ["cost002"]
    }
  ]
});
