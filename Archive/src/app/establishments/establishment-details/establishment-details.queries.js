const moment = require('moment');

const { mapEstablishmentDetailsTypeToEstablishmentDetailsDbRow } = require('./establishment-details.utils');

async function insert(knex, establishmentId, establishmentDetailsData) {
  const establishmentDetails = establishmentDetailsData.map((establishmentDetail) => ({
    image_id: establishmentDetail.imageId,
    establishment_id: establishmentId,
    code: establishmentDetail.code,
    description: establishmentDetail.description,
    title: establishmentDetail.title,
  }));

  const details = await knex('establishment_details').insert(establishmentDetails);

  return details;
}

async function findById(knex, id) {
  const [detail] = await knex('establishment_details')
    .select(
      'id',
    )
    .where('id', '=', id);

  if (!detail) {
    return null;
  }

  return detail;
}

async function findByEstablishmentId(knex, establishmentId) {
  const [detail] = await knex('establishment_details')
    .select(
      'id',
    )
    .where('establishment_id', '=', establishmentId);

  if (!detail) {
    return null;
  }

  return detail;
}

async function findByDetailIdAndEstablishmentId(knex, detailId, establishmentId) {
  const [detail] = await knex('establishment_details')
    .select(
      'id',
    )
    .where('id', '=', detailId)
    .andWhere('establishment_id', '=', establishmentId);

  if (!detail) {
    return null;
  }

  return detail;
}

async function findByIds(knex, establishmentIds) {
  const details = await knex('establishment_details')
    .select(
      'id',
      'code',
      'title',
      'description',
      'image_id as imageId',
      'establishment_id as establishmentId',
    )
    .whereIn('establishment_id', establishmentIds);

  return details;
}

async function findAllWithPicturesByEstablishmentId(knex, establishmentId) {
  const detailsWithPictures = await knex('establishment_details')
    .select([
      'establishment_details.id',
      'establishment_details.code',
      'establishment_details.description',
      'establishment_details.title',
      'establishment_details.establishment_id as establishmentId',
      'pictures.id',
      'pictures.url',
    ])
    .leftJoin('pictures', 'pictures.id', 'establishment_details.image_id')
    .where('establishment_id', '=', establishmentId);

  return detailsWithPictures;
}

async function findAllWithPicturesByEstablishmentIds(knex, establishmentIds) {
  const detailsWithPictures = await knex('establishment_details')
    .select([
      'establishment_details.id',
      'establishment_details.code',
      'establishment_details.description',
      'establishment_details.title',
      'establishment_details.establishment_id as establishmentId',
      'pictures.id as pictureId',
      'pictures.url',
    ])
    .leftJoin('pictures', 'pictures.id', 'establishment_details.image_id')
    .whereIn('establishment_id', establishmentIds);

  return detailsWithPictures;
}

async function update(knex, establishmentId, detailsId, updatedFields) {
  const updatedDetails = await knex('establishment_details')
    .where('id', '=', detailsId)
    .andWhere('establishment_id', '=', establishmentId)
    .update({
      ...mapEstablishmentDetailsTypeToEstablishmentDetailsDbRow(updatedFields),
      updated_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
    });

  return updatedDetails;
}

async function deleteAllDetails(knex, establishmentId) {
  return knex('establishment_details')
    .where('establishment_id', '=', establishmentId)
    .del();
}

async function deleteOneDetail(knex, detailId, establishmentId) {
  return knex('establishment_details')
    .where('id', '=', detailId)
    .andWhere('establishment_id', '=', establishmentId)
    .del();
}

module.exports = {
  insert,
  findById,
  findByIds,
  update,
  deleteAllDetails,
  deleteOneDetail,
  findByEstablishmentId,
  findByDetailIdAndEstablishmentId,
  findAllWithPicturesByEstablishmentId,
  findAllWithPicturesByEstablishmentIds,
};
