import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Test from './components/Test';
import AddQuestionGroupForm from './components/AddQuestionGroupForm';
import AddQuestionForm from './components/AddQuestionForm';
import BotpressChat from './components/BotpressChat'; // ✅ Import component chat
import './App.css';
import GenerateTestForm from './components/GenerateTestForm';

const App = () => {
  return (
    <Router>
      <div>
        {/* Router content */}
        <Routes>
          <Route path="/" element={<AddQuestionGroupForm />} />
          <Route path="/test/:testId" element={<Test />} />
          <Route path="/add/add-question-group" element={<AddQuestionGroupForm />} />
          <Route path="/add/add-question" element={<AddQuestionForm />} />
          <Route path='/test/generate' element={<GenerateTestForm />} />
        </Routes>

        {/* ✅ Nhúng chatbot tại đây để luôn hiển thị */}
        <BotpressChat />
      </div>
    </Router>
  );
};

export default App;
