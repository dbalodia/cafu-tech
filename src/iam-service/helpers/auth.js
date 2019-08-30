import { get as _get, set as _set } from 'lodash';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as appSettings from '../../message-service/vars/appSettings';

const hashPassword = ({ password }) => new Promise((resolve, reject) => {
    bcrypt.hash(password, 8, (err, hash) => {
        if (err) {
            return reject(err);
        }
        return resolve(hash);
    });
});

const mapHashPassword = ({ reqData }) =>
    new Promise(((resolve, reject) => {
        bcrypt.hash(_get(reqData, 'password'), 8, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                _set(reqData, 'password', hash);
                resolve(reqData);
            }
        });
    }));

const authentication = ({ user, password }) => {
    let err;
    return new Promise(((resolve, reject) => {
        bcrypt.compare(password, _get(user, 'entityData.password'), (error, result) => {
            if (error) {
                err = {
                    statusCode: 401,
                    message: 'Username or Password Incorrect',
                };
                reject(err);
            } else {
                resolve(result);
            }
        });
    }));
};

const signJWT = ({ userDetail }) => new Promise((resolve, reject) => {
    const prvKey = _get(appSettings, 'privateKey');
    jwt.sign(
        {
            userId: _get(userDetail, '_id'),
            email: _get(userDetail, 'entityData.email'),
            userName: `${_get(userDetail, 'entityData.firstName')} ${_get(userDetail, 'entityData.lastName')}`,
            roleId: _get(userDetail, 'entityData.roleId'),
            roleName: _get(userDetail, 'roleName'),
            permission: _get(userDetail, 'permission'),
        },
        prvKey,
        { algorithm: 'RS256', expiresIn: _get(appSettings, 'tokenExpirationTime') },
        (error, token) => {
            if (error) {
                reject(error);
            } resolve(token);
        },
    );
});

export const Authentication = {
    mapHashPassword,
    authentication,
    signJWT,
    hashPassword,
};

export default Authentication;

