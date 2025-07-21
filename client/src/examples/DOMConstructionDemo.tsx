import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Hash,
  Code,
  TreePine,
} from "lucide-react";

interface Token {
  type: "start-tag" | "end-tag" | "text" | "attribute";
  name?: string;
  value?: string;
  attributes?: { [key: string]: string };
}

interface DOMNode {
  type: "element" | "text";
  tagName?: string;
  textContent?: string;
  attributes?: { [key: string]: string };
  children: DOMNode[];
  id: string;
}

const DOMConstructionDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [htmlInput, setHtmlInput] = useState<string>(`<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My Page</title>
  </head>
  <body>
    <div class="container">
      <h1>Hello World!</h1>
      <p>Welcome to my website.</p>
    </div>
  </body>
</html>`);

  // Step 1: Convert to bytes
  const [bytes, setBytes] = useState<number[]>([]);

  // Step 2: Convert to characters
  const [characters, setCharacters] = useState<string[]>([]);

  // Step 3: Tokenize
  const [tokens, setTokens] = useState<Token[]>([]);

  // Step 4: Create DOM tree
  const [domTree, setDomTree] = useState<DOMNode | null>(null);

  const steps = [
    { id: 0, title: "Raw HTML Input", icon: <FileText className="w-5 h-5" /> },
    { id: 1, title: "Byte Conversion", icon: <Hash className="w-5 h-5" /> },
    {
      id: 2,
      title: "Character Conversion",
      icon: <FileText className="w-5 h-5" />,
    },
    { id: 3, title: "Tokenization", icon: <Code className="w-5 h-5" /> },
    {
      id: 4,
      title: "Tree Construction",
      icon: <TreePine className="w-5 h-5" />,
    },
  ];

  // Convert HTML to bytes (UTF-8)
  const convertToBytes = (html: string): number[] => {
    const encoder = new TextEncoder();
    return Array.from(encoder.encode(html));
  };

  // Convert bytes to characters
  const convertToCharacters = (byteArray: number[]): string[] => {
    const decoder = new TextDecoder("utf-8");
    const uint8Array = new Uint8Array(byteArray);
    return decoder.decode(uint8Array).split("");
  };

  // Simple HTML tokenizer
  const tokenizeHTML = (html: string): Token[] => {
    const tokens: Token[] = [];
    let i = 0;

    while (i < html.length) {
      if (html[i] === "<") {
        // Handle tags
        let tagEnd = html.indexOf(">", i);
        if (tagEnd === -1) break;

        const tagContent = html.slice(i + 1, tagEnd);

        if (tagContent.startsWith("/")) {
          // End tag
          tokens.push({
            type: "end-tag",
            name: tagContent.slice(1).trim(),
          });
        } else if (tagContent.startsWith("!")) {
          // DOCTYPE or comment - skip for simplicity
        } else {
          // Start tag
          const parts = tagContent.split(/\s+/);
          const tagName = parts[0];
          const attributes: { [key: string]: string } = {};

          // Parse attributes
          for (let j = 1; j < parts.length; j++) {
            const attrMatch = parts[j].match(/(\w+)=["']([^"']+)["']/);
            if (attrMatch) {
              attributes[attrMatch[1]] = attrMatch[2];
            }
          }

          tokens.push({
            type: "start-tag",
            name: tagName,
            attributes:
              Object.keys(attributes).length > 0 ? attributes : undefined,
          });
        }

        i = tagEnd + 1;
      } else {
        // Handle text content
        let textEnd = html.indexOf("<", i);
        if (textEnd === -1) textEnd = html.length;

        const textContent = html.slice(i, textEnd).trim();
        if (textContent.length > 0) {
          tokens.push({
            type: "text",
            value: textContent,
          });
        }

        i = textEnd;
      }
    }

    return tokens;
  };

  // Build DOM tree from tokens
  const buildDOMTree = (tokens: Token[]): DOMNode | null => {
    const stack: DOMNode[] = [];
    let nodeId = 0;

    const createNode = (
      type: "element" | "text",
      tagName?: string,
      textContent?: string,
      attributes?: { [key: string]: string }
    ): DOMNode => {
      return {
        type,
        tagName,
        textContent,
        attributes,
        children: [],
        id: `node-${nodeId++}`,
      };
    };

    let root: DOMNode | null = null;

    for (const token of tokens) {
      if (token.type === "start-tag" && token.name) {
        const node = createNode(
          "element",
          token.name,
          undefined,
          token.attributes
        );

        if (stack.length === 0) {
          root = node;
        } else {
          stack[stack.length - 1].children.push(node);
        }

        // Don't push self-closing tags to stack
        if (
          !["br", "hr", "img", "input", "meta", "link"].includes(token.name)
        ) {
          stack.push(node);
        }
      } else if (token.type === "end-tag") {
        if (stack.length > 0) {
          stack.pop();
        }
      } else if (token.type === "text" && token.value) {
        const textNode = createNode("text", undefined, token.value);
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(textNode);
        }
      }
    }

    return root;
  };

  // Process the HTML through all steps
  const processHTML = (step: number) => {
    const cleanHtml = htmlInput.trim();

    if (step >= 1) {
      const byteArray = convertToBytes(cleanHtml);
      setBytes(byteArray.slice(0, 100)); // Limit for display
    }

    if (step >= 2) {
      const byteArray = convertToBytes(cleanHtml);
      const chars = convertToCharacters(byteArray);
      setCharacters(chars.slice(0, 200)); // Limit for display
    }

    if (step >= 3) {
      const tokenArray = tokenizeHTML(cleanHtml);
      setTokens(tokenArray);
    }

    if (step >= 4) {
      const tokenArray = tokenizeHTML(cleanHtml);
      const tree = buildDOMTree(tokenArray);
      setDomTree(tree);
    }
  };

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev < steps.length - 1 ? prev + 1 : 0;
          processHTML(next);
          return next;
        });
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, htmlInput]);

  // Manual step change
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    processHTML(step);
  };

  // Initialize with first step
  useEffect(() => {
    processHTML(currentStep);
  }, [htmlInput]);

  const renderDOMNode = (node: DOMNode, depth: number = 0): React.ReactNode => {
    const indent = depth * 20;

    if (node.type === "text") {
      return (
        <div
          key={node.id}
          className="flex items-center py-1 text-blue-600"
          style={{ marginLeft: `${indent}px` }}
        >
          <span className="text-gray-400 mr-2">📄</span>
          <span className="bg-blue-50 px-2 py-1 rounded text-sm">
            "{node.textContent}"
          </span>
        </div>
      );
    }

    return (
      <div key={node.id} style={{ marginLeft: `${indent}px` }}>
        <div className="flex items-center py-1">
          <span className="text-gray-400 mr-2">🏷️</span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">
            &lt;{node.tagName}&gt;
          </span>
          {node.attributes && (
            <span className="ml-2 text-purple-600 text-xs">
              {Object.entries(node.attributes).map(([key, value]) => (
                <span key={key} className="ml-1">
                  {key}="{value}"
                </span>
              ))}
            </span>
          )}
        </div>
        {node.children.map((child) => renderDOMNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🌐 DOM Construction Process
        </h1>
        <p className="text-gray-600 text-lg">
          Watch how browsers convert HTML bytes into the DOM tree structure
        </p>
      </div>

      {/* Controls */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(0);
              processHTML(0);
            }}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => handleStepChange(step.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentStep === step.id
                    ? "bg-blue-500 text-white shadow-lg scale-105"
                    : currentStep > step.id
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {step.icon}
                <span className="font-medium">{step.title}</span>
              </button>
              {index < steps.length - 1 && (
                <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* HTML Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            HTML Input (Edit to see changes):
          </label>
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your HTML here..."
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Step 1: Byte Conversion */}
        {currentStep >= 1 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Step 1: Byte Conversion (UTF-8)
            </h3>
            <p className="text-red-700 mb-4">
              Raw HTML converted to bytes using UTF-8 encoding. Each character
              becomes 1-4 bytes.
            </p>
            <div className="bg-white rounded p-4 max-h-40 overflow-y-auto">
              <div className="font-mono text-xs grid grid-cols-10 gap-1">
                {bytes.map((byte, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-800 px-1 py-0.5 rounded text-center"
                    title={`Byte ${index}: ${byte} (${String.fromCharCode(
                      byte
                    )})`}
                  >
                    {byte}
                  </span>
                ))}
                {bytes.length === 100 && (
                  <span className="text-red-500 col-span-10 text-center">
                    ... (showing first 100 bytes)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Character Conversion */}
        {currentStep >= 2 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Step 2: Character Conversion
            </h3>
            <p className="text-orange-700 mb-4">
              Bytes decoded back into Unicode characters according to UTF-8
              specification.
            </p>
            <div className="bg-white rounded p-4 max-h-40 overflow-y-auto">
              <div className="font-mono text-sm break-all">
                {characters.map((char, index) => (
                  <span
                    key={index}
                    className={`${
                      char === "<" || char === ">"
                        ? "bg-orange-200 text-orange-900"
                        : char === " "
                        ? "bg-gray-100"
                        : char === "\n"
                        ? "bg-blue-100"
                        : "bg-orange-100 text-orange-800"
                    } inline-block m-0.5 px-1 rounded`}
                    title={`Character: ${char} (${char.charCodeAt(0)})`}
                  >
                    {char === " " ? "␣" : char === "\n" ? "↵" : char}
                  </span>
                ))}
                {characters.length === 200 && (
                  <div className="text-orange-500 text-center mt-2">
                    ... (showing first 200 characters)
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Tokenization */}
        {currentStep >= 3 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Step 3: Tokenization
            </h3>
            <p className="text-yellow-700 mb-4">
              Characters grouped into meaningful tokens: start tags, end tags,
              text content, and attributes.
            </p>
            <div className="bg-white rounded p-4 max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {tokens.map((token, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-sm font-mono ${
                      token.type === "start-tag"
                        ? "bg-green-100 text-green-800"
                        : token.type === "end-tag"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase text-xs">
                        {token.type}
                      </span>
                      {token.name && (
                        <span className="bg-white px-2 py-1 rounded">
                          {token.name}
                        </span>
                      )}
                      {token.value && (
                        <span className="bg-white px-2 py-1 rounded">
                          "{token.value}"
                        </span>
                      )}
                    </div>
                    {token.attributes && (
                      <div className="mt-1 text-xs text-purple-600">
                        Attributes: {JSON.stringify(token.attributes)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: DOM Tree */}
        {currentStep >= 4 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <TreePine className="w-5 h-5" />
              Step 4: DOM Tree Construction
            </h3>
            <p className="text-green-700 mb-4">
              Tokens converted into a hierarchical tree structure representing
              parent-child relationships.
            </p>
            <div className="bg-white rounded p-4 max-h-96 overflow-y-auto">
              {domTree ? (
                <div className="font-mono text-sm">
                  {renderDOMNode(domTree)}
                </div>
              ) : (
                <div className="text-gray-500 text-center">
                  No valid DOM tree generated
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Educational Notes */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-blue-800 mb-4">
          🧠 Key Learning Points
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-700">
          <div>
            <h4 className="font-bold mb-2">Why This Process Matters:</h4>
            <ul className="space-y-1 text-sm">
              <li>
                • **Streaming**: Browser can start processing before full
                download
              </li>
              <li>
                • **Incremental**: DOM builds progressively as bytes arrive
              </li>
              <li>• **Efficient**: Each step optimizes for the next stage</li>
              <li>
                • **Standards-based**: Follows HTML5 specification exactly
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">TypeScript Insights:</h4>
            <ul className="space-y-1 text-sm">
              <li>• **Type Safety**: Tokens have strict interfaces</li>
              <li>• **Tree Structure**: Recursive node definitions</li>
              <li>• **Memory Efficient**: References instead of copying</li>
              <li>• **Real-time**: Processing happens as you type</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DOMConstructionDemo;
