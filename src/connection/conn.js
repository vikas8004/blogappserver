import mongoose from "mongoose";

const connect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    if (conn) {
      return conn;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export default connect;
