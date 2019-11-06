export class ToolbarAction {
  
  public id: string;
  public icon: string;
  public label: string;
  public enabled: boolean;
  public visible: boolean;
  public handler: () => void;
  
  constructor(init?: Partial<ToolbarAction>) {
    Object.assign(this, init);
  }
}