/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options'

function loadStories() {
  // require('../stories');
  require('../src/stories.js')
  require('../src/stories/teststories.js')
}


configure(loadStories, module);
