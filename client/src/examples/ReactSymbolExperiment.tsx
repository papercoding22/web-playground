import React, { useState } from "react";

const JSONSymbolExperiment: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);

  const runExperiments = () => {
    const logs: string[] = [];

    // Clear previous results
    setResults([]);
    console.clear();

    logs.push("=== EXPERIMENT 1: What happens when we stringify a Symbol? ===");

    // Create an object with a Symbol
    const objectWithSymbol = {
      name: "test",
      $$typeof: Symbol.for("react.element"),
      data: "some data",
    };

    logs.push("Original object:");
    console.log("Original object:", objectWithSymbol);
    logs.push(
      JSON.stringify(
        {
          name: objectWithSymbol.name,
          $$typeof: objectWithSymbol.$$typeof?.toString(),
          data: objectWithSymbol.data,
        },
        null,
        2
      )
    );

    // Try to stringify it
    const jsonString = JSON.stringify(objectWithSymbol);
    logs.push("\nJSON.stringify() result:");
    logs.push(`"${jsonString}"`);
    console.log("JSON string:", jsonString);

    logs.push("\n=== EXPERIMENT 2: What happens when we parse it back? ===");

    // Parse it back
    const parsedObject = JSON.parse(jsonString);
    logs.push("Parsed object:");
    console.log("Parsed object:", parsedObject);
    logs.push(JSON.stringify(parsedObject, null, 2));

    logs.push("\n=== EXPERIMENT 3: Comparison ===");
    logs.push(`Original $$typeof: ${objectWithSymbol.$$typeof?.toString()}`);
    logs.push(`Parsed $$typeof: ${parsedObject.$$typeof}`);
    logs.push(
      `Are they equal? ${objectWithSymbol.$$typeof === parsedObject.$$typeof}`
    );

    console.log("Original $$typeof:", objectWithSymbol.$$typeof);
    console.log("Parsed $$typeof:", parsedObject.$$typeof);
    console.log(
      "Are they equal?",
      objectWithSymbol.$$typeof === parsedObject.$$typeof
    );

    logs.push(
      "\n=== EXPERIMENT 4: Attacker tries to add $$typeof manually ==="
    );

    // What if attacker tries to add $$typeof in JSON?
    const maliciousJSON = `{
      "type": "div",
      "$$typeof": "Symbol(react.element)",
      "props": {
        "dangerouslySetInnerHTML": {
          "__html": "<script>alert('XSS')</script>"
        }
      }
    }`;

    logs.push("Malicious JSON (attacker adds $$typeof as string):");
    logs.push(maliciousJSON);

    const maliciousParsed = JSON.parse(maliciousJSON);
    logs.push("\nParsed malicious object:");
    console.log("Malicious parsed:", maliciousParsed);
    logs.push(JSON.stringify(maliciousParsed, null, 2));

    logs.push(`\nMalicious $$typeof value: "${maliciousParsed.$$typeof}"`);
    logs.push(`Type: ${typeof maliciousParsed.$$typeof}`);
    logs.push(
      `Is it a real Symbol? ${typeof maliciousParsed.$$typeof === "symbol"}`
    );

    console.log("Malicious $$typeof:", maliciousParsed.$$typeof);
    console.log("Type:", typeof maliciousParsed.$$typeof);

    logs.push("\n=== EXPERIMENT 5: React's validation ===");

    const REACT_ELEMENT_TYPE = Symbol.for("react.element");
    const realElement = React.createElement("div", {
      children: "Real element",
    });

    logs.push(
      `Real React element $$typeof: ${realElement.$$typeof?.toString()}`
    );
    logs.push(`Expected symbol: ${REACT_ELEMENT_TYPE.toString()}`);
    logs.push(
      `Real element passes validation: ${
        realElement.$$typeof === REACT_ELEMENT_TYPE
      }`
    );
    logs.push(
      `Malicious object passes validation: ${
        maliciousParsed.$$typeof === REACT_ELEMENT_TYPE
      }`
    );

    console.log("Real element $$typeof:", realElement.$$typeof);
    console.log(
      "Real element passes:",
      realElement.$$typeof === REACT_ELEMENT_TYPE
    );
    console.log(
      "Malicious passes:",
      maliciousParsed.$$typeof === REACT_ELEMENT_TYPE
    );

    setResults(logs);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-6">
          The JSON + Symbol Mystery Explained
        </h3>

        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border-l-4 border-amber-500 mb-6">
          <h4 className="text-xl font-semibold text-amber-800 mb-3">
            🔍 Your Confusion is Valid!
          </h4>
          <p className="text-amber-700 mb-2">
            You're asking exactly the right question:
          </p>
          <div className="bg-white p-3 rounded italic text-amber-800">
            "If JSON can have a $$typeof property, why can't attackers just add
            it?"
          </div>
        </div>

        <button
          onClick={runExperiments}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors mb-6 text-lg"
        >
          🧪 Run All Experiments (Check Console Too!)
        </button>

        {results.length > 0 && (
          <div className="bg-black text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto mb-6">
            {results.map((line, index) => (
              <div key={index} className="mb-1">
                {line}
              </div>
            ))}
          </div>
        )}

        {/* Key Revelations */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border-l-4 border-red-500">
            <h4 className="text-lg font-semibold text-red-800 mb-3">
              ❌ What Attackers Try
            </h4>
            <div className="space-y-2 text-sm text-red-700">
              <p>• Add `"$$typeof": "Symbol(react.element)"` to JSON</p>
              <p>
                • Result: It's just a <strong>string</strong>, not a Symbol!
              </p>
              <p>• Type: `typeof "Symbol(...)" === "string"` ✅</p>
              <p>• React validation: `"string" === Symbol` ❌</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-l-4 border-green-500">
            <h4 className="text-lg font-semibold text-green-800 mb-3">
              ✅ How React Elements Work
            </h4>
            <div className="space-y-2 text-sm text-green-700">
              <p>• React creates: `$$typeof: Symbol.for('react.element')`</p>
              <p>• Result: Actual Symbol object</p>
              <p>• Type: `typeof Symbol(...) === "symbol"` ✅</p>
              <p>• React validation: `Symbol === Symbol` ✅</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg border-l-4 border-purple-500 mt-6">
          <h4 className="text-xl font-semibold text-purple-800 mb-4">
            🎯 The Crucial Point
          </h4>
          <div className="space-y-3 text-purple-700">
            <p>
              <strong>JSON can contain a property NAMED "$$typeof"</strong> ✅
            </p>
            <p>
              <strong>But JSON cannot contain an actual Symbol VALUE</strong> ❌
            </p>
            <p>
              So when attackers add `"$$typeof": "anything"`, it's just a string
              that looks like a symbol name.
            </p>
            <p>
              React's check:{" "}
              <code className="bg-purple-100 px-2 py-1 rounded">
                element.$$typeof === Symbol.for('react.element')
              </code>
            </p>
            <p>String vs Symbol comparison always fails! 🛡️</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JSONSymbolExperiment;
