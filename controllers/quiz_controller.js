var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
		where: { id: Number(quizId) },
		include: [{ model: models.Comment }]
	}).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId=' + quizId)); }
		}
	).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
	query = req.query.search;
	if ((typeof query == "string") && (query.trim() != " ")) {
		models.Quiz.findAll({where: ["pregunta like ?", '%' + query + '%'], order: 'pregunta ASC'}).then(function(quizes){
			res.render('quizes', {quizes: quizes, errors: []});
		});

	} else {

	models.Quiz.findAll().then(
		function(quizes) {
			res.render('quizes/index', {quizes: quizes, errors: []}); //poner sino index.ejs
		}
	).catch(function(error) {next(error);});  //mirar si quitar o añadir ; después de error)
	}
};

//GET /quizes/:id
exports.show = function(req, res) {
	//models.Quiz.find(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {quiz: req.quiz, errors: []});
	//})
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
//	models.Quiz.find(req.params.quizId).then(function(quiz){
//	if (req.query.respuesta === quiz.respuesta){
//		res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto'});
//	} else {
//		res.render('quizes/answer', {quiz: quiz, respuesta: 'Incorrecto'});
//	}
//	})
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};



// GET /quizes/question
exports.question = function(req, res){
	models.Quiz.findAll().success(function(quiz) {
		res.render('quizes/question', {pregunta: quiz[0].pregunta}); //quitar ; si va mal
	})
};

// GET /quizes/answer
//exports.answer = function(req, res){
//	models.Quiz.findAll().success(function(quiz){
//	if (req.query.respuesta === quiz[0].respuesta){
//		res.render('quizes/answer', {respuesta: 'Correcto'});
//	} else {
//		res.render('quizes/answer', {respuesta: 'Incorrecto'});
//	}
//	})
//};


//Código renderizar la búsqueda, quitar el parámetro query pasado

//	query = req.query.search;
//	if ((typeof query == "string") && (query.trim() != " ")) {
//		models.Quiz.findAll({where: ["pregunta like ?", '%' + query + '%'], order: 'pregunta ASC'}).then(function(quizes){
//			res.render('quizes/index', {quizes: quizes, query: query});
//		});
//	}

//GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(   //crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta"}
		);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build(req.body.quiz);  //aquí se personalizan quiz[pregunta] y quiz[respuesta] de _form

	quiz.validate().then(function(err){
		if (err){ res.render('quizes/new', {quiz: quiz, errors: err.errors});
	} else {
	//guarda en DB los campos pregunta y respuesta de quiz
	quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
		res.redirect('/quizes')})   //redirección HTTP URL relativo lista de preguntas
	}
	}
	);
};


//GET /quizes/ :id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; //autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz.validate().then(
		function(err){
			if (err){
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			} else {
				req.quiz //save:guarda campos preg y resp en DB
				.save( {fields: ["pregunta", "respuesta"]})
				.then( function(){res.redirect('/quizes');});
			}
		}
	);
};

//DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};