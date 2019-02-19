import React from 'react';
import {ApplicationContext} from './Application.context';

export function withApplicationContext<P>(Component: React.ComponentClass<P>) {
  return function WrapperComponent(props: any) {
    return (
      <ApplicationContext.Consumer>
        {applicationState => <Component {...props} applicationState={applicationState} />}
      </ApplicationContext.Consumer>
    );
  };
}
