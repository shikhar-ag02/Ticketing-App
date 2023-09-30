import mongoose, { mongo } from "mongoose";
import { Password } from "../services/password";
// This interface describes the properties requirements while creating a new user
interface userAttributes {
  email: string;
  password: string;
}

//This interface describes the properties that user model has(describes methods associated with User model)
interface UserModel extends mongoose.Model<UserDoc> {
  build(attribites: userAttributes): UserDoc;
}

//This interface describes what property a single user has( a User document)
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//instance methods
//pre-save hashing of password
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
});
//the statics method lets to put the function buildUser on User model itself instead of defining it explicitly and exporting it separately. But for this we need to tell TypeScript about the properties that UserModel will have. So we use an interface for this
userSchema.statics.build = (attribites: userAttributes) => {
  return new User(attribites);
};
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

//whenever a model is created, instead of using new User(), we will use new buildUser(). This forces the interface on to the model
// const buildUser = (attributes: userAttributes) => {
//   return new User(attributes);
// };

export { User };
