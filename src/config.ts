/**
 * ConfigInterface define an object to configure the compose component.
 */
export interface ConfigInterface {
	subject: string;
	participants: string;
	avatarURL: string;
	contentHTML: string;
	fileMaxSize: number;
	height: number;
	hideAttachment: boolean;
	hideDiscard: boolean;
	hideExpand: boolean;
	hideSave: boolean;
	hideSend: boolean;
	onBlur: Function | null;
	onContentChange: Function | null;
	onFileDeletedBefore: Function | null;
	onExpand: Function | null;
	onDiscard: Function | null;
	onSave: Function | null;
	onSend: Function | null;
}

export class Config {
	subject = "";
	participants = "";
	avatarURL = "";
	contentHTML = "";
	fileMaxSize = 26214400;
	height = 0;
	hideAttachment = false;
	hideDiscard = false;
	hideExpand = false;
	hideSave = false;
	hideSend = false;
	onBlur: Function | null = null;
	onContentChange: Function | null = null;
	onExpand: Function | null = null;
	onFileDeletedBefore: Function | null = null;
	onDiscard: Function | null = null;
	onSave: Function | null = null;
	onSend: Function | null = null;

	constructor(cfg: ConfigInterface | null) {
		if (!cfg) {
			return;
		}

		this.contentHTML = cfg.contentHTML ? cfg.contentHTML : "";

		if (cfg.fileMaxSize && cfg.fileMaxSize > 0) {
			this.fileMaxSize = cfg.fileMaxSize;
		}
		if (cfg.height && cfg.height > 0) {
			this.height = cfg.height;
		}

		this.hideAttachment = cfg.hideAttachment;
		this.hideDiscard = cfg.hideDiscard;
		this.hideExpand = cfg.hideExpand;
		this.hideSave = cfg.hideSave;
		this.hideSend = cfg.hideSend;
		this.onBlur = cfg.onBlur;
		this.onContentChange = cfg.onContentChange;
		this.onExpand = cfg.onExpand;
		this.onFileDeletedBefore = cfg.onFileDeletedBefore;
		this.onDiscard = cfg.onDiscard;
		this.onSave = cfg.onSave;
		this.onSend = cfg.onSend;
	}
}
