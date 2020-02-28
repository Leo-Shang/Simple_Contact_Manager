var express = require('express');
var router = express.Router();

// Require controller modules.
var contact_controller = require('../controllers/contactController');

/// contact ROUTES ///

// GET catalog home page.
router.get('/', contact_controller.index);


router.get('/contact_list', contact_controller.contact_list);


// GET request for creating a contact. NOTE This must come before routes that display contact (uses id).
router.get('/contact/create', contact_controller.contact_create_get);

// POST request for creating contact.
router.post('/contact/create', contact_controller.contact_create_post);

// GET request to delete contact.
router.get('/contact/:id/delete', contact_controller.contact_delete_get);

// POST request to delete contact.
router.post('/contact/:id/delete', contact_controller.contact_delete_post);

// GET request to update contact.
router.get('/:id/update', contact_controller.contact_update_get);

// POST request to update contact.
router.post('/:id/update', contact_controller.contact_update_post);

// GET request for one contact.
router.get('/:id', contact_controller.contact_detail);

// GET request for list of all contact items.
router.get('/contact', contact_controller.contact_list);


module.exports = router;