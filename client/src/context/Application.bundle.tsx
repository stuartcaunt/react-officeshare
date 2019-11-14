import { ApplicationState, INITIAL_APPLICATION_STATE } from "./Application.state";
import { ApplicationServices, INITIAL_APPLICATION_SERVICES } from "./Application.services";

export interface ApplicationBundle {
  applicationState: ApplicationState,
  applicationServices: ApplicationServices
}

export const INITIAL_APPLICATION_BUNDLE: ApplicationBundle = {
  applicationState: INITIAL_APPLICATION_STATE,
  applicationServices: INITIAL_APPLICATION_SERVICES
};