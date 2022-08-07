import Header from "./Components/Header/Header";
import Home from "./Pages/Home/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  //Navigate,
} from "react-router-dom";
import "./App.css";
import Footer from "./Components/Footer/Footer";
import Newspapers from "./Pages/Newspapers/Newspapers";
import Journalists from "./Pages/Journalists/Journalists";
import Journalist from "./Pages/Journalist/Journalist";
import Missions from "./Pages/Missions/Missions";
import Inscription from "./Pages/Inscription/Inscription";
import Admin from "./Pages/Admin/Admin";
import UserPage from "./Pages/UserPage/UserPage";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import { ContextProvider } from "./Context/Context";
import { UserContextProvider } from "./Context/UserContext";
import { MissionContextProvider } from "./Context/MissionContext";
import { LanguageContextProvider } from "./Context/LanguageContext";
import Topic from "./Pages/Topic/Topic";
import Customers from "./Pages/Customers/Customers";
import Relances from "./Pages/Relances/Relances";
import ImportExcel from "./Pages/ImportExcel/ImportExcel";
import MissionCurrent from "./Pages/MissionCurrent/MissionCurrent";

function App() {
  return (
    <Router>
      <LanguageContextProvider>
        <ContextProvider>
          <UserContextProvider>
            <MissionContextProvider>
              <Header />
              <main className="App">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/journalists" element={<Journalists />} />
                  <Route path="/journalists/:id" element={<Journalist />} />
                  <Route path="/user/:userId" element={<UserPage />} />
                  <Route path="/missions" element={<Missions />} />
                  <Route
                    path="/missions/current/"
                    element={<MissionCurrent />}
                  />
                  <Route path="/relances" element={<Relances />} />
                  <Route path="/newspapers" element={<Newspapers />} />
                  <Route path="/topics" element={<Topic />} />
                  <Route path="/clients" element={<Customers />} />
                  <Route path="/importexcel" element={<ImportExcel />} />
                  <Route path="/signup" element={<Inscription />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<ErrorPage />} />
                  {/* <Route path="*" element={<Navigate to="/" />} /> */}
                </Routes>
              </main>
              <Footer />
            </MissionContextProvider>
          </UserContextProvider>
        </ContextProvider>
      </LanguageContextProvider>
    </Router>
  );
}

export default App;
