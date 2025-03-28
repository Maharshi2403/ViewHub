import { useState } from "react";
import Chat from "./components/Chat";

function App() {
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);

  return (
    <>
      <Chat messages={messages} setMessages={setMessages} />
    </>
  );
}

export default App;
