export interface EditorTheme {
  id: string;
  name: string;
  description: string;
  background: string;
  backgroundColor: string;
  textColor: string;
  textColorSecondary: string;
  accentColor: string;
  borderColor: string;
  cursorColor: string;
}

export const editorThemes: EditorTheme[] = [
  {
    id: 'classic-dark',
    name: '经典深色',
    description: '护眼深色主题，适合夜间写作',
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
    backgroundColor: '#1a1a2e',
    textColor: '#ffffff',
    textColorSecondary: '#b0b0b0',
    accentColor: '#4ecdc4',
    borderColor: '#2a2a4a',
    cursorColor: '#4ecdc4'
  },
  {
    id: 'warm-cozy',
    name: '温暖米黄',
    description: '温馨的米黄色调，适合长时间写作',
    background: 'linear-gradient(180deg, #faf5e6 0%, #f0eade 100%)',
    backgroundColor: '#faf5e6',
    textColor: '#5d4e3e',
    textColorSecondary: '#8b6914',
    accentColor: '#f4d03f',
    borderColor: '#d4c4a8',
    cursorColor: '#8b6914'
  },
  {
    id: 'forest-green',
    name: '森林绿意',
    description: '清新的森林绿色，带来自然气息',
    background: 'linear-gradient(180deg, #2d5016 0%, #1a3009 100%)',
    backgroundColor: '#2d5016',
    textColor: '#ffffff',
    textColorSecondary: '#a8e063',
    accentColor: '#56ab2f',
    borderColor: '#1a3009',
    cursorColor: '#a8e063'
  },
  {
    id: 'ocean-blue',
    name: '海洋深蓝',
    description: '深邃的海洋色调，宁静舒适',
    background: 'linear-gradient(180deg, #0c2461 0%, #1e3799 100%)',
    backgroundColor: '#0c2461',
    textColor: '#ffffff',
    textColorSecondary: '#74b9ff',
    accentColor: '#0984e3',
    borderColor: '#1e3799',
    cursorColor: '#74b9ff'
  },
  {
    id: 'sunset-orange',
    name: '落日橙黄',
    description: '温暖的日落色调，激发创作灵感',
    background: 'linear-gradient(180deg, #e17055 0%, #d35400 100%)',
    backgroundColor: '#e17055',
    textColor: '#ffffff',
    textColorSecondary: '#ffeaa7',
    accentColor: '#f39c12',
    borderColor: '#d35400',
    cursorColor: '#ffeaa7'
  },
  {
    id: 'pure-white',
    name: '纯净白纸',
    description: '洁白的纸张，还原真实书写体验',
    background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
    backgroundColor: '#ffffff',
    textColor: '#2d3436',
    textColorSecondary: '#636e72',
    accentColor: '#6c5ce7',
    borderColor: '#dee2e6',
    cursorColor: '#2d3436'
  },
  {
    id: 'neon-purple',
    name: '霓虹紫',
    description: '赛博朋克风格，激发未来感创作',
    background: 'linear-gradient(180deg, #2d132c 0%, #1a1a2e 100%)',
    backgroundColor: '#2d132c',
    textColor: '#ffffff',
    textColorSecondary: '#fd79a8',
    accentColor: '#a29bfe',
    borderColor: '#6c5ce7',
    cursorColor: '#fd79a8'
  },
  {
    id: 'paper-yellow',
    name: '羊皮纸',
    description: '复古羊皮纸风格，适合古风写作',
    background: 'linear-gradient(180deg, #fdf5e6 0%, #f5deb3 100%)',
    backgroundColor: '#fdf5e6',
    textColor: '#5d4e3e',
    textColorSecondary: '#8b7355',
    accentColor: '#d4a574',
    borderColor: '#deb887',
    cursorColor: '#5d4e3e'
  }
];

export const getThemeById = (id: string): EditorTheme | undefined => {
  return editorThemes.find(t => t.id === id);
};

export const getDefaultTheme = (): EditorTheme => {
  return editorThemes[0];
};
