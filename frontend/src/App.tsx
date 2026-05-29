import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/design-system.css';
import './styles/animations.css';
import { useAuth } from './hooks/useAuth';
import { useGameStore } from './stores/gameStore';
import { achievements } from './data/achievements';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StudyRoom from './components/Study/StudyRoom';
import Editor from './components/Editor/Editor';
import ArticleList from './components/Articles/ArticleList';
import FileManager from './components/Files/FileManager';
import Reader from './components/Reader/Reader';
import Bookshelf from './components/Books/Bookshelf';
import Timer from './components/Timer/Timer';
import Tools from './components/Tools/Tools';
import Discover from './components/Discover/Discover';
import Settings from './components/Settings/Settings';
import Navigation from './components/Navigation/Navigation';
import Room from './components/Room/Room';
import PlantSelector from './components/Selectors/PlantSelector';
import PetSelector from './components/Selectors/PetSelector';
import Achievements from './components/Achievements/Achievements';
import Pet from './components/Pet/Pet';
import Plant from './components/Plant/Plant';
import RoomTheme from './components/Room/RoomTheme';

type View = 'study' | 'editor' | 'articles' | 'files' | 'reader' | 'bookshelf' | 'timer' | 'tools' | 'discover' | 'settings' | 'achievements' | 'plant-selector' | 'pet-selector' | 'theme-selector';

type Screen = 'room' | 'login' | 'register' | 'app';

function App() {
  const { user, isAuthenticated, login, logout, register } = useAuth();
  const { 
    user: gameUser, 
    setActivePlant, 
    setActivePet, 
    achievements: gameAchievements, 
    setAchievements,
    activePet 
  } = useGameStore();
  
  const [currentView, setCurrentView] = useState<View>('study');
  const [currentArticle, setCurrentArticle] = useState<any>(null);
  const [currentFile, setCurrentFile] = useState<any>(null);
  const [screen, setScreen] = useState<Screen>('room');

  useEffect(() => {
    if (!gameAchievements || gameAchievements.length === 0) {
      setAchievements(achievements);
    }
  }, [gameAchievements, setAchievements]);

  useEffect(() => {
    if (isAuthenticated) {
      setScreen('app');
    }
  }, [isAuthenticated]);

  const handleStartWriting = () => {
    setScreen('app');
  };

  const handleLogin = () => {
    setScreen('login');
  };

  const handleRegister = () => {
    setScreen('register');
  };

  const handleBackToRoom = () => {
    setScreen('room');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'room':
        return (
          <Room 
            onStartWriting={handleStartWriting}
          />
        );
      case 'login':
        return (
          <div className="auth-screen">
            <button className="back-btn" onClick={handleBackToRoom}>← 返回房间</button>
            <Login 
              onLogin={async (email: string, password: string) => {
                await login(email, password);
                setScreen('app');
              }}
              onSwitchToRegister={handleRegister}
            />
          </div>
        );
      case 'register':
        return (
          <div className="auth-screen">
            <button className="back-btn" onClick={handleBackToRoom}>← 返回房间</button>
            <Register 
              onRegister={async (username: string, email: string, password: string) => {
                await register(username, email, password);
                setScreen('login');
              }}
              onSwitchToLogin={handleLogin}
            />
          </div>
        );
      case 'app':
        return (
          <div className="main-layout">
            <Navigation 
              currentView={currentView}
              onNavigate={setCurrentView}
              onLogout={() => {
                logout();
                setScreen('room');
              }}
              user={user}
              level={gameUser.level}
              xp={gameUser.xp}
              streak={gameUser.currentStreak}
            />
            <div className="content-area">
              {renderView()}
            </div>
            {activePet && (
              <Pet size={70} draggable={true} />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'study':
        return <StudyRoom onStartWriting={() => setCurrentView('editor')} />;
      case 'editor':
        return (
          <div className="editor-with-pet">
            <Editor article={currentArticle} />
          </div>
        );
      case 'articles':
        return <ArticleList onEdit={(article) => {
          setCurrentArticle(article);
          setCurrentView('editor');
        }} />;
      case 'files':
        return <FileManager onRead={(file) => {
          setCurrentFile(file);
          setCurrentView('reader');
        }} />;
      case 'reader':
        return <Reader 
          content={currentFile?.content || ''}
          fileName={currentFile?.original_name || '文件'}
          fileType={currentFile?.file_type || 'txt'}
          file={currentFile}
          onClose={() => setCurrentView('files')}
        />;
      case 'bookshelf':
        return <Bookshelf />;
      case 'timer':
        return <Timer />;
      case 'tools':
        return <Tools />;
      case 'discover':
        return <Discover />;
      case 'settings':
        return <Settings />;
      case 'achievements':
        return <Achievements />;
      case 'plant-selector':
        return <PlantSelector />;
      case 'pet-selector':
        return <PetSelector />;
      case 'theme-selector':
        return <RoomTheme />;
      default:
        return <StudyRoom onStartWriting={() => setCurrentView('editor')} />;
    }
  };

  return (
    <div className="app-container pixel-app">
      {renderScreen()}
    </div>
  );
}

export default App;
