import { useMatch } from "@/contexts/MatchContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Download, Home, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const MatchSummary = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useMatch();

  if (!state.match || !state.currentInnings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="scoreboard-card p-8 text-center">
          <CardContent>
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">No Match Data</h2>
            <p className="text-muted-foreground mb-6">
              No active match found. Start a new match to view summary.
            </p>
            <Button onClick={() => navigate('/setup')} className="cricket-button neon-glow">
              <Home className="w-4 h-4 mr-2" />
              Start New Match
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const match = state.match;
  const innings = state.currentInnings;
  const battingTeam = match.teams[match.battingTeam];
  const bowlingTeam = match.teams[match.bowlingTeam];

  const exportScorecard = () => {
    toast({ 
      title: "Export Coming Soon!", 
      description: "PDF/CSV export will be available in the next update" 
    });
  };

  const newMatch = () => {
    dispatch({ type: 'RESET_MATCH' });
    navigate('/setup');
  };

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-primary mb-2 neon-glow">Match Summary</h1>
          <p className="text-muted-foreground">{match.venue}</p>
        </div>

        {/* Match Info */}
        <Card className="scoreboard-card">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-primary">
              {battingTeam.name} vs {bowlingTeam.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="score-display text-5xl">
                {innings.runs}/{innings.wickets}
              </div>
              <div className="text-lg text-muted-foreground">
                {Math.floor(innings.balls / 6)}.{innings.balls % 6} overs ({match.overs} overs match)
              </div>
              <Badge variant="outline" className="text-primary">
                Innings {match.currentInnings}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Batting Card */}
          <Card className="scoreboard-card">
            <CardHeader>
              <CardTitle className="text-accent">{battingTeam.name} Batting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-2 text-sm font-semibold text-muted-foreground border-b pb-2">
                  <span>Batsman</span>
                  <span>Runs</span>
                  <span>Balls</span>
                  <span>4s/6s</span>
                  <span>SR</span>
                </div>
                {innings.battingStats.map((stat) => {
                  const player = battingTeam.players.find(p => p.id === stat.playerId);
                  const strikeRate = stat.balls > 0 ? (stat.runs / stat.balls * 100).toFixed(1) : "0.0";
                  
                  return (
                    <div key={stat.playerId} className="grid grid-cols-5 gap-2 text-sm py-1">
                      <span className={`font-medium ${
                        stat.playerId === innings.striker ? 'text-primary' : 
                        stat.playerId === innings.nonStriker ? 'text-accent' : 
                        stat.isOut ? 'text-destructive' : 'text-foreground'
                      }`}>
                        {player?.name}
                        {stat.playerId === innings.striker ? ' *' : ''}
                        {stat.isOut ? ' (out)' : ''}
                      </span>
                      <span className="font-bold">{stat.runs}</span>
                      <span>{stat.balls}</span>
                      <span>{stat.fours}/{stat.sixes}</span>
                      <span>{strikeRate}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Extras: </span>
                    <span className="font-semibold">
                      {innings.extras.wides + innings.extras.noBalls + innings.extras.byes + innings.extras.legByes}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Run Rate: </span>
                    <span className="font-semibold">
                      {innings.balls > 0 ? (innings.runs / innings.balls * 6).toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bowling Card */}
          <Card className="scoreboard-card">
            <CardHeader>
              <CardTitle className="text-destructive">{bowlingTeam.name} Bowling</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-2 text-sm font-semibold text-muted-foreground border-b pb-2">
                  <span>Bowler</span>
                  <span>Overs</span>
                  <span>Runs</span>
                  <span>Wkts</span>
                  <span>Econ</span>
                </div>
                {innings.bowlingStats.map((stat) => {
                  const player = bowlingTeam.players.find(p => p.id === stat.playerId);
                  const economy = stat.balls > 0 ? (stat.runs / stat.balls * 6).toFixed(2) : "0.00";
                  const overs = `${Math.floor(stat.balls / 6)}.${stat.balls % 6}`;
                  
                  return (
                    <div key={stat.playerId} className="grid grid-cols-5 gap-2 text-sm py-1">
                      <span className={`font-medium ${
                        stat.playerId === innings.bowler ? 'text-destructive' : 'text-foreground'
                      }`}>
                        {player?.name}
                        {stat.playerId === innings.bowler ? ' *' : ''}
                      </span>
                      <span>{overs}</span>
                      <span>{stat.runs}</span>
                      <span className="font-bold">{stat.wickets}</span>
                      <span>{economy}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="scoreboard-card">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/live')} 
                className="cricket-button neon-glow"
                size="lg"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Back to Scoring
              </Button>
              <Button 
                onClick={exportScorecard}
                variant="outline"
                className="cricket-button"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Scorecard
              </Button>
              <Button 
                onClick={newMatch}
                variant="outline"
                className="cricket-button"
                size="lg"
              >
                <Home className="w-4 h-4 mr-2" />
                New Match
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MatchSummary;