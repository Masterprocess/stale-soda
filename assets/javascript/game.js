$( document )
	.ready( function() {
		var un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix;
		var questions, counter, currentQuestion, currentAnswer, numberCorrect, intervalId;

		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//          Timer Functionality
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		var timer = {
			time: 30,

			resetTime: function() {
				timer.time = 30;
				timer.updateDisplay();
				clearInterval( intervalId );
			},

			start: function() {
				timer.updateDisplay();
				intervalId = setInterval( timer.count, 1000 );
			},

			count: function() {
				timer.time--;
				var newTime = timer.convert( timer.time );

				timer.updateDisplay();

				if ( timer.time === 0 ) {
					timeUp();
				}
			},

			updateDisplay: function() {
				$( "#time-display" )
					.html( timer.convert( timer.time ) );
			},

			convert: function( t ) {
				var minutes = Math.floor( t / 60 );
				var seconds = t - ( minutes * 60 );

				if ( seconds < 10 ) {
					seconds = "0" + seconds;
				}

				if ( minutes === 0 ) {
					minutes = "00";
				} else if ( minutes < 10 ) {
					minutes = "0" + minutes;
				}

				return minutes + ":" + seconds;
			}
		}

		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//          Questions
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		function mrMinutiae( question, answers, correct, img ) {
			this.question = question;
			this.answers = answers;
			this.correctAnswer = correct;
			this.image = img;
			this.answerSelected = false;
			this.answeredCorrectly = false;

		}

		function riddleMeThis() {
			un = new mrMinutiae( "What is the name of the main character in Beyond Good and Evil?", [ "Woof", "Pey'j", "Double H", "Jade" ]
				, "Jade"
				, "assets/images/jade.jpg" );
			deux = new mrMinutiae( "What is Jade's occupation?", [ "Photographer", "Barmaid", "Police Officer", "Pro Dog Petter" ]
				, "Photographer"
				, "assets/images/boss.png" );
			trois = new mrMinutiae( "Who composed the soundtrack of Beyond Good and Evil?", [ "Woof", "Yves Guillemot", "Christophe Heral", "Shigeru Miyamoto" ]
				, "Christophe Heral"
				, "assets/images/Woof.jpg" );
			quatre = new mrMinutiae( "What is the name of Jade's spaceship?", [ "Suck-it-Miyamoto", "Space Doggy", "The Fortune", "The Beluga" ]
				, "The Beluga"
				, "assets/images/beluga.jpg" );
			cinq = new mrMinutiae( "Why are there human-animal hybrids?", [ "Humans needed a new form of slavery for space colonization", "Because the wealthy wanted to talk to their dogs", "Because it's just a game and not everything needs a reason", "They're actually just aliens that resemble human animals" ]
				, "Humans needed a new form of slavery for space colonization"
				, "assets/images/peyj.jpg" );
			six = new mrMinutiae( "Why did Beyond Good and Evil fail commercially?", [ "It was released the same day as The Prince of Persia"
		, "Because the marketing was poor"
		, "Because the doggy wasn't shown off in trailers"
		, "All of the above" ]
				, "All of the above"
				, "assets/images/kbups.jpg" );
			sept = new mrMinutiae( "Who is the main enemy in Beyond Good and Evil?", [ "Dog Haters United!", "The IRIS Network", "Shigeru Miyamoto", "The Dom'z" ]
				, "The Dom'z"
				, "assets/images/hillys.png" );
			huit = new mrMinutiae( "How many platforms has Beyond Good and Evil been released on?", [ "6", "4", "3", "8" ]
				, "6"
				, "assets/images/nino.jpg" );
			neuf = new mrMinutiae( "How many PA-1s can be acquired in Beyond Good and Evil?", [ "1", "13", "14", "Virtually infinite" ]
				, "13"
				, "assets/images/mei.jpg" );
			dix = new mrMinutiae( "What is the name of the moon above Hillys?", [ "Selene", "Luna", "Karl Marx", "Dog Heaven" ]
				, "Selene"
				, "assets/images/doubleh.jpg" );

			questions = [ un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix ];
			counter = 0;
			numberCorrect = 0;

			showQuestion( counter );
			$( "#next" )
				.css( "display", "block" );

		}


		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//          Game Logic
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	

		function newSequence( array ) {
			var length = array.length;

			while ( length > 0 ) {
				var index = Math.floor( Math.random() * length );
				length--;
				//swaps randomly chosen element with the element at current end index
				var temp = array[ length ];
				array[ length ] = array[ index ];
				array[ index ] = temp;
			}

			return array;
		}

		function answerList( question ) {
			//returns list of scrambled answers from triviaQuestion object
			var scrambledAnswers = newSequence( question.answers );
			var ul = $( "<ul>" );

			for ( var i = 0; i < question.answers.length; i++ ) {
				var current = question.answers[ i ];

				ul.append( $( "<li>" )
					.html( current )
					.addClass( "answer" ) );
			}

			return ul;
		}

		function select( choice ) {
			choice.css( {
				"font-size": "18pt"
				, "background": "green"
			} );
			choice.attr( "id", "selection" );
			currentQuestion.answeredCorrectly = isCorrect();

		}

		function deselect( choice ) {
			choice.removeAttr( "id", "selection" );
			choice.css( {
				"font-size": ""
				, "background": ""
			} );
		}

		function isCorrect() {
			if ( currentQuestion.correctAnswer === currentAnswer.html() ) {
				return true;

			}
			return false;
		}

		function endGame() {
			var score = ( numberCorrect / questions.length ) * 100;
			var endGameText = "You completed the quiz! Your score is " + score + "% (" + numberCorrect + " out of " + questions.length + " questions correct).";
			if ( score < 60 ) {
				alert( "You failed this quiz. You need to play Beyond Good and Evil." )
			}
			$( "#questions" )
				.empty()
				.append( endGameDiv( endGameText ) );
			$( "#next" )
				.hide();
		}

		function timeUp() {
			var score = ( numberCorrect / questions.length ) * 100;
			var timeUpText = "You ran out of time! Your score is " + score + "%.";

			$( "#questions" )
				.empty()
				.append( endGameDiv( timeUpText ) );
			clearInterval( intervalId );
			$( "#next" )
				.hide();

		}

		function endGameDiv( text ) {
			return $( "<div>" )
				.addClass( "end-game" )
				.html( text );
		}

		$( document )
			.on( "click touchstart", ".answer", function( event ) {

				currentAnswer = $( this );
				if ( currentQuestion.answerSelected === false ) {
					select( currentAnswer );
					currentQuestion.answerSelected = true;
					$( '#next' )
						.prop( 'disabled', false );

				} else {
					deselect( $( "#selection" ) );
					select( currentAnswer );
				}
			} );

		function showQuestion( questionNumber ) {
			var questionDiv = $( "<div class = 'triviaQuestions'>" );
			var answersDiv = $( "<div class= 'answers'>" );

			currentQuestion = questions[ questionNumber ];

			$( "#questions" )
				.html( "<img class='question-img img-responsive' src=" + currentQuestion.image + ">" );
			questionDiv.html( currentQuestion.question );
			answersDiv.html( answerList( currentQuestion ) );
			$( "#questions" )
				.append( questionDiv )
				.append( answersDiv );
			counter++

		}



		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//          Buttons
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		$( "#start" )
			.on( "click", function() {
				$( "#timer-" )
					.show();
				timer.start();
				riddleMeThis();
				$( this )
					.hide();
			} )

		$( "#next" )
			.on( "click", function( event ) {
				if ( currentQuestion.answerSelected && counter < questions.length ) {
					//log correct/incorrect for prev question
					//display correct/incorrect
					if ( isCorrect( currentQuestion.correctAnswer ) ) {
						numberCorrect++;
					}

					showQuestion( counter );
					timer.resetTime();
					timer.start();

				} else if ( currentQuestion.answerSelected && counter === questions.length ) {
					if ( isCorrect( currentQuestion.correctAnswer ) ) {
						numberCorrect++;
					}

					clearInterval( intervalId );
					endGame();
				}

				$( '#next' )
					.prop( 'disabled', true );
			} )

	} )