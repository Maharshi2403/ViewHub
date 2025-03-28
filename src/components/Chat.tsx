import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

interface TreeNode {
  name: string;
  value?: any;
  children?: TreeNode[];
}

interface HierarchyNode extends d3.HierarchyNode<TreeNode> {
  x: number;
  y: number;
}

interface HierarchyLink extends d3.HierarchyLink<TreeNode> {
  source: HierarchyNode;
  target: HierarchyNode;
}

const Chat = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const treeContainerRef = useRef<HTMLDivElement>(null);

  const createTreeData = (jsonData: any): TreeNode | null => {
    try {
      // Ensure we have valid data to work with
      if (!jsonData) {
        console.error("No JSON data provided");
        return null;
      }

      // If the data is an error message, return null
      if (
        typeof jsonData === "string" &&
        (jsonData.startsWith("Error:") ||
          jsonData.includes("Error occurred while"))
      ) {
        console.error("Error message received:", jsonData);
        return null;
      }

      let data;
      try {
        // First try to parse if it's a string
        data = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        return null;
      }

      console.log("Processing data:", data);

      const root: TreeNode = {
        name: "API Response",
        children: [],
      };

      // Process the data
      const processObject = (obj: any, parentName: string): TreeNode[] => {
        // Handle arrays
        if (Array.isArray(obj)) {
          return obj.map((item, index): TreeNode => {
            if (item && typeof item === "object") {
              return {
                name: `[${index}]`,
                children: processObject(item, `[${index}]`),
              };
            }
            return {
              name: `[${index}]`,
              value: String(item),
            };
          });
        }

        // Handle objects
        return Object.entries(obj).map(([key, value]): TreeNode => {
          if (value && typeof value === "object") {
            return {
              name: key,
              children: processObject(value, key),
            };
          }
          return {
            name: key,
            value: String(value),
          };
        });
      };

      // Process top-level data
      root.children = processObject(data, "root");

      console.log("Generated tree structure:", root);
      return root;
    } catch (error) {
      console.error("Error creating tree data:", error);
      return null;
    }
  };

  const renderTree = (data: TreeNode) => {
    if (!treeContainerRef.current || !data) return;

    d3.select(treeContainerRef.current).selectAll("*").remove();

    // Calculate dimensions based on data size
    const nodeCount = d3.hierarchy(data).descendants().length;
    const minHeight = Math.max(560, nodeCount * 30); // Minimum 30px per node
    const width = 960; // Increased width
    const height = Math.max(minHeight, 560);
    const margin = { top: 20, right: 200, bottom: 20, left: 150 }; // Adjusted margins

    // Create zoom behavior with adjusted scale extent
    const zoom = d3
      .zoom()
      .scaleExtent([0.2, 3]) // Increased zoom range
      .on("zoom", (event) => {
        svg.attr("transform", event.transform);
      });

    // Create the main SVG with adjusted dimensions
    const svgContainer = d3
      .select(treeContainerRef.current)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("background", "#1a1a1a")
      .call(zoom as any);

    // Add a background rect to catch zoom events
    svgContainer
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all");

    const svg = svgContainer
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Adjust tree layout
    const tree = d3
      .tree<TreeNode>()
      .size([
        height - margin.top - margin.bottom,
        width - margin.left - margin.right,
      ])
      .separation((a, b) => (a.parent === b.parent ? 1.5 : 2)); // Increased separation between nodes

    const root = d3.hierarchy(data) as HierarchyNode;
    const links = tree(root).links() as HierarchyLink[];
    const nodes = root.descendants() as HierarchyNode[];

    // Add links with enhanced visibility and curved paths
    svg
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr(
        "d",
        d3
          .linkHorizontal<HierarchyLink, HierarchyNode>()
          .x((d) => d.y)
          .y((d) => d.x)
      )
      .style("fill", "none")
      .style("stroke", "#4f46e5")
      .style("stroke-opacity", 0.7)
      .style("stroke-width", 2);

    // Add nodes with enhanced styling
    const node = svg
      .selectAll("g.node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    // Add node circles with improved visibility
    node
      .append("circle")
      .attr("r", 6)
      .style("fill", "#4f46e5")
      .style("stroke", "#818cf8")
      .style("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 8)
          .style("fill", "#6366f1");
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 6)
          .style("fill", "#4f46e5");
      });

    // Add labels with better visibility and positioning
    node
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d) => (d.children ? -12 : 12))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) => d.data.name)
      .style("font-size", "14px")
      .style("font-family", "monospace")
      .style("fill", "#f3f4f6")
      .style("paint-order", "stroke")
      .style("stroke", "#111827")
      .style("stroke-width", "3px")
      .style("stroke-linecap", "round")
      .style("stroke-linejoin", "round");

    // Add value labels for leaf nodes with better visibility and positioning
    node
      .filter((d) => !d.children && d.data.value !== undefined)
      .append("text")
      .attr("dy", "1.3em")
      .attr("x", 12)
      .attr("text-anchor", "start")
      .text((d) => `: ${d.data.value}`)
      .style("font-size", "12px")
      .style("font-family", "monospace")
      .style("fill", "#93c5fd")
      .style("opacity", 0.9);

    // Initial zoom to fit content
    const rootNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];
    const bounds = {
      x: [rootNode.x, lastNode.x],
      y: [rootNode.y, lastNode.y],
    };

    const dx = bounds.x[1] - bounds.x[0];
    const dy = bounds.y[1] - bounds.y[0];
    const x = (bounds.x[0] + bounds.x[1]) / 2;
    const y = (bounds.y[0] + bounds.y[1]) / 2;

    const scale = Math.max(
      0.2,
      Math.min(2, 0.9 / Math.max(dx / height, dy / width))
    );
    const translate = [width / 2 - scale * y, height / 2 - scale * x];

    svgContainer
      .transition()
      .duration(750)
      .call(
        zoom.transform as any,
        d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
      );
  };

  useEffect(() => {
    if (response) {
      try {
        // Check if response is an error message
        if (
          typeof response === "string" &&
          (response.startsWith("Error:") ||
            response.includes("Error occurred while"))
        ) {
          console.error("Error message received:", response);
          if (treeContainerRef.current) {
            d3.select(treeContainerRef.current).selectAll("*").remove();
            d3.select(treeContainerRef.current)
              .append("div")
              .style("padding", "20px")
              .style("color", "#e5e7eb")
              .style("font-family", "monospace")
              .style("white-space", "pre-wrap")
              .style("font-size", "14px")
              .style("line-height", "1.5")
              .text(response);
          }
          return;
        }

        // Try to parse as JSON first
        try {
          const jsonData = JSON.parse(response);
          const treeData = createTreeData(jsonData);
          if (treeData) {
            renderTree(treeData);
          } else {
            console.error("Failed to create tree data");
            if (treeContainerRef.current) {
              d3.select(treeContainerRef.current).selectAll("*").remove();
              d3.select(treeContainerRef.current)
                .append("div")
                .style("padding", "20px")
                .style("color", "#e5e7eb")
                .style("font-family", "monospace")
                .style("white-space", "pre-wrap")
                .style("font-size", "14px")
                .style("line-height", "1.5")
                .text("Invalid JSON data");
            }
          }
        } catch (parseError) {
          // If parsing fails, it's likely a text response from deepseek
          // Show the text response with proper formatting
          if (treeContainerRef.current) {
            d3.select(treeContainerRef.current).selectAll("*").remove();
            d3.select(treeContainerRef.current)
              .append("div")
              .style("padding", "20px")
              .style("color", "#e5e7eb")
              .style("font-family", "monospace")
              .style("white-space", "pre-wrap")
              .style("font-size", "14px")
              .style("line-height", "1.5")
              .text(response);
          }
        }
      } catch (error) {
        console.error("Error in response handling:", error);
        if (treeContainerRef.current) {
          d3.select(treeContainerRef.current).selectAll("*").remove();
          d3.select(treeContainerRef.current)
            .append("div")
            .style("padding", "20px")
            .style("color", "#e5e7eb")
            .style("font-family", "monospace")
            .style("white-space", "pre-wrap")
            .style("font-size", "14px")
            .style("line-height", "1.5")
            .text("Error processing response");
        }
      }
    }
  }, [response]);

  const generateResponse = async (url: string) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error("Error fetching JSON:", error);
      return "Error: " + error;
    }
  };

  const cleanResponse = (text: string) => {
    // Remove think tags and their content
    text = text.replace(/<think>[\s\S]*?<\/think>/g, "");
    // Remove any remaining XML/HTML tags
    text = text.replace(/<[^>]*>/g, "");
    return text.trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setResponse(""); // Clear previous response

    try {
      // Always use deepseek-r1 model for analysis
      const aiResponse = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-r1",
          prompt: input,
          stream: false,
        }),
      });
      const data = await aiResponse.json();
      setResponse(cleanResponse(data.response));
      setInput(""); // Clear input
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error occurred while analyzing the input");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0c0c0c",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Response component */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          paddingBottom: "100px", // Add padding to account for fixed input
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: "20px",
            }}
          >
            <div
              className="loading-dots"
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#4f46e5",
                  animation: "bounce 1.4s infinite ease-in-out",
                }}
              ></div>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#4f46e5",
                  animation: "bounce 1.4s infinite ease-in-out 0.2s",
                }}
              ></div>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#4f46e5",
                  animation: "bounce 1.4s infinite ease-in-out 0.4s",
                }}
              ></div>
            </div>
            <div
              style={{
                color: "#9ca3af",
                fontSize: "16px",
                fontFamily: "monospace",
              }}
            >
              Generating response from deepseek-r1
            </div>
          </div>
        ) : response ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#0c0c0c",
              padding: "20px",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div
              ref={treeContainerRef}
              style={{
                width: "100%",
                flex: "1 0 auto",
                minHeight: "600px",
                marginBottom: "20px",
                background: "#1a1a1a",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #374151",
                boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* Response will be shown here */}
              <div style={{ padding: "10px", color: "#9ca3af" }}>
                {response}
              </div>
            </div>
            <style>
              {`
                div::-webkit-scrollbar {
                  display: none;
                }
                svg {
                  width: 100%;
                  height: 100%;
                }
                .node:hover text {
                  font-weight: bold;
                }
                .node circle:hover {
                  filter: brightness(1.2);
                }
                @keyframes bounce {
                  0%, 80%, 100% { 
                    transform: scale(0);
                    opacity: 0.3;
                  }
                  40% { 
                    transform: scale(1);
                    opacity: 1;
                  }
                }
              `}
            </style>
          </div>
        ) : (
          <div
            style={{
              color: "#9ca3af",
              fontSize: "16px",
              fontFamily: "monospace",
            }}
          >
            Enter text to analyze with deepseek-r1
          </div>
        )}
      </div>

      {/* Fixed input container at bottom */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px",
          background: "#0c0c0c",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "10px",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <button
            type="button"
            onClick={async () => {
              if (input.trim()) {
                setIsLoading(true);
                try {
                  // Try to fetch JSON from URL
                  const response = await fetch(input);
                  const jsonData = await response.json();
                  setResponse(JSON.stringify(jsonData, null, 2));
                } catch (error) {
                  setResponse("Error: Failed to fetch JSON from URL");
                  // Clear the tree container
                  if (treeContainerRef.current) {
                    d3.select(treeContainerRef.current).selectAll("*").remove();
                    d3.select(treeContainerRef.current)
                      .append("div")
                      .style("padding", "10px")
                      .style("color", "#9ca3af")
                      .text("Failed to fetch JSON from URL");
                  }
                } finally {
                  setIsLoading(false);
                }
              }
            }}
            style={{
              padding: "10px 15px",
              background: "#4f46e5",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            title="Generate Tree Visualization"
          >
            @
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to analyze with deepseek-r1"
            style={{
              flex: 1,
              padding: "10px 15px",
              background: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "white",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              background: "#4f46e5",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
