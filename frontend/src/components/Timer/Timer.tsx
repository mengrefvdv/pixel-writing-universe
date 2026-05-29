import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import './Timer.css';

const Timer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPomodoro, setIsPomodoro] = useState(false);
  const [pomodoroTarget, setPomodoroTarget] = useState(25 * 60);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          if (isPomodoro && next >= pomodoroTarget) {
            handleStop();
            alert('🍅 番茄时间到！休息一下吧！');
          }
          return next;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isPomodoro, pomodoroTarget]);

  const loadSessions = async () => {
    try {
      const data = await api.getSessions(7);
      setSessions(data);
    } catch (error) {
      console.error('加载记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = async () => {
    if (isRunning && seconds > 0) {
      try {
        await api.addSession({
          duration: seconds,
          word_count: wordCount,
        });
        await loadSessions();
      } catch (error) {
        console.error('保存记录失败:', error);
      }
    }
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalTimeThisWeek = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalWordsThisWeek = sessions.reduce((sum, s) => sum + s.word_count, 0);

  return (
    <div className="timer-container">
      <div className="timer-header">
        <h1>⏱️ 码字计时</h1>
        <div className="session-stats">
          <div className="stat-card">
            <div className="stat-value">{formatTime(totalTimeThisWeek)}</div>
            <div className="stat-label">本周写作时间</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalWordsThisWeek.toLocaleString()}</div>
            <div className="stat-label">本周码字</div>
          </div>
        </div>
      </div>

      <div className="timer-main">
        <div className="timer-display">
          <div className={`timer-time ${isRunning ? 'running' : ''}`}>
            {formatTime(seconds)}
          </div>
          <div className="timer-mode">
            <label className="mode-toggle">
              <input
                type="checkbox"
                checked={isPomodoro}
                onChange={(e) => {
                  setIsPomodoro(e.target.checked);
                  if (!e.target.checked) {
                    setSeconds(0);
                  }
                }}
              />
              <span>🍅 番茄钟模式</span>
            </label>
          </div>
          {isPomodoro && (
            <div className="pomodoro-setting">
              <label>番茄时长（分钟）:</label>
              <input
                type="number"
                value={pomodoroTarget / 60}
                onChange={(e) => setPomodoroTarget(Number(e.target.value) * 60)}
                min="5"
                max="60"
              />
            </div>
          )}
        </div>

        <div className="word-input">
          <label>今日码字</label>
          <input
            type="number"
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value))}
            placeholder="0"
          />
        </div>

        <div className="timer-controls">
          {!isRunning ? (
            <button className="control-btn start-btn" onClick={handleStart}>
              ▶️ 开始
            </button>
          ) : (
            <button className="control-btn stop-btn" onClick={handleStop}>
              ⏸️ 暂停
            </button>
          )}
          <button className="control-btn reset-btn" onClick={handleReset}>
            🔄 重置
          </button>
        </div>
      </div>

      <div className="sessions-history">
        <h2>📊 最近记录</h2>
        {loading ? (
          <p>加载中...</p>
        ) : sessions.length === 0 ? (
          <div className="empty-sessions">
            <p>还没有写作记录，开始你的第一次吧！</p>
          </div>
        ) : (
          <div className="sessions-list">
            {sessions.map((session) => (
              <div key={session.id} className="session-item">
                <div className="session-date">{session.date}</div>
                <div className="session-details">
                  <span className="session-time">⏱️ {formatTime(session.duration)}</span>
                  <span className="session-words">✍️ {session.word_count.toLocaleString()} 字</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;
