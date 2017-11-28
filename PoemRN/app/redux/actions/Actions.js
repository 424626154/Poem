'use strict';
/**
 * actions
 * @flow
 */
import * as UserActions from './UserActions';
import * as PoemsActions from './PoemsActions';
export default {
  ...UserActions,
  ...PoemsActions,
  }
