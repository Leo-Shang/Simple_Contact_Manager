var Contact = require('../models/contact');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

exports.index = function(req, res) {   
    
    async.parallel({
        contact_count: function(callback) {
            Contact.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
    }, function(err, results) {
        res.render('index', { title: 'Simple Contact Manager', error: err, data: results });
    });
};

// Display list of all Contacts.
exports.contact_list = function(req, res, next) {

    Contact.find({}, 'first_name family_name email phone note')
    .exec(function (err, list_contact) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('contact_list', { title: 'Contact List', list_contact: list_contact });
    });
      
};

// Display detail page for a specific contact.
exports.contact_detail = function(req, res, next) {
    async.parallel({
        contact: function(callback) {

            Contact.findById(req.params.id)
              .populate('first name')
              .populate('last name')
              .exec(callback);
        },
    }, function(err, results) {
        
        if (err) { return next(err); }
        if (results.contact==null) { // No results.
            
            var err = new Error('Contact not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        console.log(results.contact)
        res.render('contact_detail', { title: results.contact.first_name} );
    });

};

// Display contact create form on GET.
exports.contact_create_get = function(req, res) {
    async.parallel({
        first_name: function(callback) {
            Contact.find(callback);
        },
        family_name: function(callback) {
            Contact.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('contact_form', { title: 'Create Contact'});
    });
};


// Handle book create on POST.
exports.contact_create_post = [
    body('first_name', 'First name must not be empty.').isLength({ min: 1 }).trim(),
    body('family_name', 'Last name must not be empty.').isLength({ min: 1 }).trim(),
    body('email', 'Email must not be empty.').isLength({ min: 1 }).trim(),
    body('phone', 'Phone number must not be empty').isLength({ min: 1 }).trim(),
    body('note').trim(),
  
    // Sanitize fields (using wildcard).
    sanitizeBody('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        var contact = new Contact(
          { first_name: req.body.first_name,
            family_name: req.body.family_name,
            email: req.body.email,
            phone: req.body.phone,
            note: req.body.note
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            console.log(errors.mapped());

            async.parallel({
                first_name: function(callback) {
                    Contact.find(callback);
                },
                family_name: function(callback) {
                    Contact.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                res.render('contact_form', { title: 'Create Contact'});
            });
            return;
        }
        else {
            contact.save(function (err) {
                if (err) {
                    console.log(err); 
                    return next(err); 
                }
                   res.redirect('/contact');
                });
        }
    }
];

// Display contact delete form on GET.
exports.contact_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: contact delete GET');
};

// Handle contact delete on POST.
exports.contact_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: contact delete POST');
};

// Display contact update form on GET.
exports.contact_update_get = function(req, res, next) {
    async.parallel({
        contact: function(callback) {
            console.log(req.params.id)
            Contact.findById(req.params.id).exec(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.contact==null) { // No results.
                var err = new Error('Contact not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render('contact_form', { title: 'Update Contact', contact: results.contact });
        });
};

// Handle contact update on POST.
exports.contact_update_post = [
  
    // Validate fields.
    body('first_name', 'First name must not be empty.').isLength({ min: 1 }).trim(),
    body('family_name', 'Last name must not be empty.').isLength({ min: 1 }).trim(),
    body('email', 'Email must not be empty.').isLength({ min: 1 }).trim(),
    body('phone', 'Phone number must not be empty').isLength({ min: 1 }).trim(),
    body('note').trim(),

    // Sanitize fields.
    sanitizeBody('first_name').escape(),
    sanitizeBody('family_name').escape(),
    sanitizeBody('email').escape(),
    sanitizeBody('phone').escape(),
    sanitizeBody('note').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        var contact = new Contact(
        { first_name: req.body.first_name,
            family_name: req.body.family_name,
            email: req.body.email,
            phone: req.body.phone,
            note: req.body.note,
            _id:req.params.id //This is required, or a new ID will be assigned!
        });

        if (!errors.isEmpty()) {
            async.parallel({
                first_name: function(callback) {
                    Contact.find(callback);
                },
                family_name: function(callback) {
                    Contact.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                res.render('contact_form', { title: 'Create Contact'});
            });
            return;
        }
        else {
            Contact.findByIdAndUpdate(req.params.id, contact, {}, function (err) {
                if (err) { console.log(err); return next(err); }
                   res.redirect('/contact');
                });
        }
    }
];