
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { MessageCircle, MessageSquare, AlertTriangle } from 'lucide-react';

interface PanelBubbleEditorProps {
  panelId: string;
  onAddContent: (content: string) => void;
}

const formSchema = z.object({
  text: z.string().min(1, "Speech bubble text is required"),
  style: z.enum(["speech", "thought", "shout"]),
});

type FormValues = z.infer<typeof formSchema>;

const PanelBubbleEditor = ({ panelId, onAddContent }: PanelBubbleEditorProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      style: "speech",
    },
  });

  const onSubmit = (values: FormValues) => {
    let bubbleHtml = '';
    
    // Create different speech bubble styles
    switch (values.style) {
      case 'speech':
        bubbleHtml = `
          <div class="speech-bubble" style="
            position: relative;
            background-color: white;
            border: 2px solid black;
            border-radius: 20px;
            padding: 12px;
            margin: 10px;
            max-width: 90%;
            font-family: 'Comic Sans MS', cursive, sans-serif;
            font-size: 14px;
            display: inline-block;
          ">
            ${values.text}
            <div style="
              position: absolute;
              bottom: -20px;
              left: 20px;
              width: 20px;
              height: 20px;
              background-color: white;
              border-right: 2px solid black;
              border-bottom: 2px solid black;
              transform: rotate(45deg);
            "></div>
          </div>
        `;
        break;
      case 'thought':
        bubbleHtml = `
          <div class="thought-bubble" style="
            position: relative;
            background-color: white;
            border: 2px solid black;
            border-radius: 30px;
            padding: 12px;
            margin: 10px;
            max-width: 90%;
            font-family: 'Comic Sans MS', cursive, sans-serif;
            font-size: 14px;
            display: inline-block;
          ">
            ${values.text}
            <div style="
              position: absolute;
              bottom: -10px;
              left: 15px;
              width: 10px;
              height: 10px;
              background-color: white;
              border: 2px solid black;
              border-radius: 50%;
            "></div>
            <div style="
              position: absolute;
              bottom: -20px;
              left: 5px;
              width: 5px;
              height: 5px;
              background-color: white;
              border: 2px solid black;
              border-radius: 50%;
            "></div>
          </div>
        `;
        break;
      case 'shout':
        bubbleHtml = `
          <div class="shout-bubble" style="
            position: relative;
            background-color: white;
            border: 2px solid black;
            border-radius: 5px;
            padding: 12px;
            margin: 10px;
            max-width: 90%;
            font-family: 'Impact', sans-serif;
            font-size: 16px;
            font-weight: bold;
            display: inline-block;
            text-transform: uppercase;
          ">
            ${values.text}
            <div style="
              position: absolute;
              width: 20px;
              height: 20px;
              bottom: -10px;
              left: 20px;
              background-color: white;
              transform: rotate(45deg);
              border-right: 2px solid black;
              border-bottom: 2px solid black;
            "></div>
          </div>
        `;
        break;
    }
    
    onAddContent(bubbleHtml);
    form.reset();
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Bubble Style</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-2"
                  >
                    <FormItem className="flex items-center space-x-1 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="speech" id="speech" />
                      </FormControl>
                      <FormLabel className="flex items-center cursor-pointer" htmlFor="speech">
                        <MessageCircle size={16} className="mr-1" />
                        Speech
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-1 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="thought" id="thought" />
                      </FormControl>
                      <FormLabel className="flex items-center cursor-pointer" htmlFor="thought">
                        <MessageSquare size={16} className="mr-1" />
                        Thought
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-1 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="shout" id="shout" />
                      </FormControl>
                      <FormLabel className="flex items-center cursor-pointer" htmlFor="shout">
                        <AlertTriangle size={16} className="mr-1" />
                        Shout
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bubble Text</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter speech bubble text here..."
                    className="resize-none h-20"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            <MessageCircle size={16} className="mr-2" />
            Add Speech Bubble
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PanelBubbleEditor;
