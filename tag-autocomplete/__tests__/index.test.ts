import joplin from '__mocks__/joplin';
import * as indexPlugin from '../src/index'; 
 // Adjust path if needed

// Mock Joplin APIs
global.joplin = {
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

describe('Tag-Autocomplete index.ts', () => {
  let onStartFn: () => Promise<void>;
  let onMessageHandler: (message: any) => Promise<any>;

  beforeAll(() => {
    // When the plugin module is imported, it should call joplin.plugins.register
    indexPlugin; 
    // Capture the plugin object passed to register()
    expect(joplin.plugins.register).toHaveBeenCalled();
    const pluginObj = (joplin.plugins.register as jest.Mock).mock.calls[0][0];
    expect(pluginObj).toHaveProperty('onStart');
    // Save onStart function for testing
    onStartFn = pluginObj.onStart;
  });

  test('onStart registers content script and message handler', async () => {
    // Prepare mocks
    (joplin.contentScripts.register as jest.Mock).mockResolvedValue({ success: true });
    (joplin.contentScripts.onMessage as jest.Mock).mockImplementation((_, handler) => {
      onMessageHandler = handler;
    });

    await onStartFn();

    // Verify content script registration is called (e.g. CodeMirror plugin)
    expect(joplin.contentScripts.register).toHaveBeenCalled();
    // Verify onMessage listener was set up for the content script
    expect(joplin.contentScripts.onMessage).toHaveBeenCalledWith(
      expect.any(String),  // contentScriptId (e.g. plugin ID)
      expect.any(Function) // handler function
    );
    expect(typeof onMessageHandler).toBe('function');
  });

  test('getTags message returns list of tags', async () => {
    const fakeTags = [{ id: '1', title: 'TagOne' }, { id: '2', title: 'TagTwo' }];
    // Simulate joplin.data.get returning tags
    (joplin.data.get as jest.Mock).mockResolvedValue(fakeTags);

    // Send a message from content script to get tags
    const response = await onMessageHandler({ name: 'getTags' });
    
    // It should fetch all tags and return them
    expect(joplin.data.get).toHaveBeenCalledWith(['tags'], { fields: ['id', 'title'] });
    expect(response).toEqual(fakeTags);
  });

  test('addTag message creates tag and links to current note', async () => {
    // Mock selected note ID
    (joplin.workspace.selectedNote as jest.Mock).mockResolvedValue('note123');
    // Mock creating a new tag returns an object with id
    (joplin.data.post as jest.Mock)
      .mockResolvedValueOnce({ id: 'newTag', title: 'NewTag' })  // first call: create tag
      .mockResolvedValueOnce({});                              // second call: link tag to note

    const response = await onMessageHandler({ name: 'addTag', tagName: 'NewTag' });

    // Should create tag via POST ['tags']
    expect(joplin.data.post).toHaveBeenCalledWith(
      ['tags'], null, { title: 'NewTag' }
    );
    // Should link new tag to current note
    expect(joplin.data.post).toHaveBeenCalledWith(
      ['tags', 'newTag', 'notes'], null, { id: 'note123' }
    );
    expect(response).toEqual({ id: 'newTag', title: 'NewTag' });
  });

  test('unknown message type returns undefined', async () => {
    const result = await onMessageHandler({ name: 'someOtherMessage' });
    expect(result).toBeUndefined();
  });
});
