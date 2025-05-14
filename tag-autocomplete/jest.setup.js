global.joplin = {
  plugins: {
    register: jest.fn((fn) => fn({ contentScriptId: 'test-script' })),
  },
  contentScripts: {
    register: jest.fn().mockResolvedValue(undefined),
    onMessage: jest.fn(),
  },
  data: {
    get: jest.fn(),
    post: jest.fn(),
  },
  workspace: {
    selectedNote: jest.fn().mockResolvedValue({
      id: 'note-id',
      title: 'Test Note',
      body: 'note body',
    }),
  },
  commands: {
    register: jest.fn(),
  },
  settings: {
    registerSection: jest.fn(),
    registerSetting: jest.fn(),
  },
};
