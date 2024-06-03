const { Router } = require('express');
const Utils = require("../../../common/checkToken");
const Profile = require('./profile.model.js')
const router = Router();
const cors = require('cors');
router.use(cors());

router.post('/user/profile/delete', async (request, response) => {
	//token autenticato
	let valid = await Utils.isTokenValid(request);

	if (valid.role == 1) return response.status(401).send("token non valido");

	request.idUtente = valid.idUser;
	//non mi interessa il controllo token
	switch (valid) {
		case 4013:
			return response.status(401).send("token non valido");

		case 4043:
			return response.status(404).send("token non trovato");
		default:
			Profile.deleteUtente(request.idUtente);
	}

	response.send({ 'msg': "UserDeleted" })
});


router.get("/city", async (request, response) => {
	const city = {
		"city": [
			{ "nome": "Desenzano del Garda", coord: { lat: 45.471453, lng: 10.533335 }, isCoomingSoon: 0 },
			{ "nome": "Valeggio sul Mincio", coord: { lat: 45.354692, lng: 10.734379 }, isCoomingSoon: 1 },
		],
	}

	response.status(200).send(city);

});
module.exports = router;
