const { Schema, model } = require("mongoose");

const DocumentSchema = new Schema(
  {
    _id: String,
    title: { type: String, default: "Untitled Document" }, // Add title field
    data: Object,
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

module.exports = model("Document", DocumentSchema);
