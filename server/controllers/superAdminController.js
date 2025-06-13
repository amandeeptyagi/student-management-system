import SuperAdmin from "../models/SuperAdminModel.js";
import generateToken from "../utils/generateToken.js";
import Admin from "../models/AdminModel.js";
import Config from "../models/ConfigModel.js";



//for view own profile
export const viewOwnProfile = async (req, res) => {
  try {
    res.status(200).json(req.user); // req.user is already loaded by middleware
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

//for update own profile
export const updateOwnProfile = async (req, res) => {
  try {
    const superadmin = await SuperAdmin.findById(req.user._id);
    if (!superadmin) {
      return res.status(404).json({ message: "Super Admin not found" });
    }

    const { name, email, mobile } = req.body;

    if (name) superadmin.name = name;
    if (email) superadmin.email = email;
    if (mobile) superadmin.mobile = mobile;
    // {
    //   const salt = await bcrypt.genSalt(10);
    //   superadmin.password = await bcrypt.hash(password, salt);
    // }

    const updated = await superadmin.save();
    res.status(200).json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      mobile: updated.mobile,
      role: updated.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed" });
  }
};

//update password
export const updatePassword = async (req, res) => {
  try {
    const superAdmin = await SuperAdmin.findById(req.user._id);
    if (!superAdmin) {
      return res.status(404).json({ message: "Super Admin not found" })
    }
    const { oldPassword, newPassword } = req.body;

    //check old password is correct
    if (oldPassword !== superAdmin.password) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    //save new password
    superAdmin.password = newPassword;
    await superAdmin.save();

    res.status(200).json({ message: "Password updated successfully" })

  } catch (error) {

  }
}

//delete own profile
export const deleteOwnProfile = async (req, res) => {
  try {
    await SuperAdmin.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: "Super Admin account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete account" });
  }
};

// create new admin
export const createAdmin = async (req, res) => {
  try {
    const { name, email, mobile, password, instituteName, address } = req.body;

    const userExists = await Admin.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const user = new Admin({
      name,
      email,
      mobile,
      password,
      instituteName,
      address,
      role: "admin",
    });

    const saved = await user.save();
    // generateToken(res, saved._id, saved.role, null);

    res.status(201).json({ _id: saved._id, name: saved.name, email: saved.email, mobile: saved.mobile, instituteName: saved.instituteName, address: saved.address, role: saved.role });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};

// Update admin
export const updateAdmin = async (req, res) => {
  const { name, email, mobile, password, instituteName, address } = req.body;

  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.mobile = mobile || admin.mobile;
    admin.password = password || admin.password;
    admin.instituteName = instituteName || admin.instituteName;
    admin.address = address || admin.address;

    const updated = await admin.save();
    res.status(201).json({ _id: updated._id, name: updated.name, email: updated.email, mobile: updated.mobile, instituteName: updated.instituteName, address: updated.address, role: updated.role });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};

//delete admin
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
};

// export const updateSystemSettings = async (req, res) => {
//   const { allowAdminRegistration, allowLogin } = req.body;

//   try {
//     let config = await Config.findOne();
//     if (!config) config = new Config();

//     config.allowAdminRegistration = allowAdminRegistration ?? config.allowAdminRegistration;
//     config.allowLogin = allowLogin ?? config.allowLogin;

//     await config.save();
//     res.json({ message: "Settings updated", config });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update settings", error });
//   }
// };


// Toggle admin registration on/off
export const toggleRegistration = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) config = new Config();

    config.allowAdminRegistration = !config.allowAdminRegistration;
    await config.save();

    res.json({
      message: `Admin registration is now ${config.allowAdminRegistration ? "enabled" : "disabled"}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle registration", error });
  }
};

// Toggle login access on/off
export const toggleLogin = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) config = new Config();

    config.allowLogin = !config.allowLogin;
    await config.save();

    res.json({
      message: `Login is now ${config.allowLogin ? "enabled" : "disabled"}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle login", error });
  }
};



// Register Super Admin (one-time use or controlled)
export const registerSuperAdmin = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if any Super Admin already exists
    const existingSuperAdmin = await SuperAdmin.findOne({ role: "superadmin" });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: "Super Admin already exists" });
    }

    // Check if email is already used
    const existingEmail = await SuperAdmin.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const newSuperAdmin = new SuperAdmin({
      name,
      email,
      mobile,
      password: password,
      role: "superadmin",
    });

    const saved = await newSuperAdmin.save();

    // Optionally generate a token
    generateToken(res, saved._id, saved.role, null);

    res.status(201).json({
      _id: saved._id,
      name: saved.name,
      email: saved.email,
      mobile: saved.mobile,
      role: saved.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to register Super Admin", error });
  }
};

