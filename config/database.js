import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const databaseURL = process.env.DATABASE_URL;

const connectToDb = async () => {
  try {
    const { connection } = await mongoose.connect(databaseURL);
    if (connection) {
      console.log(`Connected To DB: ${connection.host}`);
    }
  } catch (error) {
    console.log(error, "Error in DB Connection");
    process.exit(1);
  }
};

export default connectToDb;
