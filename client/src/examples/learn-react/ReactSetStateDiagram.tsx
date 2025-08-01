import React from "react";

interface StepProps {
  stepNumber: number;
  title: string;
  code: string;
  description: string;
}

interface TimelineItemProps {
  time: string;
  title: string;
  code: string;
}

interface QueueItemProps {
  children: React.ReactNode;
}

const Step: React.FC<StepProps> = ({
  stepNumber,
  title,
  code,
  description,
}) => (
  <div className="relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 min-w-[250px] text-center shadow-2xl border border-white/20">
    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
      {stepNumber}
    </div>
    <h3 className="text-lg font-semibold mb-3 text-white">{title}</h3>
    <div className="bg-black/30 rounded-lg p-3 mb-3 font-mono text-sm text-cyan-200 border-l-4 border-cyan-400">
      {code}
    </div>
    <p className="text-purple-100 text-sm">{description}</p>
  </div>
);

const Arrow: React.FC = () => (
  <div className="text-4xl text-cyan-400 font-bold drop-shadow-lg">→</div>
);

const TimelineItem: React.FC<TimelineItemProps> = ({ time, title, code }) => (
  <div className="flex items-center mb-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
    <div className="bg-red-400 text-white px-3 py-1 rounded-full mr-4 font-bold min-w-[60px] text-center text-sm">
      {time}
    </div>
    <div className="flex-1">
      <div className="font-semibold text-white mb-1">{title}</div>
      <div className="bg-black/30 rounded-lg p-2 font-mono text-sm text-cyan-200">
        {code}
      </div>
    </div>
  </div>
);

const QueueItem: React.FC<QueueItemProps> = ({ children }) => (
  <div className="bg-gradient-to-r from-pink-400 to-red-500 text-white px-4 py-2 rounded-xl shadow-lg font-semibold">
    {children}
  </div>
);

