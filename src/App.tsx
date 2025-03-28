import { useState } from "react";
import Chat from "./components/Chat";

function App() {
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <>
      <Chat messages={messages} setMessages={setMessages} />
    </>
  );
}

export default App;
