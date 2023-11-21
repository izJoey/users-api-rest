// import crypto from 'crypto';

// const SECRET = 'JOEY-REST-API';

// export const random = () => crypto.randomBytes(128).toString('base64');
// export const authentication = (salt, password) => {
//     return crypto.createHmac('sha256', SECRET).update([salt, password].join('/')).digest('hex');
// };

import crypto from 'crypto';

const SECRET = 'JOEY-REST-API';

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt, password) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};
