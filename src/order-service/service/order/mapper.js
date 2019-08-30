import { get as _get } from 'lodash';
import { cleanEntityData, mapCreatedByFields, flattenObject } from '../../../../private/commonUtil';

const mapMessageData = ({ data }) => cleanEntityData({
    message: _get(data, 'message'),
});

const mapMessageCreation = ({ data, tokenPayload }) => cleanEntityData({
    ...mapCreatedByFields({
        data: {
            entityData: mapMessageData({ data }),
        },
        tokenPayload,
    }),
});

const qryMapperForMessage = ({ reqData }) => flattenObject(cleanEntityData({
    _id: _get(reqData, 'ids'),
    isEntityActive: _get(reqData, 'isEntityActive', true),
    name: _get(reqData, 'name'),
    createdBy: _get(reqData, 'createdBy'),
    modifiedBy: _get(reqData, 'modifiedBy'),
    entityData: mapMessageData({ data: reqData }),
}));

export const Mappers = {
    mapMessageData,
    qryMapperForMessage,
    mapMessageCreation,
};

export default Mappers;
