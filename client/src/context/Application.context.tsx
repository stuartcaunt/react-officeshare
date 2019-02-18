import React from 'react';
import {ApplicationState, INITIAL_APPLICATION_STATE} from './Application.state';
import {ApplicationActions} from './Application.actions';

export interface ApplicationContext {
  state: ApplicationState,
  actions: ApplicationActions
}

export const INITIAL_APPLICATION_CONTEXT:ApplicationContext = {
  state: INITIAL_APPLICATION_STATE,
  actions: new ApplicationActions()
};

const context = React.createContext<ApplicationContext>(INITIAL_APPLICATION_CONTEXT);

export const ApplicationContextProvider = context.Provider;
export const ApplicationContextConsumer = context.Consumer;