const ReactStateDiagrams: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
          🚀 React State Management Under the Hood
        </h1>

        {/* First Render Diagram */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-12 border border-white/20 shadow-2xl">
          <h2 className="text-3xl text-cyan-400 font-bold text-center mb-8">
            📋 Diagram 1: First Render + useState Call
          </h2>

          {/* First Row of Steps */}
          <div className="flex items-center justify-center flex-wrap gap-6 mb-12">
            <Step
              stepNumber={1}
              title="React Starts Render"
              code="React.render(<MyComponent />)"
              description="React creates Fiber node for component"
            />
            <Arrow />
            <Step
              stepNumber={2}
              title="Set Active Component"
              code="currentlyRenderingFiber = fiberNode"
              description="React points to this component"
            />
            <Arrow />
            <Step
              stepNumber={3}
              title="Call Component Function"
              code="MyComponent()"
              description="Execute your component code"
            />
          </div>

          {/* Second Row of Steps */}
          <div className="flex items-center justify-center flex-wrap gap-6 mb-8">
            <Step
              stepNumber={4}
              title="useState Called"
              code='useState("Alice")'
              description="First hook call detected"
            />
            <Arrow />
            <Step
              stepNumber={5}
              title="Check Hook Index"
              code="hookIndex = 0"
              description="This is the 1st useState call"
            />
            <Arrow />
            <Step
              stepNumber={6}
              title="Create Hook"
              code='hooks[0] = { state: "Alice", setState: fn }'
              description="Store state + create setter"
            />
          </div>

          {/* Fiber Node Representation */}
          <div className="bg-gradient-to-br from-pink-400 to-purple-400 text-gray-900 rounded-2xl p-6 shadow-xl border-2 border-white/30">
            <h3 className="text-xl font-bold mb-4">
              🗂️ Fiber Node After First Render
            </h3>
            <div className="bg-black/20 rounded-xl p-4 font-mono text-sm">
              <div>ComponentFiber = {`{`}</div>
              <div className="ml-4">type: MyComponent,</div>
              <div className="ml-4">hooks: [</div>
              <div className="ml-8">{`{ state: "Alice", setState: setName }`}</div>
              <div className="ml-4">],</div>
              <div className="ml-4">currentlyRendering: false</div>
              <div>{`}`}</div>
            </div>
          </div>
        </div>

        {/* setState Call Diagram */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-12 border border-white/20 shadow-2xl">
          <h2 className="text-3xl text-cyan-400 font-bold text-center mb-8">
            ⚡ Diagram 2: setState Call + Re-render Process
          </h2>

          {/* Timeline */}
          <div className="bg-black/20 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6 text-center">
              🕐 Timeline of setState Execution
            </h3>
            <TimelineItem
              time="0ms"
              title="User triggers event: Button click"
              code='onClick={() => setName("Bob")}'
            />
            <TimelineItem
              time="0ms"
              title="setState executes: Updates Fiber node"
              code='fiberNode.hooks[0].state = "Bob"'
            />
            <TimelineItem
              time="0ms"
              title="Schedule re-render: Add to React's queue"
              code="scheduleUpdate(fiberNode)"
            />
            <TimelineItem
              time="1ms"
              title="React processes queue: Start re-render"
              code="currentlyRenderingFiber = fiberNode"
            />
            <TimelineItem
              time="2ms"
              title="useState returns updated value:"
              code='useState() → ["Bob", setName]'
            />
          </div>

          {/* Process Flow */}
          <div className="flex items-center justify-center flex-wrap gap-6 mb-8">
            <Step
              stepNumber={1}
              title="setState Called"
              code='setName("Bob")'
              description="Setter function knows its Fiber + hook index"
            />
            <Arrow />
            <Step
              stepNumber={2}
              title="Update Internal State"
              code='hooks[0].state = "Bob"'
              description="Modify Fiber node directly"
            />
            <Arrow />
            <Step
              stepNumber={3}
              title="Schedule Re-render"
              code="React.scheduleUpdate()"
              description="Add component to render queue"
            />
          </div>

          <div className="flex items-center justify-center flex-wrap gap-6 mb-8">
            <Step
              stepNumber={4}
              title="Process Queue"
              code="React.flushUpdates()"
              description="React starts processing updates"
            />
            <Arrow />
            <Step
              stepNumber={5}
              title="Re-render Component"
              code="MyComponent()"
              description="Call component function again"
            />
            <Arrow />
            <Step
              stepNumber={6}
              title="useState Returns New Value"
              code='["Bob", setName]'
              description="Fresh snapshot with updated state"
            />
          </div>

          {/* State Update Example */}
          <div className="bg-gradient-to-br from-pink-400 to-purple-400 text-gray-900 rounded-2xl p-6 mb-8 shadow-xl border-2 border-white/30">
            <h3 className="text-xl font-bold mb-6 text-center">
              🔄 State Update Example
            </h3>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="text-center">
                <h4 className="font-semibold mb-3">Before setState:</h4>
                <div className="bg-white/20 rounded-xl p-3">
                  <div className="bg-cyan-400 text-gray-900 px-3 py-2 rounded-lg font-semibold">
                    hooks[0]: {`{ state: "Alice" }`}
                  </div>
                </div>
              </div>
              <Arrow />
              <div className="text-center">
                <h4 className="font-semibold mb-3">After setState:</h4>
                <div className="bg-white/20 rounded-xl p-3">
                  <div className="bg-cyan-400 text-gray-900 px-3 py-2 rounded-lg font-semibold">
                    hooks[0]: {`{ state: "Bob" }`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Multiple setState Example */}
          <div className="bg-black/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-center">
              🔥 Multiple setState Calls (Function Updates)
            </h3>
            <div className="bg-black/30 rounded-xl p-4 mb-6 font-mono text-cyan-200 text-center">
              <div>setCount(prev =&gt; prev + 1) // Queue: [fn1]</div>
              <div>setCount(prev =&gt; prev + 1) // Queue: [fn1, fn2]</div>
              <div>setCount(prev =&gt; prev + 1) // Queue: [fn1, fn2, fn3]</div>
            </div>

            <div className="flex justify-center gap-4 flex-wrap mb-6">
              <QueueItem>fn1(0) → 1</QueueItem>
              <QueueItem>fn2(1) → 2</QueueItem>
              <QueueItem>fn3(2) → 3</QueueItem>
            </div>

            <p className="text-center">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-2 rounded-lg font-bold">
                React processes queue sequentially during re-render
              </span>
            </p>
          </div>
        </div>

        {/* Key Takeaway */}
        <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
          <h3 className="text-2xl font-bold mb-4">🎯 Key Takeaway</h3>
          <p className="text-xl leading-relaxed">
            React uses{" "}
            <span className="text-cyan-400 font-bold">Fiber nodes</span> +{" "}
            <span className="text-pink-400 font-bold">hook arrays</span> +{" "}
            <span className="text-yellow-400 font-bold">
              call order indexing
            </span>{" "}
            to manage component state. Each setState updates the Fiber node and
            schedules a re-render where useState returns the fresh values!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReactStateDiagrams;
