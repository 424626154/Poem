'use strict';
/**
 * actions
 * @flow
 */
import * as UserActions from './UserActions';
import * as PoemsActions from './PoemsActions';
import * as DiscussActions from './DiscussActions';
export default {
  ...UserActions,
  ...PoemsActions,
  ...DiscussActions,
  }
