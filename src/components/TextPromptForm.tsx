import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Loading from '@/components/ui/Loading';
import { generateImageFromPrompt } from '@/utils/imageProcessingService';

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
      // Enhance the prompt based on the style
      let enhancedPrompt = values.prompt;
      switch (values.style) {
        case 'manga':
          enhancedPrompt = `Manga style: ${values.prompt}, black and white, line art, detailed, ${values.detailLevel}/10 detail level`;
          break;
        case 'anime':
          enhancedPrompt = `Anime style: ${values.prompt}, colorful, clean lines, ${values.detailLevel}/10 detail level`;
          break;
        case 'sketch':
          enhancedPrompt = `Rough sketch: ${values.prompt}, pencil drawing, ${values.detailLevel}/10 detail level`;
          break;
        case 'line-art':
          enhancedPrompt = `Clean line art: ${values.prompt}, black and white, no shading, ${values.detailLevel}/10 detail level`;
          break;
      }

      // Call the actual API
      const imageUrl = await generateImageFromPrompt(enhancedPrompt);
      
      onGenerate({
        imageUrl,
        prompt: values.prompt
      });
      
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate image. Please try again later.");
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
