import { get as _get } from 'lodash';
import { flattenObject, cleanEntityData } from '../../../../private/commonUtil';

const mapReqDataForUsers = ({ data }) => cleanEntityData({
    _id: _get(data, 'id'),
    email: _get(data, 'email'),
    firstName: _get(data, 'firstName'),
    lastName: _get(data, 'lastName'),
    roleId: _get(data, 'roleId'),
});

const mapReqDataForUserCreation = ({ data }) => cleanEntityData({
    ...mapReqDataForUsers({ data }),
    password: _get(data, 'password'),

})
const qryMapperForUsers = ({ data }) => flattenObject(cleanEntityData({
    _id: _get(data, 'ids'),
    isEntityActive: _get(data, 'isEntityActive', true),
    name: _get(data, 'name'),
    createdBy: _get(data, 'createdBy'),
    modifiedBy: _get(data, 'modifiedBy'),
    entityData: mapReqDataForUsers({ data }),
}));

export const Mappers = {
    mapReqDataForUserCreation,
    qryMapperForUsers,
};

export default Mappers;
