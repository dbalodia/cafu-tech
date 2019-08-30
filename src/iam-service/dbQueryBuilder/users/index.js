import { convertKeysToArrQry } from '../../../../private/commonUtil';
import UsersMappers from '../../service/iam/mapper';
import UsersModel from '../../models/users';

/**
 *
 * @param {Object} data - data required for seaching
 */

async function searchUsers({ data }) {
    const { $set: notationalQry } = UsersMappers.qryMapperForUsers({ data });
    const qryFields = convertKeysToArrQry({ data: notationalQry })
    const usersData = await UsersModel.findEntities({ qryFields });
    return usersData;
}

/**
 *
 * @param {Object} data - data required for saving into the database
 */
async function createUser({ data }) {
    const mappedUser = { entityData: UsersMappers.mapReqDataForUserCreation({ data }) };
    const user = await UsersModel.createEntity({ data:mappedUser });
    return user;
}

export const DbQueryBuilder = {
    searchUsers,
    createUser,
};
export default DbQueryBuilder;
