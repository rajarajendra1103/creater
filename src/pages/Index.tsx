
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenLine, Wand2, Upload, User, ArrowRight, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-scale-in');
          entry.target.classList.remove('opacity-0');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: 'Text to Drawing',
      description: 'Convert text descriptions into manga-style art with AI assistance.',
      icon: <Wand2 className="h-8 w-8 text-primary" />,
      path: '/generator'
    },
    {
      title: 'Drawing Canvas',
      description: 'Sketch and refine your manga art with professional drawing tools.',
      icon: <PenLine className="h-8 w-8 text-primary" />,
      path: '/canvas'
    },
    {
      title: 'Image Upload',
      description: 'Transform your photos into manga-style sketches with a single click.',
      icon: <Upload className="h-8 w-8 text-primary" />,
      path: '/upload'
    },
    {
      title: 'Character Designer',
      description: 'Create and customize manga characters with different expressions.',
      icon: <User className="h-8 w-8 text-primary" />,
      path: '/character'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center space-y-6" ref={headerRef}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/5 mb-4">
              <Layers className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-light tracking-tight animate-slide-down">
              Create Beautiful Manga Art
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-down" style={{ animationDelay: '100ms' }}>
              Design characters, generate drawings, and build manga panels with an elegant, AI-powered creative studio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Button 
                size="lg" 
                className="px-8 py-6 rounded-xl btn-hover"
                onClick={() => navigate('/generator')}
              >
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 rounded-xl btn-hover"
                onClick={() => navigate('/canvas')}
              >
                Open Canvas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="section-heading mb-3">Powerful Creative Tools</h2>
            <p className="section-subheading max-w-2xl mx-auto">
              Everything you need to bring your manga ideas to life, from concept to final art.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="neo-panel overflow-hidden border-0 animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-start space-y-4">
                    <div className="rounded-lg bg-primary/5 p-3 mb-2">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-medium">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <Button 
                      variant="ghost" 
                      className="mt-4 p-0 h-auto hover:bg-transparent"
                      onClick={() => navigate(feature.path)}
                    >
                      Try it now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-secondary/30">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Creater App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
