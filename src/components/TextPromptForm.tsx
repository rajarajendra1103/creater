
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Loading from '@/components/ui/Loading';

const formSchema = z.object({
  prompt: z.string().min(3, {
    message: "Prompt must be at least 3 characters.",
  }),
  style: z.string().default('manga'),
  width: z.number().min(256).max(1024),
  height: z.number().min(256).max(1024),
  detailLevel: z.number().min(1).max(10)
});

type FormValues = z.infer<typeof formSchema>;

interface TextPromptFormProps {
  onGenerate: (result: { imageUrl: string, prompt: string }) => void;
}

const TextPromptForm = ({ onGenerate }: TextPromptFormProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      style: 'manga',
      width: 512,
      height: 512,
      detailLevel: 7
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call an API
      // For now, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock response - in production this would be a real API call
      const mockImageUrl = 'https://images.unsplash.com/photo-1548391350-968f58dedaed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80';
      
      onGenerate({
        imageUrl: mockImageUrl,
        prompt: values.prompt
      });
      
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Describe your manga drawing</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="E.g. A young ninja with spiky hair in a fighting pose, detailed line art"
                  className="resize-none h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Art Style</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="manga">Manga</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="sketch">Sketch</SelectItem>
                    <SelectItem value="line-art">Line Art</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="detailLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detail Level: {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width: {field.value}px</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={256}
                    max={1024}
                    step={64}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height: {field.value}px</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={256}
                    max={1024}
                    step={64}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full py-6 rounded-xl btn-hover"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loading size="small" message="" />
          ) : (
            "Generate Drawing"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default TextPromptForm;
