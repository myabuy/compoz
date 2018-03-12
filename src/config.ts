/**
 * ConfigInterface define an object to configure the compose component.
 */
export interface ConfigInterface {
  contentHTML: string;
  fileMaxSize: number;
  height: number;
  hideAttachment: boolean;
  hideExpand: boolean;
  hideSend: boolean;
  onBlur: Function|null;
  onContentChange: Function|null;
  onExpand: Function|null;
  onSend: Function|null;
}

export class Config {
  contentHTML = '';
  fileMaxSize = 26214400;
  height = 0;
  hideAttachment = false;
  hideExpand = false;
  hideSend = false;
  onBlur: Function|null = null;
  onContentChange: Function|null = null;
  onExpand: Function|null = null;
  onSend: Function|null = null;

  constructor(cfg: ConfigInterface|null) {
    if (!cfg) {
      return;
    }

    this.contentHTML = cfg.contentHTML ? cfg.contentHTML : '';

    if (cfg.fileMaxSize && cfg.fileMaxSize > 0) {
      this.fileMaxSize = cfg.fileMaxSize;
    }
    if (cfg.height && cfg.height > 0) {
      this.height = cfg.height;
    }

    this.hideAttachment = cfg.hideAttachment;
    this.hideExpand = cfg.hideExpand;
    this.hideSend = cfg.hideSend;
    this.onBlur = cfg.onBlur;
    this.onContentChange = cfg.onContentChange;
    this.onExpand = cfg.onExpand;
    this.onSend = cfg.onSend;
  }
}