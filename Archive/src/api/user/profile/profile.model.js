var db = require("../../../common/db_config");

let Profile = {

    deleteUtente: async function (idUtente) {
    return new Promise(function (resolve, reject) {
        db.query("UPDATE `users` SET `enabled` = '0' WHERE `id` = ? ", [idUtente], function (err, result) {
            if (err) {
                return reject(err);
            }
            resolve(result);
            })
        })
    },



    getUtenteById: async function(idutente){
        return new Promise(function (resolve, reject){
            db.query("SELECT * FROM users where id = ?;", [idutente], function (err, result){
                if(err){
                    return reject(err);
                }
                resolve(result);
            })

        })
    },

    // getUtente: async function(email){
    //     return new Promise(function (resolve, reject){
    //         db.query("SELECT * FROM utenti where email = ?;", [email], function (err, result){
    //             if(err){
    //                 return reject(err);
    //             }
    //             resolve(result);
    //         })

    //     })
    // },

    // addUtente: async function(user){
    //     return new Promise(function (resolve, reject){
    //         db.query("INSERT INTO utenti SET ?;", [user], function (err, result){
    //             if(err){
    //                 return reject(err);
    //             }
    //             resolve(result);
    //         })

    //     })
    // },

    // listEventiUtente: async function(idutente){
    //     return new Promise(function (resolve, reject){
    //         db.query("SELECT eventi.*, richieste.reqStatus FROM eventi, richieste WHERE richieste.idutente = ? and richieste.idEvento = eventi.idEvento and richieste.disable = 0 and eventi.disable = 0", [idutente], function (err,result){
    //             if(err){
    //                 return reject(err);
    //             }
    //             resolve(result);
    //         })
    //     })
    // },

    // attendEvento: async function(evento){
    //     return new Promise(function (resolve, reject){
    //         db.query("INSERT INTO richieste SET ?;", [evento], function (err, result){
    //             if(err){
    //                 return reject(err);
    //             }
    //             resolve(result);
    //         })

    //     })
    // },

    // listEventi: async function(){
    //     return new Promise(function (resolve, reject){
    //         db.query("SELECT eventi.* FROM eventi WHERE status=1 and disable = 0", [], function (err,result){
    //             if(err){
    //                 return reject(err);
    //             }
    //             resolve(result);
    //         })
    //     })
    // },

    // infoEvento: async function(id){
    //     return new Promise(function (resolve, reject){
    //         db.query("SELECT eventi.* FROM eventi WHERE idEvento = ?", [id], function (err,result){
    //             if(err){
    //                 return reject(err);
    //             }
    //             resolve(result);
    //         })
    //     })
    // },

    // insertPwdcode: async function(idutente, pwdCode){
    //     return new Promise(function (resolve, reject){
    //         db.query("UPDATE utenti SET pwdCode = ? WHERE idUtente = ?;", [pwdCode, idutente], function (err, result){
    //             if(err){
    //                 return reject(err);
    //             }
    //             resolve(result);
    //         })

    //     })
    // },

    // editUtente: async function (campi, id) {
	// 	return new Promise(function (resolve, reject) {
	// 		db.query("UPDATE utenti SET ? WHERE idutente = ? AND role = 0 AND disable = 0;", [campi, id], function (err, result) {
	// 			if (err) {
	// 				return reject(err);
	// 			}
	// 			resolve(result);
	// 		})
	// 	})
	// },

    // getUtenteByPwdCode: async function (pwdCode) {
	// 	return new Promise(function (resolve, reject) {
	// 		db.query("SELECT * FROM utenti WHERE pwdCode = ?;", [pwdCode], function (err, result) {
	// 			if (err) {
	// 				return reject(err);
	// 			}
	// 			resolve(result);
	// 		})

	// 	})
	// }

}

module.exports = Profile;