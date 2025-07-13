const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g. candle, flower, frame
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  src: { type: String }, // image URL or asset
  label: { type: String },
});

const AltarSchema = new mongoose.Schema({
  items: [ItemSchema],
  background: { type: String }, // background image or color
  userImage: { type: String }, // uploaded user photo
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Altar', AltarSchema);
