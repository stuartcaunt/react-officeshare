import React, {Component} from 'react';
import {ApplicationState, INITIAL_APPLICATION_STATE} from './Application.state';

export const ApplicationContext = React.createContext<ApplicationState>(INITIAL_APPLICATION_STATE);
