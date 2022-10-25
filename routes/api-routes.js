let router = require('express').Router()
var recordController = require('../controller/recordController')

router.get('/', (req, res) => {
    res.json({
        status: 'API is working',
        message: 'Welcome to OTOT-B crafted by XUANQI'
    })
})

router.route('/record')
    .get(recordController.index)
    .post(recordController.create)

router.route('/record/:record_id')
    .get(recordController.read)
    .patch(recordController.update)
    .put(recordController.update)
    .delete(recordController.delete)

module.exports = router;