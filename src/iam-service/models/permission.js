import mongoose from 'mongoose';

const entitySchema = mongoose.Schema({
    name: { type: String },
    description: { type: String },
    isEntityActive: { type: Boolean, default: true },
});

const EntityStorage = mongoose.model('Permissions', entitySchema, 'permissions');

const createEntity = ({ data }) => EntityStorage.create(data);

const findEntities = ({ qryFields }) => EntityStorage.find(qryFields).sort({ modifiedOn: -1 });

const findOneEntity = ({ qryFields }) => EntityStorage.findOne(qryFields);

const updateOneEntity = ({ qryFields, setFields }) => EntityStorage.findOneAndUpdate(qryFields, setFields, { new: true });

const updateEntities = ({ qryFields, setFields }) => EntityStorage.updateMany(qryFields, setFields);

export const Models = {
    EntityStorage,
    createEntity,
    findEntities,
    findOneEntity,
    updateOneEntity,
    updateEntities,
};
export default Models;