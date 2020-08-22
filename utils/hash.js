const bcrypt = require(bcryptjs);

const clef = KEY_ENV; // a voir comment l'importer içi.

exports.encrypt = password => {
    ...
    return passwordHashed;
}

exports.decrypt = hash => {
    ...
    return decrypted;
}