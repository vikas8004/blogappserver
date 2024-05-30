import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    },
    img: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  } else {
    const salt = await bcryptjs.genSalt();
    this.password = await bcryptjs.hash(this.password, salt);
  }
});

// defining custom methods
userSchema.methods.matchPassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};
const User = mongoose.model("User", userSchema);
export default User;
