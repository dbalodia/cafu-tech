import { get as _get, isEmpty as _isEmpty, reduce as _reduce } from 'lodash';
import baseHandler from '../../../../private/base-handler';
import UsersQryBuilder from '../../dbQueryBuilder/users/index';
import AuthenticationHelpers from '../../helpers/auth';
import CustomError from '../../../../private/custom-error';
import { checkMongoInstance, enrichArrDataToObj } from '../../../../private/commonUtil';
import RolesModel from '../../models/roles';
import ModulesModel from '../../models/modules';

/**
 * Fetching Permission on the basis of role
 * @param {Object} role - role json data
 */

async function fetchPermissionsFromRole({ role }) {
    const [moduleData] = await ModulesModel.findEntities({
        qryFields: { 'functionality._id': { $in: _get(role, 'functions') } },
    });
    const moduleOnTheBasisOfRolePermissions = enrichArrDataToObj({
        data: _get(moduleData, 'functionality'), field: '_id'
    });
    const finalPermissions = _reduce(_get(role, 'functions'), (acc, val) =>
        acc.concat(_get(moduleOnTheBasisOfRolePermissions[val], 'name')), []);
    const finalResponse = { [_get(moduleData, 'name')]: finalPermissions };
    return finalResponse;
}

/**
 * 
 * @param {Object} data - email and password object for login
 */

async function userLoginHelper({ data }) {
    const [user] = await UsersQryBuilder.searchUsers({ data });
    if ((_isEmpty(user))) {
        const err = new CustomError(401, 'User Not Found');
        throw err;
    }
    const response = await AuthenticationHelpers.authentication({ user, password: _get(data, 'password') });
    if (!response) {
        const err = new CustomError(401, 'Authentication Failed');
        throw err;
    }
    const [roleData] = await RolesModel.findEntities({ qryFields: { _id: _get(user, 'entityData.roleId') } });
    const permission = await fetchPermissionsFromRole({ role: roleData });
    const token = await AuthenticationHelpers.signJWT({
        userDetail:
            { ...checkMongoInstance(user), permission, roleName: _get(roleData, 'name') }
    });
    const finalResponse = {
        email: _get(data, 'email'),
        token,
    };
    return finalResponse;
}

async function userLoginHandler(options) {
    return baseHandler(userLoginHelper, options);
}

/**
 * 
 * @param {Object} data - user data required for creation
 */

async function userCreateHelper({ data }) {
    const [existingUser] = await UsersQryBuilder.searchUsers({ data: { email: _get(data, 'email') } });
    if (!_isEmpty(existingUser)) {
        const err = new CustomError(401, 'User Already Exists');
        throw err;
    }
    const userData = await AuthenticationHelpers.mapHashPassword({ reqData: data });
    const user = await UsersQryBuilder.createUser({ data: userData });
    return user;
}

async function userCreateHandler(options) {
    return baseHandler(userCreateHelper, options);
}

export const Handlers = {
    userLoginHandler,
    userCreateHandler,
};

export default Handlers;
