import mongoose from "mongoose";
import { Password } from "../services/password";

interface UserAttrs {
	email: string;
	password: string;
}

interface UserDoc extends mongoose.Document {
	email: string;
	password?: string;
	createdAt: string;
	updatedAt: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
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

userSchema.set("toJSON", {
	transform: (doc, ret: any) => {
		ret.id = ret._id;
		delete ret._id;
		delete ret.__v;
		delete ret.password;
	},
});
userSchema.pre("save", async function (done) {
	if (this.isModified("password")) {
		const hashedPassword = await Password.toHash(this.get("password"));
		this.set("password", hashedPassword);
	}

	done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
