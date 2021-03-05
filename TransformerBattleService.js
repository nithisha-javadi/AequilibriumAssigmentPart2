var app = angular.module('TransformersApp');

app.service("BattleRulesService", function() {

  // Function for opponents run away Criteria
  function checkOpponentRunsAway(main, opponent) {
    return (main.strength - opponent.strength) >= 3 && (main.courage - opponent.courage) >= 4;
  }
  
  // Function for Optimus Prime or Predaking win criteria
  function checkLiderAutoWin(transformer) {
    var name = transformer.name;
    return angular.equals(name, "Optimus Prime") || angular.equals(name, "Predaking");
  }

  function checkLiderFaceOff(main, opponent) {
    return checkLiderAutoWin(main) && checkLiderAutoWin(opponent);
  }
  
  // Function for face-off criteria where the game immediately ends with all competitors destroyed
  function resolveFaceOff(autobot, decepticon) {
    var winner;
    var error;

    if (checkLiderFaceOff(autobot, decepticon)) {
      error = {
        type: "OptimusPredakingBattleException",
        title: "The Arena was destroyed",
        message: autobot.name + " battled against " + decepticon.name + " and everything was destroyed!"

      };
      throw error;
    }

    var autobotRunsAway = checkOpponentRunsAway(decepticon, autobot);
    var decepticonRunsAway = checkOpponentRunsAway(autobot, decepticon);

    if (checkLiderAutoWin(autobot)) {
      winner = autobot;

    } else if (checkLiderAutoWin(decepticon)) {
      winner = decepticon;

    } else if (autobotRunsAway) {
      winner = decepticon;

    } else if (decepticonRunsAway) {
      winner = autobot;

    } else if (Math.abs(autobot.skill - decepticon.skill) >= 3) {
      winner = autobot.skill > decepticon.skill ? autobot : decepticon;

    } else if (autobot.overallRating - decepticon.overallRating > 0) {
      winner = autobot.overallRating > decepticon.overallRating ? autobot : decepticon;

    } else if (autobot.overallRating - decepticon.overallRating === 0) { // In the event of a tie, both Transformers are destroyed
      error = {
        type: "BattleTiedException",
        title: "Simultaneous Destruction",
        message: autobot.name + " battled against " + decepticon.name + " and both were destroyed."

      };
      throw error;
    }

    return winner;
  }

  return {
    resolveFaceOff: resolveFaceOff
  };
});
