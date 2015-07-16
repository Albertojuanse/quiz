var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

router.get('/quizes/question', quizController.question);
router.get('/quizes/answer',   quizController.answer);

//en branch creditos
router.get('/author', function(req, res) {
	res.render('author');                   //creo que así está bien, sino meterle parámetro
});

module.exports = router;
