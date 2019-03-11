//THINGS THAT NEED FIXING
//1.String giving the correct answer when wrong answer is chosen doesn't disappear when the next question's generated
//2.If answer is selected in the final seconds of countdown the timer breaks (regardless of answer choice)
        //additionally if timer is allowed to runout the timer breaks
//3. In an attempt to fix 1 & 2, I created more problems and now the timer doesn't display

//ADDITIONAL FUN THINGS TO ADD
//1. Victory Song at end with results page
//2. Song of defeat if player get 4 or less questions correct
//3. Start gif at load screen


$(document).ready(function() {
    $("remaining-time").hide();
    //On Click Listener for User to Press Start Button
    $("#start").on('click', trivia.startGame);
    $(document).on('click', '.option', trivia.guessCheck);
    
});

const giphy = {
    search: (searchTerm) => {
        let p = new Promise((resolve, reject) => {
            $.get(`https://api.giphy.com/v1/gifs/search?q=${searchTerm.toLowerCase().replace(' ','+')}&api_key=LHRI5kC51qzijUd7112IVGYh11oo2wSf&limit=1`)
            .then( (response) => {
                resolve(response.data[0].images.fixed_height.url);
            });
        })
        return p;
    }
}

//Setting Properties to Trivia
let trivia = {
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 0,
    timerOn: false,
    timerId: '',

    //List of Questions
    questions: {
        q1: "Who is the drummer for Led Zeppelin?",
        q2: "How did Stevie Ray Vaughn die?",
        q3: "Who is NOT a part of the '27 Club'?",
        q4: "What Rockstar wrote the music for the movie 'Where the Wild Things Are'?",
        q5: "What is the only Rock band to ever shut down Wall Street?",
        q6: "What Rockstar famously snorted his fathers ashes?",
        q7: "From what famous band did P.Diddy (aka Puff Daddy) sample from for the 1998 Godzilla soundtrack?",
        q8: "Before becoming the Prince of Darkness what was Ozzy Osbourne's occupation",
        q9: "What guitar players definitive sound can be attributed to the loss of his finger tips in a factory accident?",
        q10: "What is the name of B.B. King's legendary guitar?",
    },
    //Array Of Potential Answers
    options: {
        q1: ['Keith Moon', 'Jason Bonham', 'John Paul Jones', 'John Bonham'],
        q2: ['Helicopter Crash', 'Overdose', 'Cancer', 'Gunshot'],
        q3: ['Kurt Cobain', 'Jim Morrison', 'Duane Allman', 'Jimi Hendrix'],
        q4: ['Chris Robinson', 'Eddie Veddar', 'Willie Nelson', 'Gene Simmons'],
        q5: ['Pearl Jam', 'Guns N Roses', 'Rage Against The Machine', ' Black Sabbath'],
        q6: ['Jimmy Page','Eric Clapton','George Harrison','Keith Richards'],
        q7: ['Led Zeppelin', 'The Beatles', 'Guns N Roses', 'Nirvana'],
        q8: ['Retail Clerk', 'Factory Worker', 'Coal Miner', 'Burglar'],
        q9: ['Eric Clapton', 'Tony Iommi', 'Eddie Van Halen', 'Ronnie Van Zant'],
        q10: ['Mustang-Sally', 'Beatrice', 'Trigger', 'Lucille'],
    },
    //Answers to Questions 
    answers: [
        'John Bonham',
        'Helicopter Crash',
        'Duane Allman',
        'Eddie Veddar',
        'Rage Against The Machine',
        'Keith Richards',
        'Led Zeppelin',
        'Burglar',
        'Tony Iommi',
        'Lucille',
    ],
    gifSearchTerms: [
        'John Bonham',
        'Helicopter Crash',
        'The Allman Brothers',
        'Pearl Jam',
        'Rage Against The Machine',
        'Keith Richards',
        'Led Zeppelin',
        'Hamburglar',
        'Guitar',
        'BB King',
    ],
    gifs: [],

    //Initialize Game Method
    startGame: function(){
        
        trivia.gifSearchTerms.forEach((item, index) => {
            item = item.toLowerCase().replace(' ','+');
            giphy.search(item).then((giphyUrl) => {
                
                trivia.gifs[index]= giphyUrl;
            });
        });

        //Restarting the game results
        trivia.currentSet = 0;
        trivia.correct = 0;
        trivia.incorrect = 0;
        trivia.unanswered = 0;
        clearInterval(trivia.timerId);

        //Show Game Section
        $('#game').show();
        //Empty The Last Results
        $('#results').html('');
        //Show Time 
        $('#timer').text(trivia.timer);
        //Hide Start Button
        $('#start').hide();
        //Show Remaining Time
        // $('#remaining-time').show();
        $('#remaining-time').addClass('timer-active');
        //Ask Question
        trivia.nextQuestion();
    },

    nextQuestion : function(){
        //Set Timer to Specified Time per Question
        trivia.timer = 10;
        $('#timer').removeClass('last-seconds');
        $('#timer').text(trivia.timer);
        //Preventing Timer Speed Up
        if (!trivia.timerOn) {
            trivia.timerId = setInterval(trivia.timerRunning, 1000);
            trivia.timerOn = true;
        }
        //Collects questions then writes current question
        let questionContent = Object.values(trivia.questions)[trivia.currentSet];
        $('#question').text(questionContent);

        //Variable set equal to the answer choices from Options Array
        let questionOptions = Object.values(trivia.options)[trivia.currentSet];

        //Makes Trivia Guess Options in HTML
        $.each(questionOptions, function (index, key) {
            $('#options').append($('<button class="option btn btn-info btn-lg">' + key + '</button>'));
        })
    },
    //Method to decrement counter & count unanswered if time's up.
    timerRunning : function(){

        if (trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
            $('#timer').text(trivia.timer);
            trivia.timer--;
            if (trivia.timer === 4) {
                $('timer').addClass('last-seconds');
            }
        }
        //Time ran out and unanswered gets incremented by one
        else if (trivia.timer === -1) {
            trivia.unanswered++;
            trivia.result = false;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('results').html("<h3>Time's Up! The answer was  " + Object.values(trivia.answers)[trivia.currentSet] + "</h3>");
        } 
        else if (trivia.currentSet === Object.keys(trivia.questions).length) {

            //Pushes results of game to the page
            $('#results')
                .html('<h3>Thanks for playing!</h3>' +
                    '<p>Correct: ' + trivia.correct + '</p>' +
                    '<p>Incorrect: ' + trivia.incorrect + '</p>' +
                    '<p>Unaswered: ' + trivia.unanswered + '</p>' +
                    '<p>Please play again!</p>');

            $('#game').hide();
            $('#start').show();
        
        }
    },

    guessCheck: function () {
        let resultId;

        let currentAnswer = trivia.answers[trivia.currentSet];

        //this - is referring to resultId and is looking to see if answer(this) is equal to the current question.
        if ($(this).text() === currentAnswer) {
            $(this).addClass('btn-success').removeClass('btn-info');

            //Adding to correct answers
            trivia.correct++;
            
            //Setting time the gif will run
            resultId = setTimeout(trivia.guessResult, 4500)
            
            
            let htmlString = `<img src="${trivia.gifs[trivia.currentSet]}" />`;
            $('#results').html(htmlString);    
        } 
        else {
            $(this).addClass('btn-danger').removeClass('btn-info');

            trivia.incorrect++;
            //commenting this out keeps the timer moving when wrong answer chosen -> clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 4500)
            let wrongAnswer = `<h3>The answer was ${currentAnswer} </h3>`;
            $('#results').html(wrongAnswer);  //This line doesn't disappear
        }
    },

    guessResult: function () {

        trivia.currentSet++;

        $('.option').remove();
        $('#results img').remove();

        trivia.nextQuestion();
    }

};

