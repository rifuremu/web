import { HashRouter, Routes, Route } from 'react-router-dom';
import { SessionProvider } from './SessionContext';
import Home from './components/Home';
import EmotionSelect from './components/EmotionSelect';
import Writing from './components/Writing';
import NeedSelect from './components/NeedSelect';
import ConceptSelect from './components/ConceptSelect';
import Summary from './components/Summary';
import Reconstruct from './components/Reconstruct';
import Complete from './components/Complete';

function App() {
  return (
    <SessionProvider>
      <HashRouter>
        <div className="min-h-screen bg-[#f3f4f6] flex justify-center items-start py-8 px-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/emotion" element={<EmotionSelect />} />
              <Route path="/writing" element={<Writing />} />
              <Route path="/need" element={<NeedSelect />} />
              <Route path="/concept" element={<ConceptSelect />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/reconstruct" element={<Reconstruct />} />
              <Route path="/complete" element={<Complete />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    </SessionProvider>
  );
}

export default App;
