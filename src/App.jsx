import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Task from './components/private/Task';
import Login from './components/public/LoginForm';
import Calendar from './components/private/Calendar';
import FocusTimer from './components/private/FocusTimer';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/task" element={<Task />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/focustimer" element={<FocusTimer />} />
      </Routes>
    </Router>
  );
}

export default App;
