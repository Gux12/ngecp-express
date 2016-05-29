var express = require('express');
var router = express.Router();


router.get('/:name', function (req, res, next) {
  var fileName = req.params.name;
  res.render('/3Dmodels/' + fileName + '/index.html', function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });

})

module.exports = router;