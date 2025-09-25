import { useState, useEffect } from "react";
import { useMatch } from "@/contexts/MatchContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Trophy, Target, Clock, Zap, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const LiveScoring = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useMatch();
  const [showBatsmanDialog, setShowBatsmanDialog] = useState(false);
  const [showBowlerDialog, setShowBowlerDialog] = useState(false);
  const [newBatsman, setNewBatsman] = useState("");
  const [newBowler, setNewBowler] = useState("");
  const [celebration, setCelebration] = useState<'four' | 'six' | 'wicket' | null>(null);

  useEffect(() => {
    if (!state.match) {
      navigate('/setup');
    }
  }, [state.match, navigate]);

  useEffect(() => {
    if (celebration) {
      const timer = setTimeout(() => setCelebration(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [celebration]);

  if (!state.match || !state.currentInnings) {
    return <div>Loading...</div>;
  }

  const match = state.match;
  const innings = state.currentInnings;
  const battingTeam = match.teams[match.battingTeam];
  const bowlingTeam = match.teams[match.bowlingTeam];
  
  const striker = battingTeam.players.find(p => p.id === innings.striker);
  const nonStriker = battingTeam.players.find(p => p.id === innings.nonStriker);
  const bowler = bowlingTeam.players.find(p => p.id === innings.bowler);
  
  const strikerStats = innings.battingStats.find(s => s.playerId === innings.striker);
  const bowlerStats = innings.bowlingStats.find(s => s.playerId === innings.bowler);
  
  // Calculate rates
  const currentRunRate = innings.balls > 0 ? (innings.runs / innings.balls * 6).toFixed(2) : "0.00";
  const requiredRunRate = match.currentInnings === 2 && state.innings[0] ? 
    ((state.innings[0].runs - innings.runs + 1) / ((match.overs * 6) - innings.balls) * 6).toFixed(2) : "0.00";

  const handleScore = (runs: number) => {
    dispatch({ type: 'UPDATE_SCORE', payload: { type: 'runs', runs } });
    
    if (runs === 4) {
      setCelebration('four');
      toast({ title: "FOUR! 🏏", description: `${striker?.name} hits a boundary!` });
    } else if (runs === 6) {
      setCelebration('six');
      toast({ title: "SIX! 🚀", description: `${striker?.name} hits it out of the park!` });
    }
    
    // Change strike for odd runs
    if (runs % 2 === 1) {
      dispatch({ type: 'CHANGE_STRIKER' });
    }
    
    // Check for over completion
    if ((innings.balls + 1) % 6 === 0) {
      setShowBowlerDialog(true);
    }
  };

  const handleWicket = () => {
    dispatch({ type: 'UPDATE_SCORE', payload: { type: 'wicket', howOut: 'bowled' } });
    setCelebration('wicket');
    setShowBatsmanDialog(true);
    toast({ 
      title: "WICKET! ⚡", 
      description: `${striker?.name} is out!`,
      variant: "destructive"
    });
  };

  const handleExtra = (type: 'wide' | 'no-ball' | 'bye' | 'leg-bye', runs: number = 1) => {
    dispatch({ type: 'UPDATE_SCORE', payload: { type, runs } });
    toast({ title: `${type.toUpperCase()}`, description: `${runs} extra run(s) added` });
  };

  const selectNewBatsman = () => {
    if (newBatsman) {
      // Update innings with new batsman
      setShowBatsmanDialog(false);
      setNewBatsman("");
    }
  };

  const selectNewBowler = () => {
    if (newBowler) {
      dispatch({ type: 'CHANGE_BOWLER', payload: newBowler });
      dispatch({ type: 'CHANGE_STRIKER' });
      setShowBowlerDialog(false);
      setNewBowler("");
    }
  };

  const availableBatsmen = battingTeam.players.filter(
    p => !innings.battingStats.find(s => s.playerId === p.id && s.isOut) && 
    p.id !== innings.striker && p.id !== innings.nonStriker
  );

  const availableBowlers = bowlingTeam.players.filter(p => p.id !== innings.bowler);

  return (
    <div className="min-h-screen p-4">
      {/* Celebration Overlay */}
      {celebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className={`text-8xl font-bold animate-boundary-celebration ${
            celebration === 'four' ? 'text-boundary-four boundary-glow' :
            celebration === 'six' ? 'text-boundary-six six-glow' :
            'text-destructive animate-wicket-flash'
          }`}>
            {celebration === 'four' ? 'FOUR!' :
             celebration === 'six' ? 'SIX!' : 'WICKET!'}
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Main Scoreboard */}
        <Card className="scoreboard-card neon-glow">
          <CardHeader className="pb-4">
            <CardTitle className="text-center">
              <div className="flex justify-between items-center">
                <span className="text-lg text-muted-foreground">{match.venue}</span>
                <Badge variant="outline" className="text-primary">{match.overs} Overs</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Team Score */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-accent">{battingTeam.name}</h3>
                <div className="space-y-1">
                  <div className="score-display text-4xl">
                    {innings.runs}/{innings.wickets}
                  </div>
                  <div className="text-muted-foreground">
                    {Math.floor(innings.balls / 6)}.{innings.balls % 6} overs
                  </div>
                </div>
              </div>

              {/* Run Rates */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  Current Run Rate
                </div>
                <div className="score-display text-2xl">{currentRunRate}</div>
                {match.currentInnings === 2 && (
                  <>
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <Target className="w-4 h-4 mr-1" />
                      Required Rate
                    </div>
                    <div className="score-display text-2xl">{requiredRunRate}</div>
                  </>
                )}
              </div>

              {/* Current Partnership */}
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-boundary-four">Partnership</h3>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">
                    {(strikerStats?.runs || 0) + (innings.battingStats.find(s => s.playerId === innings.nonStriker)?.runs || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {(strikerStats?.balls || 0) + (innings.battingStats.find(s => s.playerId === innings.nonStriker)?.balls || 0)} balls
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Players */}
          <Card className="scoreboard-card">
            <CardHeader>
              <CardTitle className="text-primary">Current Players</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Striker */}
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded">
                <div>
                  <div className="font-semibold text-primary">{striker?.name} *</div>
                  <div className="text-sm text-muted-foreground">
                    {strikerStats?.runs}({strikerStats?.balls}) 
                    {strikerStats?.fours ? ` ${strikerStats.fours}x4` : ''} 
                    {strikerStats?.sixes ? ` ${strikerStats.sixes}x6` : ''}
                  </div>
                </div>
                <Badge className="bg-primary text-primary-foreground">Striker</Badge>
              </div>

              {/* Non-striker */}
              <div className="flex justify-between items-center p-3 bg-secondary/20 rounded">
                <div>
                  <div className="font-semibold">{nonStriker?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {innings.battingStats.find(s => s.playerId === innings.nonStriker)?.runs}
                    ({innings.battingStats.find(s => s.playerId === innings.nonStriker)?.balls})
                  </div>
                </div>
              </div>

              {/* Bowler */}
              <div className="flex justify-between items-center p-3 bg-destructive/10 rounded">
                <div>
                  <div className="font-semibold text-destructive">{bowler?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.floor((bowlerStats?.balls || 0) / 6)}.{(bowlerStats?.balls || 0) % 6}-{bowlerStats?.runs}-{bowlerStats?.wickets}
                  </div>
                </div>
                <Badge variant="destructive">Bowler</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Scoring Buttons */}
          <Card className="scoreboard-card">
            <CardHeader>
              <CardTitle className="text-accent">Score Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[0, 1, 2, 3, 4, 6].map((runs) => (
                  <Button
                    key={runs}
                    onClick={() => handleScore(runs)}
                    className={`cricket-button ${
                      runs === 4 ? 'boundary-glow text-boundary-four' :
                      runs === 6 ? 'six-glow text-boundary-six' : 'neon-glow'
                    }`}
                    size="lg"
                  >
                    {runs}
                  </Button>
                ))}
              </div>
              
              {/* Wicket Button */}
              <Button
                onClick={handleWicket}
                variant="destructive"
                className="w-full cricket-button mb-4"
                size="lg"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                WICKET
              </Button>

              {/* Extras */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleExtra('wide')}
                  variant="outline"
                  className="cricket-button"
                  size="sm"
                >
                  Wide
                </Button>
                <Button
                  onClick={() => handleExtra('no-ball')}
                  variant="outline"
                  className="cricket-button"
                  size="sm"
                >
                  No Ball
                </Button>
                <Button
                  onClick={() => handleExtra('bye')}
                  variant="outline"
                  className="cricket-button"
                  size="sm"
                >
                  Bye
                </Button>
                <Button
                  onClick={() => handleExtra('leg-bye')}
                  variant="outline"
                  className="cricket-button"
                  size="sm"
                >
                  Leg Bye
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="scoreboard-card">
            <CardHeader>
              <CardTitle className="text-boundary-four">Match Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Innings:</span>
                <Badge variant="outline">{match.currentInnings}/2</Badge>
              </div>
              <div className="flex justify-between">
                <span>Extras:</span>
                <span>{innings.extras.wides + innings.extras.noBalls + innings.extras.byes + innings.extras.legByes}</span>
              </div>
              <div className="flex justify-between">
                <span>Bowling Team:</span>
                <span className="text-sm">{bowlingTeam.name}</span>
              </div>
              
              <Button
                onClick={() => navigate('/summary')}
                variant="outline"
                className="w-full cricket-button"
              >
                <Trophy className="w-4 h-4 mr-2" />
                View Scorecard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Batsman Dialog */}
      <Dialog open={showBatsmanDialog} onOpenChange={setShowBatsmanDialog}>
        <DialogContent className="scoreboard-card">
          <DialogHeader>
            <DialogTitle className="text-primary">Select New Batsman</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={newBatsman} onValueChange={setNewBatsman}>
              <SelectTrigger>
                <SelectValue placeholder="Choose new batsman" />
              </SelectTrigger>
              <SelectContent>
                {availableBatsmen.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={selectNewBatsman} className="w-full cricket-button neon-glow">
              Confirm Selection
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Bowler Dialog */}
      <Dialog open={showBowlerDialog} onOpenChange={setShowBowlerDialog}>
        <DialogContent className="scoreboard-card">
          <DialogHeader>
            <DialogTitle className="text-primary">Select New Bowler</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={newBowler} onValueChange={setNewBowler}>
              <SelectTrigger>
                <SelectValue placeholder="Choose new bowler" />
              </SelectTrigger>
              <SelectContent>
                {availableBowlers.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={selectNewBowler} className="w-full cricket-button neon-glow">
              Start Next Over
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveScoring;