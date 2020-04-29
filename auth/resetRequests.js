const requests = [];
const DataBaseModel = require('../models/models')

function createResetRequest(resetRequest) {
    const email = resetRequest.email;
    const reset_id = resetRequest.id;
    DataBaseModel.reset.create({
        email,
        reset_id
    })
        .then(dataCreated => {

            }
        )
        .catch(error=>{

        })

}

function getResetRequest(id) {
    const thisRequest = requests.find(req => req.id === id);
    return thisRequest;
}

module.exports = {
    createResetRequest,
    getResetRequest,
}
