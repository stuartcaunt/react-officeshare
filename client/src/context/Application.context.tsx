import React from 'react';
import { ApplicationBundle, INITIAL_APPLICATION_BUNDLE } from './Application.bundle';

export const ApplicationContext = React.createContext<ApplicationBundle>(INITIAL_APPLICATION_BUNDLE);

export function withApplicationContext<P>(Component: React.ComponentClass<P>) {
    return function WrapperComponent(props: any) {
      return (
        <ApplicationContext.Consumer>
          {applicationBundle => <Component {...props} 
            applicationState={applicationBundle.applicationState}
            applicationServices={applicationBundle.applicationServices} />}
        </ApplicationContext.Consumer>
      );
    };
  }
  