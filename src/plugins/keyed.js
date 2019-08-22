/**
 * .dom - A Tiny VDom Template Engine
 *
 * Copyright 2017-2019 Ioannis Charalampidis (wavesoft)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* BEGIN NPM-GLUE */

// This code block will be striped when building the stand-alone version.
// When using `npm` this exports the correct functions in order to be easily
// imported in the correct scope, without leaking to the global scope.

var window = typeof window !== "undefined" && window || {};
module.exports = window;

/* END NPM-GLUE */

/**
 * Enables keyed updates to the given array of components
 */
window.K = (
  state,                                                              // 1. A reference to the components' state object
  components,                                                         // 2. An array of components with `key` properties
  namespace="=e",                                                     // 3. (Optional) The namespace where to keep track
                                                                      //    the component instances.

  store=state[namespace] = state[namespace] || {}                     // a. A reference to the state store, used later
) =>
  Object.keys(store).map(k =>                                         // First ensure that previous keys are deleted, by
    components.find(({a:{key}}) => key == k) ||                       // looping over the stored keys and deleting the
    delete store[k]                                                   // ones not found in the given array.
  )
  && components.map(c => (                                            // Then process the component states
    c.s =                                                             // Always define an `.s` property,
      store[c.a.key] =                                                // that is also kept as reference in the state object
      store[c.a.key]                                                  // - That contains either the previous state
      || c.s                                                          // - Or the current state of the VDom object
      || {}                                                           // - Or define a new, blank state (important)
    ) && c                                                            // And finally return the component to the map function
  )
