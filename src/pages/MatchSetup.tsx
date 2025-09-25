import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMatch } from "@/contexts/MatchContext";
import { Match, Team, Player, Innings, BattingStats, BowlingStats } from "@/types/cricket";
import { Users, Settings, Trophy, ArrowRight, Plus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const MatchSetup = () => {
  const navigate = useNavigate();
  const { dispatch } = useMatch();
  
  const [step, setStep] = useState(1);
  const [matchDetails, setMatchDetails] = useState({
    venue: "",
    overs: 20,
    tossWinner: "",
    tossDecision: "" as "bat" | "bowl",
  });
  
  const [teams, setTeams] = useState<Team[]>([
    { id: "team1", name: "", players: [] },
    { id: "team2", name: "", players: [] },
  ]);
  
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(0);

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    
    const newPlayer: Player = {
      id: `player_${Date.now()}`,
      name: newPlayerName.trim(),
      isPlaying: true,
    };
    
    setTeams(prev => prev.map((team, index) => 
      index === selectedTeam 
        ? { ...team, players: [...team.players, newPlayer] }
        : team
    ));
    
    setNewPlayerName("");
  };

  const removePlayer = (teamIndex: number, playerId: string) => {
    setTeams(prev => prev.map((team, index) => 
      index === teamIndex 
        ? { ...team, players: team.players.filter(p => p.id !== playerId) }
        : team
    ));
  };

  const startMatch = () => {
    // Validation
    if (!matchDetails.venue.trim()) {
      toast({ title: "Please enter venue", variant: "destructive" });
      return;
    }
    
    if (!teams[0].name.trim() || !teams[1].name.trim()) {
      toast({ title: "Please enter team names", variant: "destructive" });
      return;
    }
    
    if (teams[0].players.length < 2 || teams[1].players.length < 2) {
      toast({ title: "Each team needs at least 2 players", variant: "destructive" });
      return;
    }
    
    if (!matchDetails.tossWinner || !matchDetails.tossDecision) {
      toast({ title: "Please complete toss details", variant: "destructive" });
      return;
    }

    // Create match
    const match: Match = {
      id: `match_${Date.now()}`,
      teams: [teams[0], teams[1]],
      overs: matchDetails.overs,
      venue: matchDetails.venue,
      tossWinner: matchDetails.tossWinner,
      tossDecision: matchDetails.tossDecision,
      battingTeam: matchDetails.tossWinner === teams[0].id ? 
        (matchDetails.tossDecision === 'bat' ? 0 : 1) : 
        (matchDetails.tossDecision === 'bat' ? 1 : 0),
      bowlingTeam: matchDetails.tossWinner === teams[0].id ? 
        (matchDetails.tossDecision === 'bat' ? 1 : 0) : 
        (matchDetails.tossDecision === 'bat' ? 0 : 1),
      currentInnings: 1,
      status: 'live',
    };

    // Create first innings
    const battingTeam = match.teams[match.battingTeam];
    const bowlingTeam = match.teams[match.bowlingTeam];
    
    const innings: Innings = {
      battingTeamId: battingTeam.id,
      bowlingTeamId: bowlingTeam.id,
      runs: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      battingStats: battingTeam.players.map(player => ({
        playerId: player.id,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false,
      })),
      bowlingStats: bowlingTeam.players.map(player => ({
        playerId: player.id,
        overs: 0,
        balls: 0,
        runs: 0,
        wickets: 0,
        maidens: 0,
      })),
      striker: battingTeam.players[0]?.id || "",
      nonStriker: battingTeam.players[1]?.id || "",
      bowler: bowlingTeam.players[0]?.id || "",
      extras: {
        byes: 0,
        legByes: 0,
        wides: 0,
        noBalls: 0,
      },
    };

    dispatch({ type: 'SET_MATCH', payload: match });
    dispatch({ type: 'START_INNINGS', payload: innings });
    
    toast({ title: "Match started successfully!" });
    navigate('/live');
  };

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-primary mb-2 neon-glow">Match Setup</h1>
          <p className="text-muted-foreground">Configure your cricket match</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= stepNum 
                    ? 'bg-primary text-primary-foreground neon-glow' 
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Match Details */}
        {step === 1 && (
          <Card className="scoreboard-card">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Settings className="w-5 h-5 mr-2" />
                Match Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    placeholder="Enter match venue"
                    value={matchDetails.venue}
                    onChange={(e) => setMatchDetails(prev => ({ ...prev, venue: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="overs">Overs per innings</Label>
                  <Select 
                    value={matchDetails.overs.toString()} 
                    onValueChange={(value) => setMatchDetails(prev => ({ ...prev, overs: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Overs</SelectItem>
                      <SelectItem value="10">10 Overs</SelectItem>
                      <SelectItem value="15">15 Overs</SelectItem>
                      <SelectItem value="20">20 Overs</SelectItem>
                      <SelectItem value="25">25 Overs</SelectItem>
                      <SelectItem value="50">50 Overs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="team1">Team 1 Name</Label>
                  <Input
                    id="team1"
                    placeholder="Enter team 1 name"
                    value={teams[0].name}
                    onChange={(e) => setTeams(prev => prev.map((team, index) => 
                      index === 0 ? { ...team, name: e.target.value } : team
                    ))}
                  />
                </div>
                <div>
                  <Label htmlFor="team2">Team 2 Name</Label>
                  <Input
                    id="team2"
                    placeholder="Enter team 2 name"
                    value={teams[1].name}
                    onChange={(e) => setTeams(prev => prev.map((team, index) => 
                      index === 1 ? { ...team, name: e.target.value } : team
                    ))}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} className="cricket-button neon-glow">
                  Next: Add Players
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Team Players */}
        {step === 2 && (
          <div className="space-y-6">
            <Card className="scoreboard-card">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Users className="w-5 h-5 mr-2" />
                  Add Players
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {teams.map((team, teamIndex) => (
                    <div key={team.id} className="space-y-4">
                      <h3 className="text-lg font-semibold text-accent">{team.name || `Team ${teamIndex + 1}`}</h3>
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="Player name"
                          value={selectedTeam === teamIndex ? newPlayerName : ""}
                          onChange={(e) => {
                            setSelectedTeam(teamIndex);
                            setNewPlayerName(e.target.value);
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              setSelectedTeam(teamIndex);
                              addPlayer();
                            }
                          }}
                        />
                        <Button 
                          onClick={() => {
                            setSelectedTeam(teamIndex);
                            addPlayer();
                          }}
                          size="icon"
                          className="cricket-button"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {team.players.map((player) => (
                          <div key={player.id} className="flex items-center justify-between bg-secondary/20 rounded p-2">
                            <span className="text-sm">{player.name}</span>
                            <Button
                              onClick={() => removePlayer(teamIndex, player.id)}
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-destructive hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {team.players.length} players added
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between pt-6">
                  <Button onClick={() => setStep(1)} variant="outline" className="cricket-button">
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="cricket-button neon-glow">
                    Next: Toss Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Toss Details */}
        {step === 3 && (
          <Card className="scoreboard-card">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Trophy className="w-5 h-5 mr-2" />
                Toss Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Toss Winner</Label>
                  <Select 
                    value={matchDetails.tossWinner} 
                    onValueChange={(value) => setMatchDetails(prev => ({ ...prev, tossWinner: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select toss winner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={teams[0].id}>{teams[0].name || "Team 1"}</SelectItem>
                      <SelectItem value={teams[1].id}>{teams[1].name || "Team 2"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Toss Decision</Label>
                  <Select 
                    value={matchDetails.tossDecision} 
                    onValueChange={(value: "bat" | "bowl") => setMatchDetails(prev => ({ ...prev, tossDecision: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose to bat or bowl" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bat">Chose to Bat</SelectItem>
                      <SelectItem value="bowl">Chose to Bowl</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button onClick={() => setStep(2)} variant="outline" className="cricket-button">
                  Back
                </Button>
                <Button onClick={startMatch} className="cricket-button neon-glow">
                  Start Match
                  <Trophy className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MatchSetup;