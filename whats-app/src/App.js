import "./App.css";
import Chat from "./component/chat/Chat";
import Sidebar from "./component/sidebar/Sidebar";

function App() {
  return (
    <div className="app">
      <div className="app__body">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default App;

// in the component use ctrl + spacebar to auto import
