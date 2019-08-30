// ---------------------------------- Generate Sequence Start ------------------------------------------//

import { get as _get, flow as _flow } from 'lodash';

const metaData = {
    Transactions: {
        sequenceStarting: 'TS_',
    },
};

const generateRandomNumber = () => Math.floor((Math.random() * 100) + (Math.random() * 10));

const generateSequence = data => `${data}${generateRandomNumber()}${new Date().getTime()}`;

const getRoleData = data => _get(metaData, data);

const getRoleParameter = data => _get(data, 'sequenceStarting');

const sequence = _flow(getRoleData, getRoleParameter, generateSequence);

const generateId = ({ role }) => sequence(role);

export default generateId;
export { generateId };
