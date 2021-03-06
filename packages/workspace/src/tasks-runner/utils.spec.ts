import { getOutputsForTargetAndConfiguration } from '@nrwl/workspace/src/tasks-runner/utils';

describe('utils', () => {
  describe('getOutputsForTargetAndConfiguration', () => {
    it('should return outputs when defined', () => {
      expect(
        getOutputsForTargetAndConfiguration('build', 'production', {
          name: 'myapp',
          type: 'application',
          data: {
            architect: {
              build: {
                outputs: ['one', 'two'],
              },
            },
            files: [],
          },
        })
      ).toEqual(['one', 'two']);
    });

    it('should return configuration-specific outputPath when defined', () => {
      expect(
        getOutputsForTargetAndConfiguration('build', 'production', {
          name: 'myapp',
          type: 'application',
          data: {
            architect: {
              build: {
                options: {
                  outputPath: 'one',
                },
                configurations: {
                  production: {
                    outputPath: 'two',
                  },
                },
              },
            },
            files: [],
          },
        })
      ).toEqual(['two']);
    });

    it('should return configuration-independent outputPath when defined', () => {
      expect(
        getOutputsForTargetAndConfiguration('build', 'production', {
          name: 'myapp',
          type: 'application',
          data: {
            architect: {
              build: {
                options: {
                  outputPath: 'one',
                },
                configurations: {
                  production: {},
                },
              },
            },
            files: [],
          },
        })
      ).toEqual(['one']);
    });

    it('should handle invalid configuration', () => {
      expect(
        getOutputsForTargetAndConfiguration('build', 'production', {
          name: 'myapp',
          type: 'application',
          data: {
            architect: {
              build: {
                options: {
                  outputPath: 'one',
                },
              },
            },
            files: [],
          },
        })
      ).toEqual(['one']);
    });

    it('should return default output path when nothing else is defined', () => {
      expect(
        getOutputsForTargetAndConfiguration('build', 'production', {
          name: 'myapp',
          type: 'application',
          data: {
            root: 'root-myapp',
            architect: {
              build: {},
            },
            files: [],
          },
        })
      ).toEqual(['dist/root-myapp']);
    });
  });
});
