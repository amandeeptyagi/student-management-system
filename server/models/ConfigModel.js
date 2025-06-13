import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  allowAdminRegistration: { type: Boolean, default: true },
  allowLogin: { type: Boolean, default: true }
});

const Config = mongoose.model("Config", configSchema);
export default Config;
