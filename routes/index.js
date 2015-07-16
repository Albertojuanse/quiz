var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

//router.get('/quizes/question', quizController.question);
//router.get('/quizes/answer',   quizController.answer);

//Autoload de comandos con :quizId
router.param('quizId', quizController.load); //autoload :quizId

//en branch creditos
router.get('/author', function(req, res) {
	res.render('author');                   //creo que así está bien, sino meterle parámetro
});

//a partir de la dB
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

module.exports = router;
