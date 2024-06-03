const jwt = require('jsonwebtoken');
const Utente = require('../api/user/profile/profile.model')
const moment = require('moment');

var Utils = {

	isTokenValid: function async(req, res) {
		let token = req.headers['x-access-token'] || req.headers['Authorization'] || req.headers['authorization'];
		return new Promise((resolve, reject) => {
			if (token) {
				jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
					if (err) {
						resolve(401);
					} else {
						let user = {
							status: 200,
							idUser: decoded.userId,
							role: 2, //for now is static then add dinamic [1 for backoffice, 2 for user, 3 for activity]
							token: token,
						}
						let u = await Utente.getUtenteById(decoded.userId);
						if (u.length == 0) resolve(401);
						//expiriend
						//if (moment.utc(u[0].lastEditPwd) > moment.utc(decoded.timeStampCreateToken)) resolve(401);

						//return user
						resolve(user);
					}
				});
			} else {
				resolve(404);
			}
		});
	},

	// isPwdTokenValid: function async(req, res) {
	// 	let token = req.headers['x-access-token'] || req.headers['Authorization'] || req.headers['authorization'];
	// 	return new Promise((resolve, reject) => {
	// 		if (token) {
	// 			jwt.verify(token, process.env.PWD_SECRET, async function (err, decoded) {
	// 				if (err) {
	// 					resolve(401);
	// 				} else {
	// 					let user = {
	// 						status: 200,
	// 						pwdCode: decoded.pwdCode,
	// 						token: token,
	// 						timeStampCreateToken: decoded.timeStampCreateToken,
	// 					}
	// 					resolve(user);
	// 				}
	// 			});
	// 		} else {
	// 			resolve(404);
	// 		}
	// 	});
	// },
};

module.exports = Utils;
