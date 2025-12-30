const Contact = require("../models/contact");
const asyncHandler = require("../utils/asyncHandler");

exports.getContacts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Contact.countDocuments();

    res.json({
        data: contacts,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
});

exports.createContact = asyncHandler(async (req, res) => {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
});

exports.deleteContact = asyncHandler(async (req, res) => {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
        return res.status(404).json({ message: "Contact not found" });
    }
    res.status(204).end();
});
