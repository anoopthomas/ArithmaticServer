var mongodb = require('mongodb');
var BASE_URL = "mongodb://anoop:testpass@oceanic.mongohq.com:10057/operations";

/**
 *Function to calculate the result of an operation 
 * 
 * @param {Object} req
 * @param {Object} res
 */
function getResult(req, res) {
	// Assumes that three fields operand1, operand2 and operation are obtained from the request
	if (!req.body.operand1 || !req.body.operand2 || !req.body.operation) {
		res.status(400).send({error: 'Invalid input. Missing operand1 or operand2.'});
		return;
	}
	mongodb.Db.connect(BASE_URL, function(connect_error,client) {
		if (connect_error) logError(res, connect_error);
		client.collection('operations', function(collection_error, collection ){
			if(collection_error) logError(res, collection_error);
			
				// Performing arithmetic operation to get the result
				var result;
				var oprnd1 = req.body.operand1;
				var oprnd2 = req.body.operand2;
				switch(req.body.operation){
					case 'a':
						result = oprnd1 + oprnd2;
						break;
					case 's':
						result = oprnd1-oprnd2;
						break;
					case 'm':
						result = oprnd1*oprnd2;
						break;
					case 'd':
						result = oprnd1/oprnd2;
						break;
				}
				// saving all the parameters
				collection.save({operand1: oprnd1, operation: req.body.operation, operand2: oprnd2, result:result}, function(save_error, resultSave) {
				if (save_error) {
					logError(res, save_error);
				} else {
					// sending the result calculated
					res.status(201).send(result);
				}
			});
		});
	});
}

function logError(res, err) {
	res.status(500).send({error: 'Unexpected Error: ' + err});
	throw err;
}

function getObjectID (res, id_str) {
	try {
		var id = new mongodb.ObjectID(id_str);
		return id;
	}
	catch (err) {
		res.status(400).send({error: 'Invalid ID'});
		throw err;
	}
}
