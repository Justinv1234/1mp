// src/App.jsx
import { useState } from "react";
import HomePage from "./pages/HomePage";
import GeneratePage from "./pages/GeneratePage";
import CustomPage from "./pages/CustomPage";
import IdeaDetailsPage from "./pages/IdeaDetailsPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedIdea, setSelectedIdea] = useState(null);

  const navigate = (page) => setCurrentPage(page);

  return (
    <>
      {currentPage === "home" && <HomePage onNavigate={navigate} />}
      {currentPage === "generate" && (
        <GeneratePage onNavigate={navigate} onSelectIdea={setSelectedIdea} />
      )}
      {currentPage === "custom" && (
        <CustomPage onNavigate={navigate} onSelectIdea={setSelectedIdea} />
      )}
      {currentPage === "idea-details" && (
        <IdeaDetailsPage onNavigate={navigate} selectedIdea={selectedIdea} />
      )}
    </>
  );
}
