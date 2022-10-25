Record = require('../model/recordModel')

exports.index = function (req, res) {
    Record.get(function (err, records) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            })
        } else {
            res.json({
                status: "success",
                message: "Borrow records retrieved successfully",
                data: records
            })
        }
    })
}

// TODO: add function to check input validity
exports.create = function (req, res) {
    var record = new Record({
        title: req.body.title,
        author: req.body.author,
        borrower: req.body.borrower,
        contact_number: req.body.contact_number
    })
    record.save(function (err) {
        if (err) {
            res.json(err)
        } else {
            res.json({
                message: 'New record created!',
                data: record
            })
        }
    })
};

exports.read = function (req, res) {
    Record.findById(req.params.record_id, function (err, record) {
        if (err)
            res.send(err);
        res.json({
            message: 'Record loading..',
            data: record
        })
    })
}

exports.update = function (req, res) {
    Record.findById(req.params.record_id, function (err, record) {
        if (err)
            res.send(err);

        record.title = req.body.title,
        record.author = req.body.author,
        record.borrower = req.body.borrower
        record.contact_number = req.body.contact_number

        record.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Record Info updated',
                data: record
            });
        });
    });
};
// Handle delete contact
exports.delete = function (req, res) {
    Record.remove({ _id: req.params.record_id }, function (err, record) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'Record deleted'
        });
    });
};