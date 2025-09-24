import React, { useState, useEffect } from 'react';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';
import remarkBreaks from 'remark-breaks';
import { Copy, Check, Play, ExternalLink, AlertCircle, Info, CheckCircle, XCircle, Terminal, Code2 } from 'lucide-react';
import 'katex/dist/katex.min.css';
import 'prismjs/themes/prism-tomorrow.css';

const MarkdownRenderer = ({ content }) => {
  const [copiedCode, setCopiedCode] = useState('');
  const [MDXContent, setMDXContent] = useState(null) as any;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Copy to clipboard functionality
  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Custom components for MDX
  const components = {
    // Enhanced code blocks
    pre: ({ children, ...props }) => {
      const codeElement:any = React.Children.toArray(children)[0];
      const code = codeElement?.props?.children || '';
      const language = codeElement?.props?.className?.replace('language-', '') || 'text';
      const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;

      return (
        <div className="relative group my-6 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
          <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Code2 size={16} className="text-gray-400" />
              <span className="text-sm text-gray-300 font-mono capitalize">{language}</span>
            </div>
            <button
              onClick={() => copyToClipboard(code, codeId)}
              className="flex items-center gap-1 px-2 py-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              {copiedCode === codeId ? <Check size={16} /> : <Copy size={16} />}
              <span className="text-xs">{copiedCode === codeId ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-sm" {...props}>
            {children}
          </pre>
        </div>
      );
    },

    // Enhanced inline code
    code: ({ children, ...props }) => (
      <code 
        className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded font-mono text-sm border"
        {...props}
      >
        {children}
      </code>
    ),

    // Custom headings with anchors
    h1: ({ children, ...props }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b-2 border-gray-200 pb-2" {...props}>
        {children}
      </h1>
    ),

    h2: ({ children, ...props }) => (
      <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800" {...props}>
        {children}
      </h2>
    ),

    h3: ({ children, ...props }) => (
      <h3 className="text-xl font-semibold mt-5 mb-2" {...props}>
        {children}
      </h3>
    ),

    // Enhanced blockquotes with icons
    blockquote: ({ children, ...props }) => (
      <blockquote className="border-l-4 border-blue-400 bg-blue-50 pl-4 pr-4 py-2 my-4 rounded-r-lg" {...props}>
        <div className="flex items-start gap-2">
          <Info size={16} className="text-blue-500 mt-1 flex-shrink-0" />
          <div className="text-blue-800">{children}</div>
        </div>
      </blockquote>
    ),

    // Enhanced tables
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden" {...props}>
          {children}
        </table>
      </div>
    ),

    thead: ({ children, ...props }) => (
      <thead className="bg-gray-50" {...props}>
        {children}
      </thead>
    ),

    th: ({ children, ...props }) => (
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props}>
        {children}
      </th>
    ),

    td: ({ children, ...props }) => (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-t border-gray-200" {...props}>
        {children}
      </td>
    ),

    // Enhanced links
    a: ({ children, href, ...props }) => (
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
        {...props}
      >
        {children}
        <ExternalLink size={12} className="opacity-70" />
      </a>
    ),

    // Enhanced lists
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-inside space-y-2 my-4 ml-4" {...props}>
        {children}
      </ul>
    ),

    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside space-y-2 my-4 ml-4" {...props}>
        {children}
      </ol>
    ),

    li: ({ children, ...props }) => (
      <li className=" leading-relaxed" {...props}>
        {children}
      </li>
    ),

    // Paragraphs
    p: ({ children, ...props }) => (
      <p className="mb-4 leading-relaxed " {...props}>
        {children}
      </p>
    ),

    // Horizontal rule
    hr: ({ ...props }) => (
      <hr className="my-8 border-t-2 border-gray-200" {...props} />
    ),

    // Custom alert components
    Alert: ({ type = 'info', children }) => {
      const alertStyles = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        success: 'bg-green-50 border-green-200 text-green-800'
      };

      const icons = {
        info: <Info size={20} />,
        warning: <AlertCircle size={20} />,
        error: <XCircle size={20} />,
        success: <CheckCircle size={20} />
      };

      return (
        <div className={`border-l-4 p-4 my-4 rounded-r-lg ${alertStyles[type]}`}>
          <div className="flex items-start gap-3">
            {icons[type]}
            <div className="flex-1">{children}</div>
          </div>
        </div>
      );
    },

    // Code execution component (for demo purposes)
    CodeRunner: ({ language, children }) => {
      const [output, setOutput] = useState('');
      const [running, setRunning] = useState(false);

      const runCode = () => {
        setRunning(true);
        // Simulate code execution
        setTimeout(() => {
          setOutput(`Output: Code executed successfully!\nLanguage: ${language}`);
          setRunning(false);
        }, 1000);
      };

      return (
        <div className="border border-gray-200 rounded-lg overflow-hidden my-4">
          <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Code Runner - {language}</span>
            <button
              onClick={runCode}
              disabled={running}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {running ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div> : <Play size={16} />}
              {running ? 'Running...' : 'Run'}
            </button>
          </div>
          <pre className="p-4 bg-gray-900 text-white text-sm overflow-x-auto">
            <code>{children}</code>
          </pre>
          {output && (
            <div className="bg-gray-100 p-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Terminal size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Output:</span>
              </div>
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">{output}</pre>
            </div>
          )}
        </div>
      );
    },

    // Mermaid diagram component
    // Mermaid: ({ children }) => {
    //   const [svg, setSvg] = useState('');
    //   const diagramId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

    //   useEffect(() => {
    //     const renderDiagram = async () => {
    //       if (window.mermaid) {
    //         try {
    //           const { svg } = await window.mermaid.render(diagramId, children);
    //           setSvg(svg);
    //         } catch (error) {
    //           console.error('Mermaid rendering error:', error);
    //           setSvg(`<div class="error">Error rendering diagram: ${error.message}</div>`);
    //         }
    //       }
    //     };

    //     // Load Mermaid if not already loaded
    //     if (!window.mermaid) {
    //       const script = document.createElement('script');
    //       script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js';
    //       script.onload = () => {
    //         window.mermaid.initialize({ 
    //           startOnLoad: false,
    //           theme: 'neutral'
    //         });
    //         renderDiagram();
    //       };
    //       document.head.appendChild(script);
    //     } else {
    //       renderDiagram();
    //     }
    //   }, [children, diagramId]);

    //   return (
    //     <div className="my-6 p-4 bg-white border border-gray-200 rounded-lg">
    //       <div className="text-center" dangerouslySetInnerHTML={{ __html: svg }} />
    //     </div>
    //   );
    // }
  };

  // Process content with MDX
  useEffect(() => {
    const processContent = async () => {
      if (!content) {
        setMDXContent(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Process the content with MDX
        const { default: Content } = await evaluate(content, {
          ...runtime,
          remarkPlugins: [
            remarkGfm,
            remarkMath,
            remarkBreaks
          ],
          rehypePlugins: [
            rehypeKatex,
            rehypePrism
          ]
        });

        setMDXContent(() => Content);
      } catch (err:any) {
        console.error('MDX processing error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    processContent();
  }, [content]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-gray-600">Processing content...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
        <div className="flex items-center gap-2 text-red-800">
          <XCircle size={20} />
          <span className="font-medium">Error processing content</span>
        </div>
        <p className="text-red-700 mt-2 text-sm">{error}</p>
        <details className="mt-3">
          <summary className="text-red-600 cursor-pointer text-sm">Show raw content</summary>
          <pre className="mt-2 p-3 bg-red-100 rounded text-xs overflow-x-auto">
            {content}
          </pre>
        </details>
      </div>
    );
  }

  if (!MDXContent) {
    return (
      <div className="text-gray-500 text-center py-4">
        No content to display
      </div>
    );
  }

  return (
    <div className="mdx-renderer prose prose-gray max-w-none">
      <MDXContent components={components} />
    </div>
  );
};

export default MarkdownRenderer;