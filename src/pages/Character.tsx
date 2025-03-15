
import { Card, CardContent } from '@/components/ui/card';
import CharacterEditor from '@/components/CharacterEditor';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

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

        <Alert variant="default" className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Image Processing Available</AlertTitle>
          <AlertDescription>
            This application uses external APIs for image processing. For better results, 
            upload high-quality images with clear facial features.
          </AlertDescription>
        </Alert>

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
