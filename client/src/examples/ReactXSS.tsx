import React, { useState } from "react";

// Simulate a blog post component that renders user content
const BlogPost: React.FC<{ post: any }> = ({ post }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{post.title}</h2>
      <div className="text-gray-700">
        {/* This is where the vulnerability would be */}
        {post.content}
      </div>
    </div>
  );
};

const RealisticXSSScenario: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<
    "safe" | "vulnerable" | "attack"
  >("safe");

  // Simulate different types of data
  const scenarios = {
    safe: {
      title: "Safe Scenario",
      description: "Normal user content created by React",
      posts: [
        {
          id: 1,
          title: "My Blog Post",
          content: <p>This is normal content created by JSX.</p>,
        },
      ],
    },
    vulnerable: {
      title: "Vulnerable Scenario (Pre-React 0.14)",
      description: "App treats JSON data as React elements",
      posts: [
        {
          id: 1,
          title: "Innocent Looking Post",
          // This object came from JSON.parse() - no $$typeof!
          content: {
            type: "div",
            props: {
              children: "This looks innocent but came from JSON.parse()",
            },
          },
        },
      ],
    },
    attack: {
      title: "Attack Scenario",
      description: "Malicious JSON designed to execute XSS",
      posts: [
        {
          id: 1,
          title: "Malicious Post",
          // This is what an attacker would inject
          content: {
            type: "div",
            props: {
              dangerouslySetInnerHTML: {
                __html:
                  '<img src="x" onerror="alert(\'XSS Attack via JSON!\')" />',
              },
            },
          },
        },
      ],
    },
  };

  const currentData = scenarios[currentScenario];

  // Simulate React's security check
  const isReactElement = (obj: any): boolean => {
    const REACT_ELEMENT_TYPE = Symbol.for("react.element");
    return obj && obj.$$typeof === REACT_ELEMENT_TYPE;
  };

  const renderContent = (content: any) => {
    if (React.isValidElement(content)) {
      return content; // Safe React element
    }

    if (typeof content === "object" && content !== null) {
      // This is where the security check happens
      if (isReactElement(content)) {
        return content; // Has valid $$typeof
      } else {
        // Block potentially malicious objects
        return (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            🚫 <strong>Blocked:</strong> Object lacks valid $$typeof - potential
            security threat
          </div>
        );
      }
    }

    return content; // Regular string/number/etc
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-6">
          Realistic XSS Attack Scenario
        </h3>

        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border-l-4 border-amber-500 mb-6">
          <h4 className="text-xl font-semibold text-amber-800 mb-3">
            🌍 Real-World Context
          </h4>
          <p className="text-amber-700">
            Most web apps fetch user content from APIs, databases, or other
            external sources. This data goes through JSON
            serialization/deserialization, which strips any Symbols.
          </p>
        </div>

        {/* Scenario Selector */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setCurrentScenario("safe")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentScenario === "safe"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            ✅ Safe Scenario
          </button>
          <button
            onClick={() => setCurrentScenario("vulnerable")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentScenario === "vulnerable"
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            ⚠️ Vulnerable App
          </button>
          <button
            onClick={() => setCurrentScenario("attack")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentScenario === "attack"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            🚨 Attack Attempt
          </button>
        </div>

        {/* Current Scenario Display */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-2">
            {currentData.title}
          </h4>
          <p className="text-gray-600 mb-4">{currentData.description}</p>

          {/* Simulate the data flow */}
          <div className="bg-white p-4 rounded border mb-4">
            <h5 className="font-medium text-gray-700 mb-2">
              Data Flow Simulation:
            </h5>
            <div className="font-mono text-sm space-y-1">
              <div>1. User submits content to server</div>
              <div>
                2. Server stores as JSON:{" "}
                <code className="bg-gray-200 px-2 py-1 rounded">
                  JSON.stringify(data)
                </code>
              </div>
              <div>
                3. Client fetches data:{" "}
                <code className="bg-gray-200 px-2 py-1 rounded">
                  JSON.parse(response)
                </code>
              </div>
              <div>
                4. React tries to render:{" "}
                <code className="bg-gray-200 px-2 py-1 rounded">
                  {"<BlogPost post={data} />"}
                </code>
              </div>
            </div>
          </div>

          {/* Show the actual content */}
          <div className="space-y-4">
            {currentData.posts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4">
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">
                    Content Object Structure:
                  </h5>
                  <pre className="bg-black text-green-400 p-3 rounded text-sm overflow-x-auto">
                    {JSON.stringify(post, null, 2)}
                  </pre>
                </div>

                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">
                    Security Check:
                  </h5>
                  <div className="bg-gray-100 p-3 rounded">
                    <code className="text-sm">
                      content.$$typeof === Symbol.for('react.element'):{" "}
                      {String(isReactElement(post.content))}
                    </code>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-700 mb-2">
                    Rendered Result:
                  </h5>
                  <div className="border-2 border-dashed border-gray-300 p-4 rounded">
                    <BlogPost
                      post={{ ...post, content: renderContent(post.content) }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border-l-4 border-purple-500">
          <h4 className="text-xl font-semibold text-purple-800 mb-4">
            🎯 Why JSON.stringify/parse Matter
          </h4>
          <ul className="space-y-2 text-purple-700">
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>
                <strong>Real apps use JSON everywhere:</strong> APIs, databases,
                localStorage, URL params
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>
                <strong>JSON.parse() cannot create Symbols:</strong> Any data
                from JSON lacks $$typeof
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>
                <strong>Attackers exploit this gap:</strong> They inject
                malicious "element-like" objects
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>
                <strong>React's check is the last line of defense:</strong>{" "}
                Blocks objects without valid $$typeof
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RealisticXSSScenario;
