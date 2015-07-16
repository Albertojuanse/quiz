var models = require('../models/models.js');

// GET /quizes/question
exports.question = function(req, res){
	models.Quiz.findAll().success(function(quiz) {
		res.render('quizes/question', {pregunta: quiz[0].pregunta}); //quitar ; si va mal
	})
};

// GET /quizes/answer
exports.answer = function(req, res){
	models.Quiz.findAll().success(function(quiz){
	if (req.query.respuesa === quiz[0].respuesta){
		res.render('quizes/answer', {respuesta: 'Correcto'});
	} else {
		res.render('quizes/answer', {respuesta: 'Incorrecto'});
	}
	})
};