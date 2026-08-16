await MyProjects.updateOne(
    {
        "projects.projectid": 'gfk_33f23caf-3c33-4b31-91b9-143e75e84798',
        "projects.schedule.invoices.invoiceid": '3CEQMX469OWDGNRQ'
    },
    {
        $set: {
            "projects.$[project].schedule.invoices.$[invoice].transactionid": null,
            "projects.$[project].schedule.invoices.$[invoice].paymentstatus": "Unpaid"
        }
    },
    {
        arrayFilters: [
            { "project.projectid": projectid },
            { "invoice.invoiceid": invoiceid }
        ]
    }
);