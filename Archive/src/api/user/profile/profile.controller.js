const Profile = require("./profile.model");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");



module.exports = {
	async deleteUser(req, res){
		try{
			let resEventi = await Utente.listEventi();
			return res.status(200).json({ listEventi: resEventi });

		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: "errore interno" })
		}
	},

	async logIn(req, res) {
		try {
            let {email, password} = req.body;
			if (!email || !password) return res.status(403).json({ msg: "campi non validi" });
			if(typeof password != "string")
			{
				password = password.toString();
			}

			let result = await Utente.getUtente(email);
			if (result.length == 0) return res.status(404).json({ msg: "campi errati" });

			let controllo = auth.comparePassword(password, result[0].pwd);
			if (!controllo) return res.status(401).json({ msg: "campi errati" });

			const payload = {
				idUser: result[0].idUtente,
				lastEditPwd: result[0].lastEditPwd,
				timeStampCreateToken: moment().format("YYYY-MM-DD HH:mm:ss"),
				role: result[0].role,
			};
			const token = jwt.sign(payload, process.env.SECRET, {
				expiresIn: "72000000h",
			});

			res.status(200).json({
				msg: "LogIn effettuato",
				idUtente: result[0].idUtente,
				token: token
			});
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: "errore interno" });
		}
	},

	async listEventi(req, res){
		try{
			let resEventi = await Utente.listEventi();
			return res.status(200).json({ listEventi: resEventi });

		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: "errore interno" })
		}
	},

	async recuperoPwd(req, res){
		try{
			let { email } = req.body;
			if (!email) return res.status(401).json({ msg: "Campi non validi" });
			let result = await Utente.getUtente(email);
			if (result.length == 0) return res.status(200).json({ msg: "Utente non trovato" });

			let pwdCode = uuidv4();
			await Utente.insertPwdcode(result[0].idUtente, pwdCode);

			const payload = {
				pwdCode: pwdCode,
				timeStampCreateToken: moment().format("YYYY-MM-DD HH:mm:ss"),
			};
			const token = jwt.sign(payload, process.env.PWD_SECRET, {
				expiresIn: "24h",
			});

			await mailer.send(token, result[0]);
			res.status(200).json({ token: token });

		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: "errore interno" })
		}
	},


	async checkToken(req, res) {
		try {
			let utente = await Utente.getUtenteById(req.idUtente);
			if (utente.length == 0) return res.status(404).json({ msg: "utente non trovato" });

			return res.status(200).json({ msg: "token valido" , check: true});
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: "errore interno" })
		}
	},
}