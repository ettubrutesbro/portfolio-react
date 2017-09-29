/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import { configure } from '@storybook/react';

function loadStories() {
  // require('../stories');
  require('../src/stories.js')
  require('../src/stories/tests.js')
}

configure(loadStories, module);
