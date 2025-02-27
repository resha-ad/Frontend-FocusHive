import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { isAuthenticated } from "./utils/auth";
import Task from './components/private/Task';
import LoginForm from './components/public/LoginForm';
import Calendar from './components/private/Calendar';
import FocusTimer from './components/private/FocusTimer';
import Register from './components/public/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/task" element={<Task />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/focustimer" element={<FocusTimer />} />
      </Routes>
    </Router>
  );
}

export default App;
