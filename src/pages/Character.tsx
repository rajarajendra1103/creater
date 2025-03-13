
import { Card, CardContent } from '@/components/ui/card';
import CharacterEditor from '@/components/CharacterEditor';

const Character = () => {
  return (
    <div className="min-h-screen pt-20 pb-10 px-4 page-transition page-enter">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="section-heading mb-3">Character Designer</h1>
          <p className="section-subheading">
            Create and customize manga characters with different features and expressions
          </p>
        </div>

        <Card className="glass-panel overflow-hidden border-0">
          <CardContent className="p-6">
            <CharacterEditor />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Character;
