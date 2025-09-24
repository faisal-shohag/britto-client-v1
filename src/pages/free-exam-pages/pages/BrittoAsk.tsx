import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import MarkdownRenderer from "@/utils/markdown-renderer";
import { GoogleGenAI } from "@google/genai";
import { useState } from "react";
import { Spinner } from "../components/Splash";

const gemini = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });

const ask = async (contents: string) =>
  await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
  });
const BrittoAsk = () => {
  const [result, setResult] = useState("");
  const [content, setContent] = useState("");
  const  [loading, setLoading] = useState(false)

  const handleAsk = async (contents) => {
    setLoading(true)
    try {
      const res: any = await ask(contents);
      setResult(res.text)
      console.log(res.text)
      setLoading(false)

    } catch (error) {
        setLoading(false)
      console.log(error);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>Britto Ask</CardHeader>
        <CardContent>
          <Textarea
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ask"
          />
          <Button onClick={() => handleAsk(content)}>{loading && <Spinner/>}Ask</Button>
        </CardContent>
      </Card>
   { result &&    <Card>
        <CardContent>
            <MarkdownRenderer content={result}/>
        </CardContent>
      </Card>}
    </div>
  );
};

export default BrittoAsk;
