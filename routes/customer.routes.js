const express = require('express');
const router = express.Router();
const Customer = require(`../models/Customer.model`);

/* GET home page */
router.get("/", (req, res, next) => {
    Customer.find()
    .then((customers) => {
        const data = {
            customers,
        };
        res.render("customer-views/list", data);
    })
    .catch((err) => next(err));
});

router.get("/create", (req, res, next) => {
	if (!req.session.currentUser) {
		res.redirect("/auth/login");
		return;
	}

    const data = {
        locations: [
            `Port-au-Prince`,
            `Carrefour`,
            `Cité Soleil`,
            `Delmas`,
            `Gressier`,
            `Kenscoff`,
            `Pétion-Ville`,
            `Tabarre`,
            ]
    }

	res.render("customer-views/create", data);
});

// CREATE from 'CRUD'
router.post("/create", (req, res, next) => {
	if (!req.session.currentUser) {
		res.redirect("/auth/login");
		return;
	}

    console.log({body: req.body})

	const customerData = {
		owner: req.session.currentUser._id,
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        balance: req.body.balance,
        loyaltypoints: req.body.loyaltyPoints,
        whatsappnumber:req.body.whatsappNumber,
        location: req.body.location,
	};

	Customer.create(customerData)
		.then((newCustomer) => {
			// console.log({ newCustomer });

			// a redirect would have the same endopint as you would put in a link tag.
			res.redirect(`/customer/details/${newCustomer._id}`);
		})
		.catch((err) => next(err));
});


router.post("/edit/:customerId", (req, res, next) => {
	if (!req.session.currentUser) {
		res.redirect("/auth/login");
		return;
	}

    console.log({body: req.body})

	const customerData = {
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        balance: req.body.balance,
        loyaltypoints: req.body.loyaltyPoints,
        whatsappnumber:req.body.whatsappNumber,
        location: req.body.location,
	};


	Customer.findByIdAndUpdate(req.params.customerId, customerData, {new: true} )
		.then((updatedCustomer) => {
			// console.log({ newCustomer });

			// a redirect would have the same endopint as you would put in a link tag.
			res.redirect(`/customer/details/${updatedCustomer._id}`);
		})
		.catch((err) => next(err));
})

router.get("/edit/:customerId", (req, res, next) => {
    Customer.findById(req.params.customerId)
    .then(customer => {
        const data = {
            customer,
            locations: [
                `Port-au-Prince`,
                `Carrefour`,
                `Cité Soleil`,
                `Delmas`,
                `Gressier`,
                `Kenscoff`,
                `Pétion-Ville`,
                `Tabarre`,
                ]
        }

        res.render('customer-views/edit', data);
    }).catch(err => next(err));


    
})
// READ route

router.get('/details/:customerId', (req, res, next) => {
    Customer.findById(req.params.customerId)
    .then(customer => {
        res.render('customer-views/details', {customer});
    }).catch(err => next(err));
})

// UPDATE from 'CRUD'
// this route is being created to be called from a redirect from another route and should not be used in any html.
router.get("/update/add-customer/:customerId/:transactionId", (req, res, next) => {
	console.log({ updateBody: req.body, params: req.params });

	if (!req.params.customerId || !req.params.transactionId) {
		const theError = new Error("No Id was provided!");

		throw theError;
	}

	// when using findByIdAndUpdate the first argument is the id your searching for. the 2nd is the content your updating based on the model (anything passed here will override or modify existing data, make sure if the field has data that you include it when updating new data being added if needed.). The 3rd parameter ({new: true}), is just to assure that you get the updated and not previous data if you need to log it or pass it as info to a page.
	// Customer.findByIdAndUpdate(
	// 	req.params.storeId,
	// 	{ $push: { dogsForSale: req.params.dogId } },
	// 	{ new: true }
	// )
	// 	.then((updatedStore) => {
	// 		console.log({ updatedStore });

	// 		res.redirect("back");
	// 	})
	// 	.catch((err) => next(err));

	// this method works well for things like a 'Like' that you will add to or remove from elements (ie: comments, pics, vids, replies, etc.)

	Customer.findById(req.params.customerId)
		.then((foundCustomer) => {
			if (foundCustomer.activeCustomers.includes(req.params.transactionId)) {
				foundCustomer.activeCustomers.pull(req.params.transactionId);
			} else {
				foundCustomer.activeCustomers.push(req.params.transactionId);
			}
			foundCustomer
				.save()
				.then((updatedCustomer) => {
					console.log({ updatedCustomer });

					res.redirect("back");
				})
				.catch((err) => next(err));
		})
		.catch((err) => next(err));
});

// DELETE from 'CRUD'
router.post("/delete", (req, res, next) => {
	// console.log({ body: req.body });

	if (!req.body.customerId) {
		const theError = new Error("No Id was provided!");

		throw theError;
	}

	Customer.findByIdAndRemove(req.body.customerId)
		.then(() => {
			console.log({
				customerDeleted: `Customer Id ${req.body.customerId} has been removed from DB.`,
			});

			res.redirect("/customer");
		})
		.catch((err) => next(err));
});


module.exports = router;
