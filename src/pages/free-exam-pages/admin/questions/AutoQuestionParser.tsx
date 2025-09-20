import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Wand2 } from "lucide-react";

// Define the type for parsed question
interface ParsedQuestion {
  question: string;
  options: string[];
}

// Auto-parse component for handling text input
export const AutoQuestionParser = ({
  onParsed,
  onError,
}: {
  onParsed: (parsed: ParsedQuestion) => void;
  onError: (error: string) => void;
}) => {
  const [inputText, setInputText] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);

  const parseQuestion = (text: string): ParsedQuestion | null => {
    if (!text.trim()) return null;

    try {
      // Split into lines and clean them
      const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);

      if (lines.length < 3) return null;

      // Extract question line
      let questionText:any = lines[0];
      const optionStartIndex = 1;
        const pattern = /^(\S+[.\\)]?)\s*(.+)$/; 
      // Handle question line with or without number prefix (e.g., "১৩.", "১৩)", or none)
      questionText = questionText.match(pattern)[2]


      // Extract options, handling prefixes (e.g., "ক)", "ক.", "ক")
      const optionLines: string[] = [];
      

      for (let i = optionStartIndex; i < lines.length; i++) {
        const line = lines[i];
        const optionMatch = line.match(pattern);

        if (optionMatch && optionMatch[2]) {
          optionLines.push(optionMatch[2].trim());
        }
      }

      if (questionText && optionLines.length >= 2) {
        return {
          question: questionText,
          options: optionLines,
        };
      }

      return null;
    } catch (error) {
      console.error("Parse error:", error);
      return null;
    }
  };

  const handleParse = () => {
    const parsed = parseQuestion(inputText);
    if (parsed) {
      onParsed(parsed);
      setInputText("");
      onError("");
    } else {
      onError(
        "Could not parse the question format. Please check the format and try again."
      );
    }
  };

  if (!isEnabled) {
    return (
      <div className="flex items-center space-x-2 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700">
        <Switch
          checked={isEnabled}
          onCheckedChange={setIsEnabled}
          id="auto-parse"
        />
        <Label htmlFor="auto-parse" className="text-zinc-300">
          Enable Auto Question Parser
        </Label>
      </div>
    );
  }

  return (
    <Card className="bg-zinc-800/50 border-zinc-700 mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-zinc-100 flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Auto Question Parser
          </CardTitle>
          <Switch
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
            id="auto-parse-header"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-zinc-300 mb-2 block">
            Paste your question text here
          </Label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Paste questions in these formats:

১৩. google.com কী?
ক) ইঞ্জিন
খ) সার্চ ইঞ্জিন
গ) প্রোটোকল
ঘ) আইপি অ্যাড্রেস

or

১৩) google.com কী?
ক. ইঞ্জিন
খ. সার্চ ইঞ্জিন
গ. প্রোটোকল
ঘ. আইপি অ্যাড্রেস

or

google.com কী?
ক ইঞ্জিন
খ) সার্চ ইঞ্জিন
গ. প্রোটোকল
ঘ. আইপি অ্যাড্রেস`}
            className="bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 min-h-[200px] font-mono text-sm"
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleParse}
            disabled={!inputText.trim()}
            variant="outline"
            className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Parse Question
          </Button>
          <Button
            type="button"
            onClick={() => setInputText("")}
            variant="outline"
            size="sm"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Clear
          </Button>
        </div>

        <div className="text-xs text-zinc-500 bg-zinc-900 p-3 rounded border border-zinc-700">
          <strong>Supported formats:</strong>
          <br />• Question with or without number prefix (e.g., ১৩., ১৩))
          <br />• Options with Bangla prefixes (ক, খ, গ, ঘ) followed by ., ), or nothing
          <br />• Automatically extracts only the question and option text, ignoring prefixes
          <br />• Supports multi-line formats
          <br />• Flexible spacing
        </div>
      </CardContent>
    </Card>
  );
};