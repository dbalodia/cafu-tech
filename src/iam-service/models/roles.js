import mongoose from 'mongoose';

const entitySchema = mongoose.Schema({
    isEntityActive: { type: Boolean, default: true },
    createdBy: { id: String, name: String },
    modifiedBy: { id: String, name: String },
    createdOn: { type: Date, default: new Date() },
    modifiedOn: { type: Date, default: new Date() },
    name: { type: String, required: true },
    description: { type: String },
    functions: [{ type: mongoose.Schema.Types.ObjectId }],
});

const EntityStorage = mongoose.model('Roles', entitySchema, 'roles');

const createEntity = ({ data }) => EntityStorage.create(data);

const findEntities = ({ qryFields }) => EntityStorage.find(qryFields).sort({ modifiedOn: -1 });

const findOneEntity = ({ qryFields }) => EntityStorage.findOne(qryFields);

const updateOneEntity = ({ qryFields, setFields }) => EntityStorage.findOneAndUpdate(qryFields, setFields, { new: true });

const updateEntities = ({ qryFields, setFields }) => EntityStorage.updateMany(qryFields, setFields);

export const Models = {
    createEntity,
    findEntities,
    findOneEntity,
    updateOneEntity,
    updateEntities,
};
export default Models;