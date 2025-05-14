const joplinMock = {
  plugins: { register: jest.fn() },
  contentScripts: {
    register: jest.fn(),
    onMessage: jest.fn()
  },
  data: {
    get: jest.fn(),
    post: jest.fn()
  },
  workspace: {
    selectedNote: jest.fn()
  },
  commands: { register: jest.fn() },
  settings: { registerSection: jest.fn(), registerSetting: jest.fn() }
};

export default joplinMock;
