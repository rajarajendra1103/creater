
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Text, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface PanelTextEditorProps {
  panelId: string;
  onAddContent: (content: string) => void;
}

const formSchema = z.object({
  text: z.string().min(1, "Text is required"),
  fontSize: z.number().min(10).max(72),
  fontWeight: z.enum(["normal", "bold"]),
  textAlign: z.enum(["left", "center", "right"]),
  isCaption: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const PanelTextEditor = ({ panelId, onAddContent }: PanelTextEditorProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      fontSize: 14,
      fontWeight: "normal",
      textAlign: "left",
      isCaption: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    let textHtml = '';
    
    if (values.isCaption) {
      // Caption style text (usually at the top or bottom of panel)
      textHtml = `
        <div style="
          text-align: ${values.textAlign};
          padding: 6px;
          margin: 6px 0;
          background-color: white;
          font-family: 'Comic Sans MS', sans-serif;
          font-size: ${values.fontSize}px;
          font-weight: ${values.fontWeight};
          border: 1px solid #ddd;
        ">
          ${values.text}
        </div>
      `;
    } else {
      // Regular text
      textHtml = `
        <div style="
          text-align: ${values.textAlign};
          padding: 4px;
          margin: 4px 0;
          font-family: 'Comic Sans MS', sans-serif;
          font-size: ${values.fontSize}px;
          font-weight: ${values.fontWeight};
        ">
          ${values.text}
        </div>
      `;
    }
    
    onAddContent(textHtml);
    form.reset();
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter text here..."
                    className="resize-none h-20"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fontSize"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Font Size: {field.value}px</FormLabel>
                  <FormControl>
                    <Slider
                      min={10}
                      max={36}
                      step={1}
                      value={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fontWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Style</FormLabel>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={field.value === 'normal' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => field.onChange('normal')}
                      size="sm"
                    >
                      Normal
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'bold' ? 'default' : 'outline'}
                      className="flex-1 font-bold"
                      onClick={() => field.onChange('bold')}
                      size="sm"
                    >
                      Bold
                    </Button>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="textAlign"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alignment</FormLabel>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={field.value === 'left' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => field.onChange('left')}
                    size="sm"
                  >
                    <AlignLeft size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant={field.value === 'center' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => field.onChange('center')}
                    size="sm"
                  >
                    <AlignCenter size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant={field.value === 'right' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => field.onChange('right')}
                    size="sm"
                  >
                    <AlignRight size={16} />
                  </Button>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isCaption"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                </FormControl>
                <FormLabel className="cursor-pointer">Format as caption box</FormLabel>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            <Text size={16} className="mr-2" />
            Add Text to Panel
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PanelTextEditor;
