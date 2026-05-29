import React, { useState } from 'react';
import './Onboarding.css';

interface OnboardingStep {
  title: string;
  description: string;
  icon: string;
  tips?: string[];
}

interface OnboardingProps {
  onComplete: () => void;
}

const steps: OnboardingStep[] = [
  {
    title: '欢迎来到像素码字宇宙 ✨',
    description: '这是一个属于你的数字创作空间，在这里你可以培养植物、养宠物、打造专属的写作房间。',
    icon: '🏠',
    tips: ['点击任意位置继续']
  },
  {
    title: '写作即成长 🌱',
    description: '每当你写作，植物就会成长，宠物也会更加活跃。积累字数，解锁更多内容和功能。',
    icon: '✍️',
    tips: ['每100字 = 5 XP', '达到目标会解锁新宠物和植物']
  },
  {
    title: '选择你的伙伴 🐾',
    description: '在这里你可以选择一株植物和一只宠物陪伴你的写作之旅。它们会在你写作时陪伴你。',
    icon: '🌿',
    tips: ['黑猫和�的多肉是初始解锁的', '随着等级提升会解锁更多伙伴']
  },
  {
    title: '解锁成就 🏆',
    description: '完成各种写作挑战，解锁成就获得奖励。连续写作会获得额外经验值哦！',
    icon: '⭐',
    tips: ['保持连续写作可以获得streak奖励', '成就奖励包括新植物、宠物和房间主题']
  },
  {
    title: '打造专属房间 🎨',
    description: '解锁不同的房间主题，从白天到深夜，从雨天到雪景，让你的创作空间与众不同。',
    icon: '🌙',
    tips: ['不同的氛围会有不同的视觉效果', '深夜模式特别适合夜猫子作家']
  },
  {
    title: '开始你的创作之旅 🚀',
    description: '准备好了吗？让我们开始吧！记得，写作是一种享受，不要有压力，慢慢来~',
    icon: '💫',
    tips: ['有任何问题可以查看设置', '享受写作的乐趣吧！']
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-container">
        <div className="onboarding-progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-dots">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="onboarding-content">
          <div className="step-icon">{step.icon}</div>
          
          <h2>{step.title}</h2>
          
          <p className="step-description">{step.description}</p>
          
          {step.tips && (
            <div className="step-tips">
              {step.tips.map((tip, index) => (
                <div key={index} className="tip">
                  <span className="tip-icon">💡</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}

          <div className="step-indicator">
            {currentStep + 1} / {steps.length}
          </div>
        </div>

        <div className="onboarding-actions">
          {currentStep > 0 && (
            <button className="onboarding-btn secondary" onClick={handlePrevious}>
              ← 上一步
            </button>
          )}
          
          <button className="onboarding-btn primary" onClick={handleNext}>
            {currentStep === steps.length - 1 ? '开始创作 ✨' : '下一步 →'}
          </button>
        </div>

        {currentStep < steps.length - 1 && (
          <button className="skip-btn" onClick={onComplete}>
            跳过引导
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
