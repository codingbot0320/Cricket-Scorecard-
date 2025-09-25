import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Trophy, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-6xl font-bold text-primary mb-4 neon-glow">
            Cricket Scorecard
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Professional digital scoring for local cricket matches
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="scoreboard-card hover:neon-glow transition-all duration-300">
            <CardHeader className="text-center">
              <Play className="w-12 h-12 mx-auto text-primary mb-4" />
              <CardTitle className="text-primary">Quick Setup</CardTitle>
              <CardDescription>
                Set up teams, players, and match details in minutes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="scoreboard-card hover:neon-glow transition-all duration-300">
            <CardHeader className="text-center">
              <Trophy className="w-12 h-12 mx-auto text-accent mb-4" />
              <CardTitle className="text-accent">Live Scoring</CardTitle>
              <CardDescription>
                Real-time scoring with celebration effects and stats
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="scoreboard-card hover:neon-glow transition-all duration-300">
            <CardHeader className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto text-boundary-four mb-4" />
              <CardTitle className="text-boundary-four">Match Analysis</CardTitle>
              <CardDescription>
                Complete scorecards and exportable match summaries
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="scoreboard-card text-center p-8">
          <CardContent className="pt-6">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Ready to Score Your Match?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Start with match setup or explore the features
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="cricket-button neon-glow">
                <Link to="/setup">
                  <Play className="w-5 h-5 mr-2" />
                  Start New Match
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="cricket-button">
                <Link to="/live">
                  <Trophy className="w-5 h-5 mr-2" />
                  Continue Match
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 text-muted-foreground">
          <p>Experience professional cricket scoring with TV-broadcast style interface</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
