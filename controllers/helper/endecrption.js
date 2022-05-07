// let crypto = require("crypto");
// const { Buffer } = require("buffer");
// const decrypt = (encpass) => {
// 	const decipher = crypto.createDecipheriv(
// 		"aes-256-gcm",
// 		Buffer.from(process.env.ENCRYPT_KEY),
// 		Buffer.from(encpass.iv, "hex")
// 	);
// 	decipher.setAuthTag(Buffer.from(encpass.tag, "hex"));
// 	const decpass = Buffer.concat([decipher.update(Buffer.from(encpass.password, "hex")), decipher.final()]);
// 	return decpass.toString();
// };

// const encrypt = (password) => {
// 	const iv = Buffer.from(crypto.randomBytes(16));
// 	// iv : initialization vector
// 	const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(process.env.ENCRYPT_KEY), iv);
// 	const encpass = Buffer.concat([cipher.update(password), cipher.final()]);
// 	return {
// 		iv: iv.toString("hex"),
// 		password: encpass.toString("hex"),
// 		tag: cipher.getAuthTag().toString("hex"),
// 	};
// };

// module.exports = {
// 	encrypt,
// 	decrypt,
// };

const crypto = require("crypto");

class Encrypter {
	constructor(encryptionKey) {
		this.algorithm = "aes-192-cbc";
		this.key = crypto.scryptSync(encryptionKey, "salt", 24);
	}

	encrypt(clearText) {
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
		const encrypted = cipher.update(clearText, "utf8", "hex");
		return [encrypted + cipher.final("hex"), Buffer.from(iv).toString("hex")].join("|");
	}

	dencrypt(encryptedText) {
		const [encrypted, iv] = encryptedText.split("|");
		if (!iv) throw new Error("IV not found");
		const decipher = crypto.createDecipheriv(this.algorithm, this.key, Buffer.from(iv, "hex"));
		return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
	}
}

module.exports = Encrypter;
