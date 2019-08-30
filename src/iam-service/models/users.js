import mongoose from 'mongoose';

const entitySchema = mongoose.Schema({
    isEntityActive: { type: Boolean, default: true },
    createdBy: { id: String, name: String },
    modifiedBy: { id: String, name: String },
    createdOn: { type: Date, default: new Date() },
    modifiedOn: { type: Date, default: new Date() },
    entityData: {
        email: {
            type: String,
            required: true,
            match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        },
        password: { type: String },
        firstName: { type: String, required: true },
        lastName: { type: String },
        roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'roles', required: true },
        lastLoginOn: { type: Date },
    },
});

const EntityStorage = mongoose.model('Users', entitySchema, 'users');

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